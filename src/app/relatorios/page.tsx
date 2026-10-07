'use client';

import React, { useRef } from 'react';
import { 
  FileText, 
  Printer, 
  Building2, 
  CreditCard, 
  Package, 
  Sparkles
} from 'lucide-react';

export default function RelatoriosPage() {
  const dadosRelatorio = {
    numeroPedido: 'DS-2026-0842',
    dataEmissao: '05/10/2026',
    previsaoEntrega: '10/11/2026',
    cliente: {
      razaoSocial: 'CALCADOS SANTORINI LTDA',
      nomeFantasia: 'SANTORINI SHOES',
      cnpj: '07.273.714/0001-90',
      inscricaoEstadual: '06.123.456-7',
      endereco: 'Av. Padre Cícero, 1500 - Galpão 02, Triângulo',
      cidadeUf: 'Juazeiro do Norte - CE',
      contato: '(88) 3511-0000 / (88) 99999-8888',
      email: 'contato@santorinishoes.com.br'
    },
    condicaoPagamento: '50% crédito material, 50% Pix',
    categoriasResumo: [
      { categoria: 'Rasteiras', custoBaseSimulado: 14.50, pares: 137, subtotalCusto: 1986.50, precoVendaSugerido: 38.50, subtotalVenda: 5274.50 },
      { categoria: 'Saltos', custoBaseSimulado: 17.00, pares: 60, subtotalCusto: 1020.00, precoVendaSugerido: 45.00, subtotalVenda: 2700.00 },
      { categoria: 'Papetes', custoBaseSimulado: 17.00, pares: 40, subtotalCusto: 680.00, precoVendaSugerido: 45.00, subtotalVenda: 1800.00 },
      { categoria: 'Plataformas', custoBaseSimulado: 49.90, pares: 20, subtotalCusto: 998.00, precoVendaSugerido: 110.00, subtotalVenda: 2200.00 },
    ],
    custoCaixaPorPar: 1.30,
  };

  const totalPares = dadosRelatorio.categoriasResumo.reduce((a, b) => a + b.pares, 0);
  const totalCustoBase = dadosRelatorio.categoriasResumo.reduce((a, b) => a + b.subtotalCusto, 0);
  const totalCustoCaixas = totalPares * dadosRelatorio.custoCaixaPorPar;
  const totalVendaFinal = dadosRelatorio.categoriasResumo.reduce((a, b) => a + b.subtotalVenda, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header & Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#d4af37]" />
            <span>Módulo 5: Ordem de Produção & Relatório Comercial (PDF)</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Resumo desmembrado por categoria, cálculo de caixas externas, pagamentos e totais.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#dfc175] via-[#c5a059] to-[#a37f37] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir / Gerar PDF</span>
        </button>
      </div>

      {/* Relatório Formatado / A4 Impressão */}
      <div className="bg-[#121216] border border-[#23232b] rounded-2xl p-8 space-y-6 print:bg-white print:text-black print:p-0 print:border-none shadow-xl">
        {/* Cabeçalho do Documento */}
        <div className="flex justify-between items-start border-b border-[#202028] pb-6 print:border-neutral-300">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-widest text-white print:text-black">DISANTORINI</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059] print:text-black">
              ERP - X • Footwear Manufacturing OS
            </p>
            <p className="text-xs text-neutral-400 mt-1 print:text-neutral-600">
              Juazeiro do Norte - Polo Calçadista do Cariri, Ceará
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">Ordem de Produção & Faturamento</span>
            <div className="text-lg font-mono font-black text-[#dfc175] print:text-black">
              #{dadosRelatorio.numeroPedido}
            </div>
            <p className="text-xs text-neutral-400 print:text-neutral-600">Emissão: {dadosRelatorio.dataEmissao}</p>
          </div>
        </div>

        {/* Dados do Cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-[#0d0d10] border border-[#23232b] print:bg-neutral-50 print:border-neutral-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#dfc175] print:text-neutral-800">
              Dados do Destinatário / Cliente
            </span>
            <h3 className="font-bold text-sm text-white print:text-black mt-1">{dadosRelatorio.cliente.razaoSocial}</h3>
            <p className="text-xs text-neutral-400 print:text-neutral-700">CNPJ: {dadosRelatorio.cliente.cnpj} • IE: {dadosRelatorio.cliente.inscricaoEstadual}</p>
            <p className="text-xs text-neutral-400 print:text-neutral-700">{dadosRelatorio.cliente.endereco}</p>
            <p className="text-xs text-neutral-400 print:text-neutral-700">{dadosRelatorio.cliente.cidadeUf}</p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#dfc175] print:text-neutral-800">
              Condições Comerciais & Entrega
            </span>
            <div className="mt-1 space-y-1 text-xs">
              <p className="text-neutral-300 print:text-black">
                <strong>Condição:</strong> {dadosRelatorio.condicaoPagamento}
              </p>
              <p className="text-neutral-300 print:text-black">
                <strong>Previsão de Entrega:</strong> {dadosRelatorio.previsaoEntrega}
              </p>
              <p className="text-neutral-300 print:text-black">
                <strong>Contato:</strong> {dadosRelatorio.cliente.contato}
              </p>
            </div>
          </div>
        </div>

        {/* Tabela de Produtos por Categoria */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 print:text-black">
            Detalhamento por Categorias de Calçado
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300 print:text-black">
              <thead className="bg-[#09090b] text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-[#23232b] print:bg-neutral-100 print:text-neutral-800">
                <tr>
                  <th className="py-2.5 px-3">Categoria</th>
                  <th className="py-2.5 px-3">Custo Base Ref.</th>
                  <th className="py-2.5 px-3 text-center">Pares</th>
                  <th className="py-2.5 px-3 text-right">Subtotal Custo</th>
                  <th className="py-2.5 px-3 text-right">Preço Sugerido (Markup)</th>
                  <th className="py-2.5 px-3 text-right">Subtotal Venda</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e26] print:divide-neutral-200">
                {dadosRelatorio.categoriasResumo.map((cat, i) => (
                  <tr key={i}>
                    <td className="py-3 px-3 font-semibold text-white print:text-black">{cat.categoria}</td>
                    <td className="py-3 px-3 font-mono">R$ {cat.custoBaseSimulado.toFixed(2)}</td>
                    <td className="py-3 px-3 font-mono text-center font-bold text-[#dfc175] print:text-black">{cat.pares}</td>
                    <td className="py-3 px-3 font-mono text-right">R$ {cat.subtotalCusto.toFixed(2)}</td>
                    <td className="py-3 px-3 font-mono text-right">R$ {cat.precoVendaSugerido.toFixed(2)}</td>
                    <td className="py-3 px-3 font-mono text-right font-bold text-white print:text-black">R$ {cat.subtotalVenda.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totais & Resumo Final */}
        <div className="p-4 rounded-xl bg-[#09090b] border border-[#23232b] print:bg-neutral-100 print:border-neutral-300 space-y-2 text-xs">
          <div className="flex justify-between text-neutral-400 print:text-neutral-700">
            <span>Total de Pares do Lote:</span>
            <span className="font-mono font-bold text-white print:text-black">{totalPares} pares</span>
          </div>
          <div className="flex justify-between text-neutral-400 print:text-neutral-700">
            <span>Subtotal de Custo Fabril Base:</span>
            <span className="font-mono text-white print:text-black">R$ {totalCustoBase.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-neutral-400 print:text-neutral-700">
            <span>Custo Adicional Obrigatório de Caixas ({totalPares} un x R$ {dadosRelatorio.custoCaixaPorPar.toFixed(2)}):</span>
            <span className="font-mono text-[#dfc175] print:text-black font-semibold">R$ {totalCustoCaixas.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-neutral-400 print:text-neutral-700 pt-1 border-t border-[#1e1e26] print:border-neutral-300">
            <span>Custo Total Consolidado da Produção:</span>
            <span className="font-mono font-bold text-white print:text-black">R$ {(totalCustoBase + totalCustoCaixas).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-black text-white print:text-black pt-2 border-t border-[#2a2a36] print:border-neutral-400">
            <span>VALOR TOTAL DO PEDIDO (FATURAMENTO):</span>
            <span className="font-mono text-base text-[#dfc175] print:text-black">R$ {totalVendaFinal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
