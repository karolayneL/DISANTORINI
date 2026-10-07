'use client';

import React, { useState, useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  fetchCnpjData, 
  fetchCepData,
  formatCnpj, 
  formatCep, 
  sanitizeCnpj 
} from '@/lib/services/brasilapi';
import { supabase } from '@/lib/supabase/client';
import { Cliente } from '@/types/database';
import { 
  Building2, 
  Search, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  MapPin, 
  Phone, 
  Mail, 
  FileText 
} from 'lucide-react';

const clienteSchema = z.object({
  cnpj_cpf: z.string().min(14, 'CNPJ inválido'),
  tipo_pessoa: z.enum(['PJ', 'PF']).default('PJ'),
  razao_social: z.string().min(2, 'Razão Social é obrigatória'),
  nome_fantasia: z.string().optional(),
  inscricao_estadual: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
  whatsapp: z.string().optional(),
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().min(2, 'Cidade é obrigatória'),
  uf: z.string().length(2, 'UF deve ter 2 caracteres'),
  codigo_ibge: z.string().optional(),
  situacao_cadastral: z.string().optional(),
  cnae_principal: z.string().optional(),
  observacoes: z.string().optional(),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

export default function ClientesPage() {
  const [loadingCnpj, setLoadingCnpj] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [cnpjError, setCnpjError] = useState<string | null>(null);
  const [cnpjSuccess, setCnpjSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [clientesList, setClientesList] = useState<Cliente[]>([]);


  // Carrega os clientes diretamente do Supabase ao abrir a página
  const carregarClientes = async () => {
    try {
      setLoadingClientes(true);
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Erro ao carregar clientes do Supabase:', error.message);
      } else if (data) {
        setClientesList(data);
      }
    } catch (err) {
      console.warn('Falha na comunicação com Supabase:', err);
    } finally {
      setLoadingClientes(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      tipo_pessoa: 'PJ',
      uf: 'CE',
      cidade: 'Juazeiro do Norte',
    },
  });

  const cnpjValue = watch('cnpj_cpf');

  const handleBuscarCep = async (cepInput: string) => {
    const clean = cepInput.replace(/\D/g, '');
    if (clean.length === 8) {
      try {
        setLoadingCep(true);
        const data = await fetchCepData(clean);
        if (data.street) setValue('logradouro', data.street);
        if (data.neighborhood) setValue('bairro', data.neighborhood);
        if (data.city) setValue('cidade', data.city);
        if (data.state) setValue('uf', data.state.toUpperCase());
        // Garante que o campo de número fique limpo para o usuário digitar manualmente
        setValue('numero', '');
      } catch (err) {
        console.warn('Erro na busca de CEP:', err);
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleBuscarCnpj = async () => {
    if (!cnpjValue) {
      setCnpjError('Digite um CNPJ para buscar.');
      return;
    }

    const clean = sanitizeCnpj(cnpjValue);
    if (clean.length !== 14) {
      setCnpjError('O CNPJ deve conter 14 dígitos numéricos.');
      return;
    }

    try {
      setLoadingCnpj(true);
      setCnpjError(null);
      setCnpjSuccess(null);

      const data = await fetchCnpjData(clean);

      // Preenchimento automático do formulário com dados da Receita Federal via BrasilAPI
      const fullLogradouro = [data.descricao_tipo_de_logradouro, data.logradouro].filter(Boolean).join(' ');
      setValue('razao_social', data.razao_social || '');
      setValue('nome_fantasia', data.nome_fantasia || data.razao_social || '');
      setValue('cep', formatCep(data.cep));
      setValue('logradouro', fullLogradouro || data.logradouro || '');
      setValue('numero', data.numero || '');
      setValue('complemento', data.complemento || '');
      setValue('bairro', data.bairro || '');
      setValue('cidade', data.municipio || '');
      setValue('uf', data.uf || 'CE');
      setValue('codigo_ibge', String(data.codigo_municipio || ''));
      setValue('situacao_cadastral', data.descricao_situacao_cadastral || '');
      setValue('cnae_principal', `${data.cnae_fiscal} - ${data.cnae_fiscal_descricao}`);
      
      if (data.ddd_telefone_1) {
        setValue('telefone', data.ddd_telefone_1);
      }

      setCnpjSuccess(`Dados de "${data.razao_social}" carregados com sucesso!`);
    } catch (err: any) {
      setCnpjError(err.message || 'Erro ao consultar CNPJ na BrasilAPI.');
    } finally {
      setLoadingCnpj(false);
    }
  };

  const onSubmit = async (data: ClienteFormData) => {
    try {
      setSaving(true);
      setSaveMessage(null);

      // Limpa pontuação do CNPJ antes de gravar no banco para manter consistência
      const payload = {
        ...data,
        cnpj_cpf: sanitizeCnpj(data.cnpj_cpf),
        cnae_principal: data.cnae_principal ? String(data.cnae_principal).slice(0, 255) : null,
      };

      // Grava no Supabase
      const { data: inserted, error } = await supabase
        .from('clientes')
        .insert([payload])
        .select()
        .single();


      if (error) {
        console.error('Erro ao salvar no Supabase:', error);
        setSaveMessage({
          type: 'error',
          text: `Erro no Supabase: ${error.message}. (Verifique se executou o script SQL no Supabase)`,
        });
        return;
      }

      if (inserted) {
        setClientesList(prev => [inserted, ...prev]);
        setSaveMessage({
          type: 'success',
          text: `Cliente "${data.razao_social}" cadastrado e salvo com sucesso no banco de dados!`,
        });
        reset();
        setCnpjSuccess(null);
      }
    } catch (err: any) {
      setSaveMessage({
        type: 'error',
        text: err.message || 'Erro ao salvar cliente.',
      });
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-sky-400" />
            Módulo 1: Cadastro de Clientes
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Preenchimento automático via BrasilAPI (Receita Federal) e integração com Supabase.
          </p>
        </div>
      </div>

      {/* Formulário de Cadastro */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
          <Plus className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-semibold text-white">Novo Cliente (Pessoa Jurídica / Física)</h2>
        </div>

        {saveMessage && (
          <div className={`p-4 rounded-xl text-sm flex items-center gap-3 ${
            saveMessage.type === 'success' 
              ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/60 border border-rose-500/30 text-rose-300'
          }`}>
            {saveMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            )}
            <span>{saveMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">

          {/* Seção CNPJ + Busca BrasilAPI */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-sky-500/20 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-sky-300">
              Consulta de CNPJ na BrasilAPI (Auto-Preenchimento)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Ex: 00.000.000/0001-91 (apenas números ou formatado)"
                  {...register('cnpj_cpf')}
                  autoComplete="off"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-400"
                />
                {errors.cnpj_cpf && (
                  <p className="text-xs text-rose-400 mt-1">{errors.cnpj_cpf.message}</p>
                )}
              </div>
              <button
                type="button"
                onClick={handleBuscarCnpj}
                disabled={loadingCnpj}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all disabled:opacity-50"
              >
                {loadingCnpj ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Consultando...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Buscar CNPJ</span>
                  </>
                )}
              </button>
            </div>

            {cnpjError && (
              <p className="text-xs text-rose-400 flex items-center gap-1 mt-2">
                <AlertCircle className="w-3.5 h-3.5" />
                {cnpjError}
              </p>
            )}

            {cnpjSuccess && (
              <p className="text-xs text-emerald-400 flex items-center gap-1 mt-2">
                <CheckCircle className="w-3.5 h-3.5" />
                {cnpjSuccess}
              </p>
            )}
          </div>

          {/* Dados Empresariais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Razão Social *</label>
              <input
                type="text"
                {...register('razao_social')}
                placeholder="Razão Social completa"
                autoComplete="off"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-400"
              />
              {errors.razao_social && (
                <p className="text-xs text-rose-400 mt-1">{errors.razao_social.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nome Fantasia</label>
              <input
                type="text"
                {...register('nome_fantasia')}
                placeholder="Nome Fantasia"
                autoComplete="off"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          {/* Contatos & Inscrição */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Inscrição Estadual (IE)</label>
              <input
                type="text"
                {...register('inscricao_estadual')}
                placeholder="Isento ou nº da IE"
                autoComplete="off"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail Comercial</label>
              <input
                type="email"
                {...register('email')}
                placeholder="compras@cliente.com"
                autoComplete="off"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-400"
              />
              {errors.email && (
                <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Telefone Fixo</label>
              <input
                type="text"
                {...register('telefone')}
                placeholder="(88) 3511-0000"
                autoComplete="off"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp de Pedidos</label>
              <input
                type="text"
                {...register('whatsapp')}
                placeholder="(88) 99999-0000"
                autoComplete="off"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          {/* Endereço Completo */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>Endereço de Entrega e Faturamento</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>CEP</span>
                  {loadingCep && <span className="text-[10px] text-sky-400 animate-pulse">Buscando...</span>}
                </label>
                <input
                  type="text"
                  {...register('cep')}
                  onChange={(e) => {
                    register('cep').onChange(e);
                    handleBuscarCep(e.target.value);
                  }}
                  autoComplete="nope"
                  placeholder="63000-000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-400 font-mono"
                />
              </div>

              <div className="md:col-span-6">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Logradouro / Rua</label>
                <input
                  type="text"
                  {...register('logradouro')}
                  autoComplete="nope"
                  placeholder="Ex: Rua / Avenida / Travessa"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Número</label>
                <input
                  type="text"
                  {...register('numero')}
                  autoComplete="new-password"
                  placeholder="Ex: 782 ou S/N"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Complemento</label>
                <input
                  type="text"
                  {...register('complemento')}
                  autoComplete="nope"
                  placeholder="Galpão, Sala, Bloco..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bairro</label>
                <input
                  type="text"
                  {...register('bairro')}
                  autoComplete="nope"
                  placeholder="Bairro"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cidade *</label>
                <input
                  type="text"
                  {...register('cidade')}
                  autoComplete="nope"
                  placeholder="Cidade"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-400"
                />
                {errors.cidade && (
                  <p className="text-xs text-rose-400 mt-1">{errors.cidade.message}</p>
                )}
              </div>

              <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-slate-300 mb-1">UF *</label>
                <input
                  type="text"
                  maxLength={2}
                  {...register('uf')}
                  autoComplete="nope"
                  placeholder="CE"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white uppercase text-center focus:outline-none focus:border-sky-400 font-bold"
                />
                {errors.uf && (
                  <p className="text-xs text-rose-400 mt-1">{errors.uf.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Botões de Ação */}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando no Supabase...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Salvar Cliente</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Clientes Cadastrados */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-sky-400" />
          <span>Clientes Cadastrados ({clientesList.length})</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">CNPJ / CPF</th>
                <th className="py-3 px-4">Razão Social / Nome Fantasia</th>
                <th className="py-3 px-4">Cidade / UF</th>
                <th className="py-3 px-4">Contato</th>
                <th className="py-3 px-4">Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {clientesList.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-xs text-sky-300 font-semibold">
                    {formatCnpj(c.cnpj_cpf)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{c.razao_social}</div>
                    {c.nome_fantasia && (
                      <div className="text-xs text-slate-400">{c.nome_fantasia}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {c.cidade} - <span className="text-amber-400 font-semibold">{c.uf}</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    <div>{c.telefone || c.whatsapp || '-'}</div>
                    <div className="text-slate-400">{c.email || ''}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      {c.situacao_cadastral || 'ATIVO'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
