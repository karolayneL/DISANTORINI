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
      vTotTrib: (valorTotalVenda * 0.085).toFixed(2),
    },
    det: [
      {
        nItem: '1',
        prod: {
          cProd: 'SANTO-2026',
          xProd: `Sandália Rasteira Santorini Grécia - Cor: ${corSelecionada} - Grade 34 ao 42 (${totalPares} pares)`,
          NCM: '64022000',
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
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <ShoppingCart className="w-5 h-5 text-[#d4af37]" />
            <span>Módulo 4 & 5: Gestão de Lotes, Grade & Pedidos</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Distribuição de pares do 34 ao 42, consolidação de insumos e integração SEFAZ-CE.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setSefazPayloadModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#181820] hover:bg-[#202028] border border-[#c5a059]/40 text-[#dfc175] font-semibold text-xs transition-all shadow-sm cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Simulação JSON SEFAZ-CE</span>
          </button>
        </div>
      </div>

      {/* Grid de Criação de Pedido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Cabeçalho do Pedido */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#121216] p-6 rounded-2xl border border-[#23232b] shadow-xl space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 pb-3 border-b border-[#202028]">
              <CreditCard className="w-4 h-4 text-[#d4af37]" />
              <span>Dados Comerciais do Pedido</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Cliente</label>
              <select
                value={clienteNome}
                onChange={(e) => setClienteNome(e.target.value)}
                className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              >
                <option value="CALCADOS SANTORINI LTDA">CALCADOS SANTORINI LTDA (CE)</option>
                <option value="BOUTIQUE CARIRI">BOUTIQUE CARIRI CALCADOS (CE)</option>
                <option value="DISTRIBUIDORA NORDESTE">DISTRIBUIDORA NORDESTE SHOES (PE)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Modelo do Calçado</label>
              <select
                value={produtoReferencia}
                onChange={(e) => setProdutoReferencia(e.target.value)}
                className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              >
                <option value="SANTO-2026">SANTO-2026 - Rasteira Santorini Grécia</option>
                <option value="SANTO-BLOCO-01">SANTO-BLOCO-01 - Salto Bloco 5cm Nobre</option>
                <option value="SANTO-PAPETE-02">SANTO-PAPETE-02 - Papete Anatômica Couro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Cor do Catálogo Santorini</label>
              <select
                value={corSelecionada}
                onChange={(e) => setCorSelecionada(e.target.value)}
                className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              >
                {CORES_DISANTORINI.map((cor) => (
                  <option key={cor} value={cor}>
                    {cor}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Condição de Pagamento</label>
              <input
                type="text"
                value={condicaoPagamento}
                onChange={(e) => setCondicaoPagamento(e.target.value)}
                className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Previsão de Entrega</label>
              <input
                type="date"
                value={previsaoEntrega}
                onChange={(e) => setPrevisaoEntrega(e.target.value)}
                className="w-full bg-[#09090b] border border-[#272732] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Resumo Financeiro do Lote */}
          <div className="bg-[#121216] p-6 rounded-2xl border border-[#c5a059]/30 shadow-xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#d4af37] pb-2 border-b border-[#202028]">
              Resumo do Pedido
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Total de Pares:</span>
                <span className="font-bold text-white font-mono">{totalPares} pares</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Preço Unitário (Markup):</span>
                <span className="font-mono text-white">R$ {precoUnitarioVenda.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Custo Unitário Total:</span>
                <span className="font-mono text-[#dfc175]">R$ {custoUnitarioBase.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-[#1e1e26] flex justify-between text-sm font-bold text-white">
                <span>Faturamento Total:</span>
                <span className="font-mono text-white">R$ {valorTotalVenda.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-emerald-400">
                <span>Margem Bruta Prevista:</span>
                <span className="font-mono">R$ {(valorTotalVenda - valorTotalCusto).toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#dfc175] via-[#c5a059] to-[#a37f37] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer mt-2"
            >
              Emitir Ordem de Produção
            </button>
          </div>
        </div>

        {/* Painel Direito: Grade de Tamanhos & Explosão do Lote */}
        <div className="lg:col-span-2 space-y-6">
          {/* Grade 34 ao 42 */}
          <div className="bg-[#121216] p-6 rounded-2xl border border-[#23232b] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#202028]">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#d4af37]" />
                  <span>Distribuição da Grade (34 ao 42)</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Informe a quantidade de pares por numeração do lote industrial.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-[#c5a059]/15 text-[#dfc175] border border-[#c5a059]/30">
                Total: {totalPares} pares
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2.5">
              {[34, 35, 36, 37, 38, 39, 40, 41, 42].map((num) => (
                <div key={num} className="bg-[#09090b] border border-[#272732] rounded-xl p-2.5 text-center space-y-1">
                  <span className="text-xs font-bold text-[#d4af37] block">Nº {num}</span>
                  <input
                    type="number"
                    min="0"
                    value={grade[num as keyof typeof grade]}
                    onChange={(e) => handleGradeChange(num, parseInt(e.target.value) || 0)}
                    className="w-full bg-[#121216] border border-[#2a2a36] rounded-lg text-center font-mono font-bold text-white text-sm py-1.5 focus:outline-none focus:border-[#d4af37]"
                  />
                  <span className="text-[10px] text-neutral-500">pares</span>
                </div>
              ))}
            </div>
          </div>

          {/* Explosão do Lote (Consumo Total de Insumos) */}
          <div className="bg-[#121216] p-6 rounded-2xl border border-[#23232b] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#202028]">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-[#d4af37]" />
                  <span>Explosão do Lote & Requisição de Almoxarifado</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Multiplicação exata da Ficha Técnica (BOM) pelo total de {totalPares} pares.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-[#09090b] text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-[#23232b]">
                  <tr>
                    <th className="py-2.5 px-3">Insumo Requisitado</th>
                    <th className="py-2.5 px-3">Consumo / Par</th>
                    <th className="py-2.5 px-3">Total Necessário (Lote)</th>
                    <th className="py-2.5 px-3">Fornecedor Cotado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e26]">
                  {insumosConsolidados.map((ins, idx) => (
                    <tr key={idx} className="hover:bg-[#181820] transition-colors">
                      <td className="py-3 px-3 font-semibold text-white">{ins.nome}</td>
                      <td className="py-3 px-3 font-mono text-neutral-400">{ins.consumoPorPar}</td>
                      <td className="py-3 px-3 font-mono font-bold text-[#dfc175]">{ins.total}</td>
                      <td className="py-3 px-3 text-neutral-300">{ins.fornecedor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal SEFAZ-CE */}
      {sefazPayloadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-[#23232b] rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#202028]">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[#d4af37]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Payload Estruturado SEFAZ-CE (NFe 4.0)</h3>
              </div>
              <button
                onClick={() => setSefazPayloadModal(false)}
                className="text-neutral-400 hover:text-white text-xs font-bold px-2 py-1 rounded bg-[#181820]"
              >
                ✕ Fechar
              </button>
            </div>
            
            <p className="text-xs text-neutral-400">
              Estrutura JSON pronta para transmissão ao WebService da SEFAZ Ceará para faturamento de calçados (NCM 6402.20.00).
            </p>

            <pre className="bg-[#09090b] border border-[#23232b] p-4 rounded-xl text-[11px] font-mono text-[#dfc175] overflow-x-auto max-h-80">
              {JSON.stringify(payloadSefazCE, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
