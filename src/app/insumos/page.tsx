'use client';

import React, { useState } from 'react';
import { 
  Scissors, 
  Plus, 
  ShieldCheck, 
  Building2,
  DollarSign
} from 'lucide-react';

export default function InsumosPage() {
  const [insumos] = useState([
    {
      id: '1',
      codigo: 'INS-SOL-01',
      nome: 'Solado Rasteira PVC Virgem',
      categoria: 'Solados',
      unidade: 'PAR',
      cotacoes: [
        { fornecedor: 'Solados Juazeiro', preco: 4.80, estoque: true },
        { fornecedor: 'Injetados Cariri', preco: 4.50, estoque: true, menor: true },
        { fornecedor: 'Matrizes Sul', preco: 4.20, estoque: false },
        { fornecedor: 'Polímeros BR', preco: 5.10, estoque: true },
      ]
    },
    {
      id: '2',
      codigo: 'INS-SYN-01',
      nome: 'Napa Soft Sintética 1.0',
      categoria: 'Cabedais / Sintéticos',
      unidade: 'METRO',
      cotacoes: [
        { fornecedor: 'Cipatex Sintéticos', preco: 28.00, estoque: true, menor: true },
        { fornecedor: 'Tecidos & Cia', preco: 29.50, estoque: true },
        { fornecedor: 'Couros União', preco: 27.00, estoque: false },
        { fornecedor: 'Plásticos Fortaleza', preco: 31.00, estoque: true },
      ]
    },
    {
      id: '3',
      codigo: 'INS-PAL-01',
      nome: 'Palmilha Confort 4mm Dublada',
      categoria: 'Palmilhas',
      unidade: 'PAR',
      cotacoes: [
        { fornecedor: 'Palmilhas Nordeste', preco: 2.20, estoque: true, menor: true },
        { fornecedor: 'Espumas Cariri', preco: 2.40, estoque: true },
        { fornecedor: 'Conforto Total', preco: 2.50, estoque: true },
        { fornecedor: 'EVA Brasil', preco: 2.10, estoque: false },
      ]
    },
    {
      id: '4',
      codigo: 'INS-COL-01',
      nome: 'Adesivo PVC / Cola Extra',
      categoria: 'Adesivos & Químicos',
      unidade: 'LITRO',
      cotacoes: [
        { fornecedor: 'Química Killing', preco: 32.00, estoque: true, menor: true },
        { fornecedor: 'Adesivos Amazonas', preco: 34.00, estoque: true },
        { fornecedor: 'Química Arte', preco: 35.00, estoque: true },
        { fornecedor: 'SuperColas', preco: 30.00, estoque: false },
      ]
    }
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Scissors className="w-5 h-5 text-[#d4af37]" />
            <span>Módulo 2: Matérias-Primas, Fornecedores & Cotações</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Gestão de matérias-primas com exigência de no mínimo 4 cotações ativas por insumo.
          </p>
        </div>
      </div>

      {/* Tabela de Insumos */}
      <div className="space-y-4">
        {insumos.map((item) => (
          <div key={item.id} className="bg-[#121216] p-6 rounded-2xl border border-[#23232b] shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#202028]">
              <div className="flex items-center">
                <span className="text-xs font-mono font-bold text-[#dfc175] mr-2.5">{item.codigo}</span>
                <span className="font-bold text-white text-sm">{item.nome}</span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#181820] text-neutral-400 ml-3 border border-[#282832]">
                  {item.categoria} • {item.unidade}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Status:</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 4 cotações validadas
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {item.cotacoes.map((c, idx) => (
                <div 
                  key={idx}
                  className={`p-3.5 rounded-xl text-xs space-y-1.5 transition-all ${
                    c.menor 
                      ? 'bg-[#c5a059]/15 border border-[#c5a059]/50 text-white shadow-sm' 
                      : c.estoque 
                        ? 'bg-[#09090b] border border-[#23232b] text-neutral-300' 
                        : 'bg-[#09090b]/50 border border-[#1a1a20] text-neutral-600 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="truncate">{c.fornecedor}</span>
                    {c.menor && (
                      <span className="px-1.5 py-0.5 rounded bg-gradient-to-r from-[#dfc175] to-[#c5a059] text-black font-bold text-[9px] uppercase">
                        Menor Preço
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono text-sm font-bold text-white">
                      R$ {c.preco.toFixed(2)}
                    </span>
                    <span className={c.estoque ? 'text-emerald-400 text-[10px]' : 'text-rose-400 text-[10px]'}>
                      {c.estoque ? 'Em Estoque' : 'Indisponível'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
