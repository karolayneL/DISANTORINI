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
        { fornecedorNome: 'Dublagens Ceará', precoUnitario: 2.30, disponivelEstoque: false },
      ],
    },
    {
      insumoId: '4',
      nome: 'Fivela Metal Ouro Light 10mm',
      quantidadePorPar: 2,
      cotacoes: [
        { fornecedorNome: 'Metais Altero', precoUnitario: 0.85, disponivelEstoque: true },
        { fornecedorNome: 'Fivelas Brasil', precoUnitario: 0.75, disponivelEstoque: true }, // Escolhido (2 * 0.75 = 1.50)
        { fornecedorNome: 'Acessórios SP', precoUnitario: 0.90, disponivelEstoque: true },
        { fornecedorNome: 'Ferragens Sul', precoUnitario: 0.70, disponivelEstoque: false },
      ],
    },
    {
      insumoId: '5',
      nome: 'Cola PVC / Adesivo de Contato (Litro)',
      quantidadePorPar: 0.02, // 20ml por par
      cotacoes: [
        { fornecedorNome: 'Química Killing', precoUnitario: 35.00, disponivelEstoque: true }, // Escolhido (0.02 * 35 = 0.70)
        { fornecedorNome: 'Adesivos Amazonas', precoUnitario: 38.00, disponivelEstoque: true },
        { fornecedorNome: 'Colas Nordeste', precoUnitario: 36.50, disponivelEstoque: true },
        { fornecedorNome: 'Fixadores BR', precoUnitario: 34.00, disponivelEstoque: false },
      ],
    }
  ]);

  // Cálculo automático do Custo do Produto via Engine
  const resultadoBOM = calcularCustoBOM(insumosBOM, custoCaixa);

  // Formação de Preço via Markup Divisor
  const precificacao = calcularMarkupDivisor({
    custoTotal: resultadoBOM.custoTotalPar,
    margemLucroPct: margemLucro,
    comissaoPct: comissao,
    impostosPct: impostos,
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Package className="w-5 h-5 text-[#d4af37]" />
            <span>Módulo 2 & 3: Ficha Técnica (BOM) & Formação de Preço</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Busca automática do menor preço em estoque para matérias-primas e cálculo com Markup Divisor.
          </p>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Dados do Produto & Foto */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#121216] p-6 rounded-2xl border border-[#23232b] shadow-xl space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 pb-3 border-b border-[#202028]">
              <Package className="w-4 h-4 text-[#d4af37]" />
              <span>Identificação do Calçado</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Referência do Modelo</label>
              <input
                type="text"
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
                className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Nome do Produto</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Categoria de Calçado</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as any)}
                className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              >
                <option value="Rasteira">Rasteira (Custo Base Ref: R$ 14,50)</option>
                <option value="Salto">Salto (Custo Base Ref: R$ 17,00)</option>
                <option value="Papete">Papete (Custo Base Ref: R$ 17,00)</option>
                <option value="Plataforma">Plataforma (Custo Base Ref: R$ 49,90)</option>
              </select>
            </div>

            {/* Upload para Supabase Storage */}
            <div className="p-4 rounded-xl border border-dashed border-[#2d2d38] bg-[#0d0d10] flex flex-col items-center justify-center text-center">
              <div className="w-9 h-9 rounded-lg bg-[#c5a059]/10 text-[#d4af37] flex items-center justify-center mb-1.5">
                <Upload className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold text-white">Upload de Foto do Calçado</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">Bucket público &quot;produtos&quot; (Supabase Storage)</p>
            </div>
          </div>

          {/* Card de Precificação Final (Markup) */}
          <div className="bg-[#121216] p-6 rounded-2xl border border-[#c5a059]/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#202028]">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Markup Divisor</span>
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#c5a059]/20 text-[#dfc175] font-bold">
                Divisor: {precificacao.divisorMarkup}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Margem (%)</label>
                <input
                  type="number"
                  value={margemLucro}
                  onChange={(e) => setMargemLucro(Number(e.target.value))}
                  className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Comissão (%)</label>
                <input
                  type="number"
                  value={comissao}
                  onChange={(e) => setComissao(Number(e.target.value))}
                  className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Impostos (%)</label>
                <input
                  type="number"
                  value={impostos}
                  onChange={(e) => setImpostos(Number(e.target.value))}
                  className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#09090b] border border-[#22222a] space-y-2">
              <div className="flex justify-between text-xs text-neutral-400">
                <span>Custo Matéria-Prima:</span>
                <span className="font-mono text-white font-medium">R$ {resultadoBOM.custoInsumos.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-neutral-400">
                <span>+ Caixa Externa (Obrigatório):</span>
                <span className="font-mono text-[#dfc175] font-semibold">R$ {resultadoBOM.custoCaixaExterna.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-white font-bold pt-2 border-t border-[#1e1e26]">
                <span>Custo Base por Par:</span>
                <span className="font-mono text-[#dfc175] text-sm">R$ {resultadoBOM.custoTotalPar.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-[#181820] to-[#0f0f13] border border-[#c5a059]/40 text-center space-y-1">
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#c5a059]">Preço Sugerido de Venda</p>
              <p className="text-3xl font-black text-white font-mono tracking-tight mt-1">
                R$ {precificacao.precoVenda.toFixed(2)}
              </p>
              <p className="text-[11px] text-emerald-400 font-medium mt-1">
                Lucro Líquido Estimado: R$ {precificacao.lucroAbsoluto.toFixed(2)} / par
              </p>
            </div>
          </div>
        </div>

        {/* Painel Direito: Lista de Insumos da Ficha Técnica (BOM) & Cotações */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#121216] p-6 rounded-2xl border border-[#23232b] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#202028]">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-[#d4af37]" />
                  <span>Estrutura de Insumos (BOM) & Inteligência de Compras</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
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
                    className="p-4 rounded-xl bg-[#0d0d10] border border-[#22222a] hover:border-[#2f2f3a] transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#181820] text-[#dfc175] font-semibold mr-2">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-white text-xs">{item.nome}</span>
                        <span className="text-[11px] text-neutral-500 ml-2">({item.quantidadePorPar} un/m/kg por par)</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-neutral-400">Subtotal p/ Par: </span>
                        <span className="text-xs font-mono font-bold text-[#dfc175]">
                          R$ {item.subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Grade de 4 Cotações */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-[#1e1e26]">
                      {insumoOriginal?.cotacoes.map((cot, cIdx) => {
                        const isChosen = cot.fornecedorNome === item.fornecedorEscolhido;
                        return (
                          <div 
                            key={cIdx} 
                            className={`p-2.5 rounded-lg text-xs transition-all ${
                              isChosen 
                                ? 'bg-[#c5a059]/15 border border-[#c5a059]/50 text-white shadow-sm'
                                : cot.disponivelEstoque
                                  ? 'bg-[#09090b] border border-[#23232b] text-neutral-300'
                                  : 'bg-[#09090b]/50 border border-[#1a1a20] text-neutral-600 opacity-50'
                            }`}
                          >
                            <div className="font-semibold truncate">{cot.fornecedorNome}</div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-mono font-bold">R$ {cot.precoUnitario.toFixed(2)}</span>
                              {isChosen ? (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-gradient-to-r from-[#dfc175] to-[#c5a059] text-black font-bold">
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
