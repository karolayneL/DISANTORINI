import Link from 'next/link';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  DollarSign, 
  Search,
  Scissors,
  TrendingUp,
  FileCheck2
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Banner Executivo (Noir + Dourado + Branco) */}
      <div className="relative overflow-hidden rounded-2xl bg-[#121216] border border-[#262630] p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c5a059]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#dfc175] text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>DISANTORINI ERP-X • Sistema de Gestão Industrial</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Gestão Integrada de Produção e Custos de Calçados
          </h1>
          
          <p className="mt-3 text-neutral-400 max-w-2xl text-sm leading-relaxed">
            Controle fabril de ponta a ponta: cálculo automático de custo com menor cotação em estoque, precificação via Markup Divisor, gestão de grades do 34 ao 42 e emissão de ordens de produção.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/clientes"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#dfc175] via-[#c5a059] to-[#a37f37] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider shadow-md transition-all"
            >
              <Search className="w-4 h-4" />
              <span>Cadastrar Cliente com BrasilAPI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#18181f] hover:bg-[#202028] border border-[#2d2d38] text-white font-semibold text-xs tracking-wide transition-all"
            >
              <Package className="w-4 h-4 text-[#d4af37]" />
              <span>Fichas Técnicas & Insumos</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Cards de Métricas & Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121216] border border-[#23232b] p-5 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Custo Caixa Externa</span>
            <div className="p-2 rounded-lg bg-[#c5a059]/10 text-[#d4af37]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">R$ 5,50</div>
            <p className="text-[11px] text-neutral-500 mt-1">Acoplamento / par padrão</p>
          </div>
        </div>

        <div className="bg-[#121216] border border-[#23232b] p-5 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Markup Divisor Base</span>
            <div className="p-2 rounded-lg bg-[#c5a059]/10 text-[#d4af37]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">1 - (Σ Deduções)</div>
            <p className="text-[11px] text-[#dfc175] mt-1 font-semibold">Comissão + Impostos + Margem</p>
          </div>
        </div>

        <div className="bg-[#121216] border border-[#23232b] p-5 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Grade Calçadista</span>
            <div className="p-2 rounded-lg bg-[#c5a059]/10 text-[#d4af37]">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">34 ao 42</div>
            <p className="text-[11px] text-neutral-500 mt-1">Multiplicação por pares do lote</p>
          </div>
        </div>

        <div className="bg-[#121216] border border-[#23232b] p-5 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Cotações de Insumos</span>
            <div className="p-2 rounded-lg bg-[#c5a059]/10 text-[#d4af37]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight">Menor Preço Ativo</div>
            <p className="text-[11px] text-neutral-500 mt-1">Otimização automática da BOM</p>
          </div>
        </div>
      </div>

      {/* Módulos do Sistema em Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          href="/clientes"
          className="bg-[#121216] hover:bg-[#16161c] border border-[#23232b] hover:border-[#c5a059]/40 p-6 rounded-xl transition-all group block"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#181820] border border-[#2a2a34] flex items-center justify-center text-white group-hover:text-[#d4af37] transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-[#d4af37] group-hover:translate-x-1 transition-all" />
          </div>
          <h2 className="text-base font-bold text-white group-hover:text-[#d4af37] transition-colors">
            Clientes & BrasilAPI
          </h2>
          <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
            Busca de dados cadastrais na Receita Federal por CNPJ e auto-preenchimento de endereço por CEP.
          </p>
        </Link>

        <Link
          href="/produtos"
          className="bg-[#121216] hover:bg-[#16161c] border border-[#23232b] hover:border-[#c5a059]/40 p-6 rounded-xl transition-all group block"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#181820] border border-[#2a2a34] flex items-center justify-center text-white group-hover:text-[#d4af37] transition-colors">
              <Package className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-[#d4af37] group-hover:translate-x-1 transition-all" />
          </div>
          <h2 className="text-base font-bold text-white group-hover:text-[#d4af37] transition-colors">
            Fichas Técnicas (BOM)
          </h2>
          <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
            Estrutura completa de cabedal, palmilha, solado e salto com foto e cálculo dinâmico de custo.
          </p>
        </Link>

        <Link
          href="/insumos"
          className="bg-[#121216] hover:bg-[#16161c] border border-[#23232b] hover:border-[#c5a059]/40 p-6 rounded-xl transition-all group block"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#181820] border border-[#2a2a34] flex items-center justify-center text-white group-hover:text-[#d4af37] transition-colors">
              <Scissors className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-[#d4af37] group-hover:translate-x-1 transition-all" />
          </div>
          <h2 className="text-base font-bold text-white group-hover:text-[#d4af37] transition-colors">
            Insumos & Cotações
          </h2>
          <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
            Múltiplos fornecedores por insumo com seleção automática do menor valor em estoque disponível.
          </p>
        </Link>
      </div>
    </div>
  );
}
