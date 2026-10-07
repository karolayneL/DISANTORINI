'use client';

import React, { useRef } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Building2, 
  Calendar, 
  CreditCard, 
  Package, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function RelatoriosPage() {
  const relatorioRef = useRef<HTMLDivElement>(null);

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
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-sky-400" />
            Módulo 5: Ordem de Produção & Relatório Comercial (PDF)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Resumo desmembrado por categoria, cálculo de caixas externas, pagamentos e totais.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-lg shadow-sky-500/20 transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir / Salvar em PDF</span>
        </button>
      </div>

      {/* Documento de Impressão / Folha do Pedido */}
      <div 
        ref={relatorioRef} 
        className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-2xl border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0 space-y-8"
      >
        {/* Cabeçalho da Empresa */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
          <div>
            <h2 className="text-2xl font-black tracking-widest text-slate-900">D I S A N T O R I N I</h2>
            <p className="text-xs uppercase tracking-wider font-bold text-slate-600">
              Indústria e Comércio de Calçados Femininos Ltda
            </p>
            <p className="text-xs text-slate-500 mt-1">Polo Calçadista do Cariri • Ceará - Brasil</p>
          </div>
          <div className="text-right">
            <div className="inline-block px-3 py-1 rounded bg-slate-900 text-white font-mono font-bold text-sm">
              PEDIDO #{dadosRelatorio.numeroPedido}
            </div>
            <p className="text-xs text-slate-500 mt-1">Emissão: {dadosRelatorio.dataEmissao}</p>
            <p className="text-xs font-bold text-emerald-700">Previsão Entrega: {dadosRelatorio.previsaoEntrega}</p>
          </div>
        </div>

        {/* Dados do Cliente */}
        <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="font-bold text-slate-500 uppercase block text-[10px]">Cliente / Razão Social</span>
            <span className="font-bold text-slate-900 text-sm">{dadosRelatorio.cliente.razaoSocial}</span>
            <p className="text-slate-600 mt-0.5">Nome Fantasia: {dadosRelatorio.cliente.nomeFantasia}</p>
            <p className="text-slate-600">CNPJ: {dadosRelatorio.cliente.cnpj} • IE: {dadosRelatorio.cliente.inscricaoEstadual}</p>
          </div>
          <div>
            <span className="font-bold text-slate-500 uppercase block text-[10px]">Endereço & Contatos</span>
            <p className="text-slate-800 font-medium">{dadosRelatorio.cliente.endereco}</p>
            <p className="text-slate-800">{dadosRelatorio.cliente.cidadeUf}</p>
            <p className="text-slate-600 mt-0.5">Tel: {dadosRelatorio.cliente.contato}</p>
          </div>
        </div>

        {/* Tabela Desmembrada por Categorias */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Desmembramento do Pedido por Categoria de Calçado
          </h3>
          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
              <tr>
                <th className="p-2.5">Categoria</th>
                <th className="p-2.5 text-center">Qte (Pares)</th>
                <th className="p-2.5 text-right">Custo Base Ref.</th>
                <th className="p-2.5 text-right">Subtotal Custo</th>
                <th className="p-2.5 text-right">Preço Venda Un.</th>
                <th className="p-2.5 text-right">Subtotal Venda</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {dadosRelatorio.categoriasResumo.map((cat, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-900">{cat.categoria}</td>
                  <td className="p-2.5 text-center font-bold">{cat.pares}</td>
                  <td className="p-2.5 text-right text-slate-600 font-mono">R$ {cat.custoBaseSimulado.toFixed(2)}</td>
                  <td className="p-2.5 text-right text-slate-700 font-mono">R$ {cat.subtotalCusto.toFixed(2)}</td>
                  <td className="p-2.5 text-right font-mono font-semibold text-slate-900">R$ {cat.precoVendaSugerido.toFixed(2)}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-slate-900">R$ {cat.subtotalVenda.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cálculo de Caixas e Condição Comercial */}
        <div className="grid grid-cols-2 gap-6 pt-2">
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-500 uppercase block text-[10px]">Condição Comercial & Embalagens</span>
            <div>
              <span className="font-semibold text-slate-700">Forma de Pagamento Acordada:</span>
              <p className="font-bold text-slate-900 mt-0.5">{dadosRelatorio.condicaoPagamento}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-700">Caixas Externas Individuais:</span>
              <p className="text-slate-800">
                {totalPares} caixas a R$ {dadosRelatorio.custoCaixaPorPar.toFixed(2)}/par = <strong className="font-mono">R$ {totalCustoCaixas.toFixed(2)}</strong> (Incluso no custo fabril)
              </p>
            </div>
          </div>

          <div className="space-y-2 bg-slate-900 text-white p-5 rounded-xl text-xs">
            <span className="font-bold text-sky-400 uppercase tracking-wider block text-[10px]">Resumo Financeiro Total</span>
            <div className="flex justify-between text-slate-300">
              <span>Volume Total:</span>
              <span className="font-bold text-white">{totalPares} Pares</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Custo Fabril Consolidado:</span>
              <span className="font-mono">R$ {(totalCustoBase + totalCustoCaixas).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-amber-300 pt-3 border-t border-slate-700">
              <span>VALOR TOTAL DO PEDIDO:</span>
              <span className="font-mono text-xl">R$ {totalVendaFinal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Assinaturas */}
        <div className="pt-12 grid grid-cols-2 gap-12 text-center text-xs text-slate-500">
          <div className="border-t border-slate-400 pt-2">
            <p className="font-bold text-slate-800">D I S A N T O R I N I - Produção</p>
            <p>Visto Gerência Fabril</p>
          </div>
          <div className="border-t border-slate-400 pt-2">
            <p className="font-bold text-slate-800">{dadosRelatorio.cliente.razaoSocial}</p>
            <p>De acordo / Aceite do Pedido</p>
          </div>
        </div>
      </div>
    </div>
  );
}
