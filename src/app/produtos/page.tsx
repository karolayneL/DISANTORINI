'use client';

import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Layers, 
  DollarSign, 
  Sparkles, 
  CheckCircle2, 
  Scissors, 
  TrendingUp,
  Percent,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { calcularCustoBOM, calcularMarkupDivisor, InsumoCotacaoCalculo } from '@/lib/pricing-engine';

export default function ProdutosPage() {
  const [referencia, setReferencia] = useState('SANTO-2026');
  const [nome, setNome] = useState('Sandália Rasteira Santorini Grécia');
  const [categoria, setCategoria] = useState<'Rasteira' | 'Salto' | 'Papete' | 'Plataforma'>('Rasteira');
  const [margemLucro, setMargemLucro] = useState(30);
  const [comissao, setComissao] = useState(5);
  const [impostos, setImpostos] = useState(8.5);
  const [custoCaixa, setCustoCaixa] = useState(1.30);
  const [fotoUrl, setFotoUrl] = useState('');

  // Simulação de insumos da Ficha Técnica (BOM) com cotações
  const [insumosBOM, setInsumosBOM] = useState<InsumoCotacaoCalculo[]>([
    {
      insumoId: '1',
      nome: 'Solado Rasteira PVC Virgem',
      quantidadePorPar: 1, // 1 par
      cotacoes: [
        { fornecedorNome: 'Solados Juazeiro', precoUnitario: 4.80, disponivelEstoque: true },
        { fornecedorNome: 'Injetados Cariri', precoUnitario: 4.50, disponivelEstoque: true }, // Escolhido
        { fornecedorNome: 'Matrizes Sul', precoUnitario: 4.20, disponivelEstoque: false }, // Indisponível
        { fornecedorNome: 'Polímeros BR', precoUnitario: 5.10, disponivelEstoque: true },
      ],
    },
    {
      insumoId: '2',
      nome: 'Napa Soft Sintética 1.0 (Metros)',
      quantidadePorPar: 0.15, // 0.15 m² por par
      cotacoes: [
        { fornecedorNome: 'Cipatex Sintéticos', precoUnitario: 28.00, disponivelEstoque: true }, // Escolhido (0.15 * 28 = 4.20)
        { fornecedorNome: 'Tecidos & Cia', precoUnitario: 29.50, disponivelEstoque: true },
        { fornecedorNome: 'Couros União', precoUnitario: 27.00, disponivelEstoque: false },
        { fornecedorNome: 'Plásticos Fortaleza', precoUnitario: 31.00, disponivelEstoque: true },
      ],
    },
    {
      insumoId: '3',
      nome: 'Palmilha Confort 4mm Dublada',
      quantidadePorPar: 1,
      cotacoes: [
        { fornecedorNome: 'Palmilhas Nordeste', precoUnitario: 2.20, disponivelEstoque: true }, // Escolhido
        { fornecedorNome: 'Espumas Cariri', precoUnitario: 2.40, disponivelEstoque: true },
        { fornecedorNome: 'Conforto Total', precoUnitario: 2.50, disponivelEstoque: true },
        { fornecedorNome: 'EVA Brasil', precoUnitario: 2.10, disponivelEstoque: false },
      ],
    },
    {
      insumoId: '4',
      nome: 'Adesivo PVC / Cola Extra',
      quantidadePorPar: 0.05, // 0.05 Litro
      cotacoes: [
        { fornecedorNome: 'Química Killing', precoUnitario: 32.00, disponivelEstoque: true }, // Escolhido (0.05 * 32 = 1.60)
        { fornecedorNome: 'Adesivos Amazonas', precoUnitario: 34.00, disponivelEstoque: true },
        { fornecedorNome: 'Química Arte', precoUnitario: 35.00, disponivelEstoque: true },
        { fornecedorNome: 'SuperColas', precoUnitario: 30.00, disponivelEstoque: false },
      ],
    }
  ]);

  // Executa cálculos em tempo real
  const resultadoBOM = calcularCustoBOM(insumosBOM, custoCaixa);
  const precificacao = calcularMarkupDivisor({
    custoTotal: resultadoBOM.custoTotalPar,
    margemLucroPct: margemLucro,
    comissaoPct: comissao,
    impostosPct: impostos,
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Package className="w-6 h-6 text-amber-400" />
          Módulo 2 & 3: Ficha Técnica (BOM) & Precificação Inteligente
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Busca automática do menor preço em estoque para matérias-primas e cálculo com Markup Divisor.
        </p>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Dados do Produto & Foto */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-sky-400" />
              <span>Identificação do Calçado</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Referência do Modelo</label>
              <input
                type="text"
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nome do Produto</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Categoria de Calçado</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Rasteira">Rasteira (Custo Base Ref: R$ 14,50)</option>
                <option value="Salto">Salto (Custo Base Ref: R$ 17,00)</option>
                <option value="Papete">Papete (Custo Base Ref: R$ 17,00)</option>
                <option value="Plataforma">Plataforma (Custo Base Ref: R$ 49,90)</option>
              </select>
            </div>

            {/* Upload Mock para Supabase Storage */}
            <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-900/50 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-200">Upload de Foto (Supabase Storage)</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Bucket público &quot;produtos&quot;</p>
            </div>
          </div>

          {/* Card de Precificação Final (Markup) */}
          <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-[#1c2541] to-[#0f172a] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Markup Divisor</span>
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                Divisor: {precificacao.divisorMarkup}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Margem (%)</label>
                <input
                  type="number"
                  value={margemLucro}
                  onChange={(e) => setMargemLucro(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Comissão (%)</label>
                <input
                  type="number"
                  value={comissao}
                  onChange={(e) => setComissao(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Impostos (%)</label>
                <input
                  type="number"
                  value={impostos}
                  onChange={(e) => setImpostos(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Custo Matéria-Prima:</span>
                <span className="font-mono text-slate-200">R$ {resultadoBOM.custoInsumos.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>+ Caixa Externa (Obrigatório):</span>
                <span className="font-mono text-amber-300 font-semibold">R$ {resultadoBOM.custoCaixaExterna.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300 font-bold pt-2 border-t border-slate-800">
                <span>Custo Base por Par:</span>
                <span className="font-mono text-sky-400 text-sm">R$ {resultadoBOM.custoTotalPar.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/70 to-teal-950/70 border border-emerald-500/30 text-center">
              <p className="text-xs uppercase font-semibold tracking-wider text-emerald-400">Preço Sugerido de Venda</p>
              <p className="text-3xl font-extrabold text-white mt-1">
                R$ {precificacao.precoVenda.toFixed(2)}
              </p>
              <p className="text-[11px] text-emerald-300/80 mt-1">
                Lucro Líquido Estimado: R$ {precificacao.lucroAbsoluto.toFixed(2)} / par
              </p>
            </div>
          </div>
        </div>

        {/* Painel Direito: Lista de Insumos da Ficha Técnica (BOM) & Cotações */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-sky-400" />
                  <span>Estrutura de Insumos (BOM) & Inteligência de Compras</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cada insumo avalia no mínimo 4 cotações e seleciona a mais barata em estoque.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {resultadoBOM.detalhesInsumos.map((item, idx) => {
                const insumoOriginal = insumosBOM.find(i => i.insumoId === item.insumoId);
                return (
                  <div 
                    key={item.insumoId} 
                    className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-400 font-semibold mr-2">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-white text-sm">{item.nome}</span>
                        <span className="text-xs text-slate-400 ml-2">({item.quantidadePorPar} un/m/kg por par)</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400">Subtotal p/ Par: </span>
                        <span className="text-sm font-mono font-bold text-emerald-400">
                          R$ {item.subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Grade de 4 Cotações */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80">
                      {insumoOriginal?.cotacoes.map((cot, cIdx) => {
                        const isChosen = cot.fornecedorNome === item.fornecedorEscolhido;
                        return (
                          <div 
                            key={cIdx} 
                            className={`p-2.5 rounded-lg text-xs transition-all ${
                              isChosen 
                                ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 shadow-md'
                                : cot.disponivelEstoque
                                  ? 'bg-slate-950/60 border border-slate-800 text-slate-300'
                                  : 'bg-slate-950/30 border border-slate-900 text-slate-500 opacity-60'
                            }`}
                          >
                            <div className="font-semibold truncate">{cot.fornecedorNome}</div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-mono font-bold">R$ {cot.precoUnitario.toFixed(2)}</span>
                              {isChosen ? (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold">
                                  Menor
                                </span>
                              ) : !cot.disponivelEstoque ? (
                                <span className="text-[10px] text-rose-400">S/ Estoque</span>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
