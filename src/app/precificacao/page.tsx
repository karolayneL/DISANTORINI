'use client';

import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  DollarSign, 
  Percent, 
  Calculator, 
  Info 
} from 'lucide-react';
import { calcularMarkupDivisor } from '@/lib/pricing-engine';

export default function PrecificacaoPage() {
  const [custoInsumos, setCustoInsumos] = useState(13.20);
  const [custoCaixa, setCustoCaixa] = useState(1.30);
  const [margemLucro, setMargemLucro] = useState(30);
  const [comissao, setComissao] = useState(5);
  const [impostos, setImpostos] = useState(8.5);

  const custoTotal = custoInsumos + custoCaixa;
  const resultado = calcularMarkupDivisor({
    custoTotal,
    margemLucroPct: margemLucro,
    comissaoPct: comissao,
    impostosPct: impostos,
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-[#d4af37]" />
          <span>Módulo 3: Simulador Avançado de Markup Divisor</span>
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Fórmula industrial: <span className="font-mono text-[#dfc175]">Preço de Venda = Custo / (1 - ((Margem + Comissão + Impostos) / 100))</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Parâmetros de Entrada */}
        <div className="bg-[#121216] p-6 sm:p-7 rounded-2xl border border-[#23232b] space-y-5 shadow-xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 pb-3 border-b border-[#202028]">
            <Calculator className="w-4 h-4 text-[#d4af37]" />
            <span>Parâmetros de Custo & Deduções</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Custo de Matéria-Prima (BOM) por Par (R$)</label>
              <input
                type="number"
                step="0.10"
                value={custoInsumos}
                onChange={(e) => setCustoInsumos(Number(e.target.value))}
                className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Custo Adicional Obrigatório da Caixa Externa (R$)</label>
              <input
                type="number"
                step="0.05"
                value={custoCaixa}
                onChange={(e) => setCustoCaixa(Number(e.target.value))}
                className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-[#dfc175] font-mono focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Margem de Lucro Alvo (%)</label>
              <input
                type="number"
                step="0.5"
                value={margemLucro}
                onChange={(e) => setMargemLucro(Number(e.target.value))}
                className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Comissão de Vendas (%)</label>
              <input
                type="number"
                step="0.5"
                value={comissao}
                onChange={(e) => setComissao(Number(e.target.value))}
                className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Carga Tributária / Impostos (%)</label>
              <input
                type="number"
                step="0.1"
                value={impostos}
                onChange={(e) => setImpostos(Number(e.target.value))}
                className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>
        </div>

        {/* Resultado & Decomposição */}
        <div className="space-y-6">
          <div className="bg-[#121216] p-6 sm:p-7 rounded-2xl border border-[#c5a059]/40 space-y-6 shadow-2xl">
            <div className="text-center space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#c5a059]">Preço de Venda Final</span>
              <div className="text-4xl font-black text-white font-mono tracking-tight">
                R$ {resultado.precoVenda.toFixed(2)}
              </div>
              <p className="text-xs text-neutral-400 pt-1">
                Divisor de Markup Aplicado: <strong className="text-[#dfc175] font-mono">{resultado.divisorMarkup}</strong>
              </p>
            </div>

            {/* Decomposição do Valor */}
            <div className="space-y-3 pt-4 border-t border-[#202028] text-xs">
              <div className="flex justify-between items-center text-neutral-300">
                <span>Custo Fabril Total:</span>
                <span className="font-mono font-bold text-white">R$ {custoTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-400">
                <span>Lucro Líquido ({margemLucro}%):</span>
                <span className="font-mono font-bold">+ R$ {resultado.lucroAbsoluto.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[#dfc175]">
                <span>Comissão de Venda ({comissao}%):</span>
                <span className="font-mono font-bold">+ R$ {resultado.comissaoAbsoluta.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-rose-400">
                <span>Impostos ({impostos}%):</span>
                <span className="font-mono font-bold">+ R$ {resultado.impostosAbsoluto.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0d0d10] border border-[#23232b] text-xs text-neutral-400 flex items-start gap-3">
            <Info className="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" />
            <p>
              O <strong>Markup Divisor</strong> assegura que após a dedução dos percentuais sobre a receita bruta (venda), a fábrica mantenha exatamente a margem de lucro projetada sobre o custo dos calçados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
