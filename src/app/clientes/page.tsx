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

      // Preenchimento automático do formulário com dados da Receita Federal
      const fullLogradouro = [data.descricao_tipo_de_logradouro, data.logradouro].filter(Boolean).join(' ');
      setValue('razao_social', data.razao_social || '');
      setValue('nome_fantasia', data.nome_fantasia || data.razao_social || '');
      setValue('cep', formatCep(data.cep));
      setValue('logradouro', fullLogradouro || data.logradouro || '');
      setValue('numero', data.numero || '');
      setValue('complemento', data.complemento || '');
      setValue('bairro', data.bairro || '');
      setValue('cidade', data.municipio || '');
      setValue('uf', (data.uf || 'CE').toUpperCase());
      setValue('codigo_ibge', String(data.codigo_municipio || ''));
      setValue('situacao_cadastral', data.descricao_situacao_cadastral || '');
      
      const cnaeText = [data.cnae_fiscal, data.cnae_fiscal_descricao].filter(Boolean).join(' - ');
      if (cnaeText) {
        setValue('cnae_principal', cnaeText);
      }
      
      if (data.ddd_telefone_1) {
        setValue('telefone', data.ddd_telefone_1);
      }

      if (data.email) {
        setValue('email', data.email.toLowerCase());
      }

      setCnpjSuccess(`Dados de "${data.razao_social}" carregados com sucesso!`);
    } catch (err: any) {
      setCnpjError(err.message || 'Erro ao consultar CNPJ.');
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
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-[#d4af37]" />
            <span>Módulo 1: Cadastro de Clientes</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Preenchimento automático via BrasilAPI (Receita Federal) e integração com Supabase.
          </p>
        </div>
      </div>

      {/* Formulário de Cadastro */}
      <div className="bg-[#121216] p-6 sm:p-7 rounded-2xl border border-[#23232b] shadow-xl space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-[#202028]">
          <Plus className="w-4 h-4 text-[#d4af37]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Novo Cliente (Pessoa Jurídica / Física)</h2>
        </div>

        {saveMessage && (
          <div className={`p-4 rounded-xl text-xs flex items-center gap-3 ${
            saveMessage.type === 'success' 
              ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border border-rose-500/30 text-rose-300'
          }`}>
            {saveMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            )}
            <span>{saveMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">

          {/* Seção CNPJ + Busca BrasilAPI */}
          <div className="p-4 rounded-xl bg-[#0d0d10] border border-[#262632] space-y-3">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#dfc175]">
              Consulta de CNPJ na BrasilAPI (Auto-Preenchimento)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Ex: 00.000.000/0001-91 (apenas números ou formatado)"
                  {...register('cnpj_cpf')}
                  autoComplete="off"
                  className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 font-mono"
                />
                {errors.cnpj_cpf && (
                  <p className="text-[11px] text-rose-400 mt-1">{errors.cnpj_cpf.message}</p>
                )}
              </div>
              <button
                type="button"
                onClick={handleBuscarCnpj}
                disabled={loadingCnpj}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#dfc175] to-[#c5a059] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {loadingCnpj ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                    <span>Consultando...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Buscar CNPJ</span>
                  </>
                )}
              </button>
            </div>

            {cnpjError && (
              <p className="text-[11px] text-rose-400 flex items-center gap-1.5 mt-2">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{cnpjError}</span>
              </p>
            )}

            {cnpjSuccess && (
              <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 mt-2">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{cnpjSuccess}</span>
              </p>
            )}
          </div>

          {/* Dados Empresariais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Razão Social *</label>
              <input
                type="text"
                {...register('razao_social')}
                placeholder="Razão Social completa"
                autoComplete="off"
                className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4af37]"
              />
              {errors.razao_social && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.razao_social.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Nome Fantasia</label>
              <input
                type="text"
                {...register('nome_fantasia')}
                placeholder="Nome Fantasia"
                autoComplete="off"
                className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Contatos & Inscrição */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Inscrição Estadual (IE)</label>
              <input
                type="text"
                {...register('inscricao_estadual')}
                placeholder="Isento ou nº da IE"
                autoComplete="off"
                className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">E-mail Comercial</label>
              <input
                type="email"
                {...register('email')}
                placeholder="compras@cliente.com"
                autoComplete="off"
                className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4af37]"
              />
              {errors.email && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Telefone Fixo</label>
              <input
                type="text"
                {...register('telefone')}
                placeholder="(88) 3511-0000"
                autoComplete="off"
                className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">WhatsApp de Pedidos</label>
              <input
                type="text"
                {...register('whatsapp')}
                placeholder="(88) 99999-0000"
                autoComplete="off"
                className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Endereço Completo */}
          <div className="p-4 rounded-xl bg-[#0d0d10] border border-[#22222a] space-y-4">
            <div className="flex items-center gap-2 text-neutral-300 text-[11px] font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Endereço de Entrega e Faturamento</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center justify-between">
                  <span>CEP</span>
                  {loadingCep && <span className="text-[10px] text-[#dfc175] animate-pulse">Buscando...</span>}
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
                  className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4af37] font-mono"
                />
              </div>

              <div className="md:col-span-6">
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Logradouro / Rua</label>
                <input
                  type="text"
                  {...register('logradouro')}
                  autoComplete="nope"
                  placeholder="Ex: Rua / Avenida / Travessa"
                  className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Número</label>
                <input
                  type="text"
                  {...register('numero')}
                  autoComplete="new-password"
                  placeholder="Ex: 782 ou S/N"
                  className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Complemento</label>
                <input
                  type="text"
                  {...register('complemento')}
                  autoComplete="nope"
                  placeholder="Galpão, Sala, Bloco..."
                  className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Bairro</label>
                <input
                  type="text"
                  {...register('bairro')}
                  autoComplete="nope"
                  placeholder="Bairro"
                  className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Cidade *</label>
                <input
                  type="text"
                  {...register('cidade')}
                  autoComplete="nope"
                  placeholder="Cidade"
                  className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4af37]"
                />
                {errors.cidade && (
                  <p className="text-[11px] text-rose-400 mt-1">{errors.cidade.message}</p>
                )}
              </div>

              <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-neutral-300 mb-1">UF *</label>
                <input
                  type="text"
                  maxLength={2}
                  {...register('uf')}
                  autoComplete="nope"
                  placeholder="CE"
                  className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white uppercase text-center focus:outline-none focus:border-[#d4af37] font-bold"
                />
                {errors.uf && (
                  <p className="text-[11px] text-rose-400 mt-1">{errors.uf.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#dfc175] via-[#c5a059] to-[#a37f37] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                  <span>Salvando no Supabase...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Salvar Cliente</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Clientes Cadastrados */}
      <div className="bg-[#121216] p-6 sm:p-7 rounded-2xl border border-[#23232b] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#d4af37]" />
            <span>Clientes Cadastrados ({clientesList.length})</span>
          </h2>
          {loadingClientes && (
            <span className="text-xs text-neutral-400 flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d4af37]" />
              <span>Sincronizando banco...</span>
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#09090b] text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-[#23232b]">
              <tr>
                <th className="py-3 px-4">CNPJ / CPF</th>
                <th className="py-3 px-4">Razão Social / Nome Fantasia</th>
                <th className="py-3 px-4">Cidade / UF</th>
                <th className="py-3 px-4">Contato</th>
                <th className="py-3 px-4">Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e26]">
              {clientesList.length === 0 && !loadingClientes && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-500">
                    Nenhum cliente cadastrado até o momento.
                  </td>
                </tr>
              )}
              {clientesList.map((c) => (
                <tr key={c.id} className="hover:bg-[#181820] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-xs text-[#dfc175] font-medium">
                    {formatCnpj(c.cnpj_cpf)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{c.razao_social}</div>
                    {c.nome_fantasia && (
                      <div className="text-[11px] text-neutral-400">{c.nome_fantasia}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {c.cidade} - <span className="text-[#d4af37] font-semibold">{c.uf}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div>{c.telefone || c.whatsapp || '-'}</div>
                    <div className="text-neutral-500">{c.email || ''}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#dfc175]">
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

