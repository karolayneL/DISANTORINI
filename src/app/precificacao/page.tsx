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
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Layers className="w-6 h-6 text-amber-400" />
          Módulo 3: Simulador Avançado de Markup Divisor
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Fórmula de precisão industrial: <span className="font-mono text-sky-400">Preço de Venda = Custo / (1 - ((Margem + Comissão + Impostos) / 100))</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Parâmetros de Entrada */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <h2 className="text-base font-semibold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Calculator className="w-5 h-5 text-sky-400" />
            <span>Parâmetros de Custo & Deduções</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Custo de Matéria-Prima (BOM) por Par (R$)</label>
              <input
                type="number"
                step="0.10"
                value={custoInsumos}
                onChange={(e) => setCustoInsumos(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Custo Adicional Obrigatório da Caixa Externa (R$)</label>
              <input
                type="number"
                step="0.05"
                value={custoCaixa}
                onChange={(e) => setCustoCaixa(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-amber-300 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Margem de Lucro Alvo (%)</label>
              <input
                type="number"
                step="0.5"
                value={margemLucro}
                onChange={(e) => setMargemLucro(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Comissão de Vendas (%)</label>
              <input
                type="number"
                step="0.5"
                value={comissao}
                onChange={(e) => setComissao(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Carga Tributária / Impostos (%)</label>
              <input
                type="number"
                step="0.1"
                value={impostos}
                onChange={(e) => setImpostos(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Resultado & Decomposição */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-amber-500/40 bg-gradient-to-b from-[#1c2541] to-[#0d1633] space-y-6 shadow-2xl">
            <div className="text-center space-y-1">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400">Preço de Venda Final</span>
              <div className="text-4xl font-extrabold text-white font-mono">
                R$ {resultado.precoVenda.toFixed(2)}
              </div>
              <p className="text-xs text-slate-400">
                Divisor de Markup Aplicado: <strong className="text-sky-300 font-mono">{resultado.divisorMarkup}</strong>
              </p>
            </div>

            {/* Decomposição do Valor */}
            <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Custo Fabril Total:</span>
                <span className="font-mono font-bold text-slate-200">R$ {custoTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-400">
                <span>Lucro Líquido ({margemLucro}%):</span>
                <span className="font-mono font-bold">+ R$ {resultado.lucroAbsoluto.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sky-400">
                <span>Comissão de Venda ({comissao}%):</span>
                <span className="font-mono font-bold">+ R$ {resultado.comissaoAbsoluta.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-rose-400">
                <span>Impostos ({impostos}%):</span>
                <span className="font-mono font-bold">+ R$ {resultado.impostosAbsoluto.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
            <Info className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
            <p>
              O <strong>Markup Divisor</strong> assegura que após a dedução dos percentuais sobre a receita bruta (venda), a fábrica mantenha exatamente a margem de lucro projetada sobre o custo dos calçados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
