'use client';

import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Layers, 
  FileText, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  Scissors,
  Download,
  Send
} from 'lucide-react';

const CORES_DISANTORINI = [
  'Preto',
  'Caramelo',
  'Nude',
  'Branco',
  'Off White',
  'Champanhe',
  'Magenta',
  'Preto VZ',
  'Caramelo VZ',
  'Nude VZ',
  'Ouro Light TPU',
  'Prata',
];

export default function PedidosPage() {
  const [clienteNome, setClienteNome] = useState('CALCADOS SANTORINI LTDA (CNPJ: 07.273.714/0001-90)');
  const [produtoReferencia, setProdutoReferencia] = useState('SANTO-2026 - Sandália Rasteira Grécia (Rasteira)');
  const [corSelecionada, setCorSelecionada] = useState('Ouro Light TPU');
  const [condicaoPagamento, setCondicaoPagamento] = useState('50% crédito material, 50% Pix');
  const [previsaoEntrega, setPrevisaoEntrega] = useState('2026-11-10');
  
  // Grade de Tamanhos 34 ao 42
  const [grade, setGrade] = useState({
    34: 5,
    35: 10,
    36: 25,
    37: 35,
    38: 30,
    39: 15,
    40: 10,
    41: 5,
    42: 2,
  });

  const [sefazPayloadModal, setSefazPayloadModal] = useState(false);

  const totalPares = Object.values(grade).reduce((acc, curr) => acc + curr, 0);
  const precoUnitarioVenda = 38.50; // Preço calculado via Markup
  const custoUnitarioBase = 14.50; // Custo base simulado (Rasteira)
  const valorTotalVenda = totalPares * precoUnitarioVenda;
  const valorTotalCusto = totalPares * custoUnitarioBase;

  const handleGradeChange = (tamanho: number, valor: number) => {
    setGrade(prev => ({
      ...prev,
      [tamanho]: Math.max(0, valor || 0),
    }));
  };

  // Explosão do Lote (Consumo total de insumos)
  const insumosConsolidados = [
    { nome: 'Solados Rasteira PVC Virgem', consumoPorPar: '1.0 par', total: `${totalPares} pares`, fornecedor: 'Injetados Cariri' },
    { nome: 'Napa Soft Sintética 1.0', consumoPorPar: '0.15 m²', total: `${(totalPares * 0.15).toFixed(2)} m²`, fornecedor: 'Cipatex Sintéticos' },
    { nome: 'Palmilha Confort 4mm Dublada', consumoPorPar: '1.0 par', total: `${totalPares} pares`, fornecedor: 'Palmilhas Nordeste' },
    { nome: 'Adesivo PVC / Cola Extra', consumoPorPar: '0.05 L', total: `${(totalPares * 0.05).toFixed(2)} Litros`, fornecedor: 'Química Killing' },
    { nome: 'Caixa Externa Individual DISANTORINI', consumoPorPar: '1.0 un', total: `${totalPares} unidades`, fornecedor: 'Embalagens Juazeiro' },
  ];

  const payloadSefazCE = {
    ide: {
      cUF: '23', // Ceará
      natOp: 'VENDA DE PRODUCAO DO ESTABELECIMENTO',
      mod: '55',
      serie: '1',
      nNF: '1042',
      dhEmi: new Date().toISOString(),
      tpNF: '1', // Saída
    },
    emit: {
      CNPJ: '07273714000190',
      xNome: 'D I S A N T O R I N I - FABRICA DE CALCADOS LTDA',
      UF: 'CE',
    },
    dest: {
      CNPJ: '07273714000190',
      xNome: 'CALCADOS SANTORINI LTDA',
      UF: 'CE',
    },
    total: {
      vProd: valorTotalVenda.toFixed(2),
      vNF: valorTotalVenda.toFixed(2),
      vTotTrib: (valorTotalVenda * 0.085).toFixed(2), // 8.5% impostos
    },
    det: [
      {
        nItem: '1',
        prod: {
          cProd: 'SANTO-2026',
          xProd: `Sandália Rasteira Santorini Grécia - Cor: ${corSelecionada} - Grade 34 ao 42 (${totalPares} pares)`,
          NCM: '64022000', // Calçados com sola e parte superior de borracha ou plástico
          CFOP: '5101',
          uCom: 'PAR',
          qCom: totalPares.toString(),
          vUnCom: precoUnitarioVenda.toFixed(2),
          vProd: valorTotalVenda.toFixed(2),
        }
      }
    ],
    pag: {
      tPag: '99',
      descricao: condicaoPagamento,
      vPag: valorTotalVenda.toFixed(2),
    },
    infAdic: {
      infCpl: `Previsão de Entrega: ${previsaoEntrega}. Lote Industrial DISANTORINI ERP-X.`,
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-sky-400" />
            Módulo 4 & 5: Gestão de Lotes, Grade & Exportação
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Distribuição de pares do 34 ao 42, consolidação de insumos e integração com SEFAZ-CE.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setSefazPayloadModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-600/20"
          >
            <Send className="w-4 h-4" />
            <span>Simulação SEFAZ-CE</span>
          </button>
        </div>
      </div>

      {/* Grid de Criação de Pedido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Cabeçalho do Pedido */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Dados Comerciais do Pedido</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Cliente</label>
              <input
                type="text"
                value={clienteNome}
                onChange={(e) => setClienteNome(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Produto / Ficha Técnica</label>
              <input
                type="text"
                value={produtoReferencia}
                onChange={(e) => setProdutoReferencia(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Cor do Catálogo (12 Pré-Definidas)</label>
              <select
                value={corSelecionada}
                onChange={(e) => setCorSelecionada(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
              >
                {CORES_DISANTORINI.map((cor) => (
                  <option key={cor} value={cor}>{cor}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Condição de Pagamento</label>
              <input
                type="text"
                value={condicaoPagamento}
                onChange={(e) => setCondicaoPagamento(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Previsão de Entrega</label>
              <input
                type="date"
                value={previsaoEntrega}
                onChange={(e) => setPrevisaoEntrega(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          {/* Resumo Financeiro */}
          <div className="glass-panel p-6 rounded-2xl border border-sky-500/30 space-y-3">
            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider">Totalização do Pedido</h3>
            <div className="flex justify-between text-sm text-slate-300">
              <span>Total de Pares no Lote:</span>
              <span className="font-bold text-white">{totalPares} pares</span>
            </div>
            <div className="flex justify-between text-sm text-slate-300">
              <span>Custo Total Estimado:</span>
              <span className="font-mono text-slate-400">R$ {valorTotalCusto.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-emerald-400 pt-2 border-t border-slate-800">
              <span>Valor Total de Venda:</span>
              <span className="font-mono text-xl">R$ {valorTotalVenda.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Painel Direito: Grade de Tamanhos & Explosão de Insumos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Grade 34 ao 42 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <span>Grade de Tamanhos (Padrão 34 ao 42)</span>
              </h2>
              <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-full">
                Soma: {totalPares} pares
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-9 gap-3">
              {[34, 35, 36, 37, 38, 39, 40, 41, 42].map((tam) => (
                <div key={tam} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1.5">
                  <span className="text-xs font-bold text-sky-400 block font-mono">Nº {tam}</span>
                  <input
                    type="number"
                    min="0"
                    value={grade[tam as keyof typeof grade]}
                    onChange={(e) => handleGradeChange(tam, parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-1.5 text-center text-sm font-bold text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Explosão do Lote (Consumo Total de Insumos) */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-emerald-400" />
                  <span>Consumo Total de Insumos para este Lote ({totalPares} pares)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Multiplicação automática da ficha técnica pelo total de pares do pedido.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Matéria-Prima</th>
                    <th className="py-2.5 px-3">Consumo / Par</th>
                    <th className="py-2.5 px-3 text-emerald-400 font-bold">Total Necessário</th>
                    <th className="py-2.5 px-3">Fornecedor Sugerido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {insumosConsolidados.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-medium text-white">{item.nome}</td>
                      <td className="py-3 px-3 text-slate-400">{item.consumoPorPar}</td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400 text-sm">{item.total}</td>
                      <td className="py-3 px-3 text-slate-300">{item.fornecedor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal / Visualizador SEFAZ-CE */}
      {sefazPayloadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl p-6 rounded-2xl border border-purple-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-purple-300 flex items-center gap-2">
                <Send className="w-5 h-5 text-purple-400" />
                <span>Payload Virtual de Integração SEFAZ-CE (NFe 4.00)</span>
              </h3>
              <button
                onClick={() => setSefazPayloadModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Fechar
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Estrutura pronta em JSON para transmissão ao web service da Secretaria da Fazenda do Estado do Ceará:
            </p>

            <pre className="p-4 rounded-xl bg-slate-950 text-xs font-mono text-emerald-400 overflow-x-auto max-h-96 border border-slate-800">
              {JSON.stringify(payloadSefazCE, null, 2)}
            </pre>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(payloadSefazCE, null, 2));
                  alert('Payload SEFAZ-CE copiado para a área de transferência!');
                }}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all"
              >
                Copiar JSON do Payload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
