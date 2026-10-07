import Link from 'next/link';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  DollarSign, 
  ShieldCheck, 
  Search 
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-950/80 via-slate-900 to-indigo-950/80 border border-sky-500/20 p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            DISANTORINI ERP-X • Sistema Industrial 4.0
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Gestão Integrada de Produção e Custos de Calçados
          </h1>
          <p className="mt-3 text-slate-300 max-w-2xl text-base leading-relaxed">
            Controle de ponta a ponta: do cálculo automático de custo com menor cotação em estoque, precificação via Markup Divisor, grades do 34 ao 42, até a emissão de ordens de produção e simulação SEFAZ-CE.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/clientes"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-slate-950 font-bold text-sm shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02]"
            >
              <Search className="w-4 h-4" />
              <span>Cadastrar Cliente com BrasilAPI</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-sm transition-all"
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>Fichas Técnicas & Insumos</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Cards de Métricas & Regras de Negócio */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-5 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Custo Caixa Externa</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">R$ 1,30</div>
            <p className="text-xs text-slate-400 mt-1">Incluso automaticamente por par</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Motor de Cotações</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">Min. 4 Fornecedores</div>
            <p className="text-xs text-slate-400 mt-1">Filtro por menor preço em estoque</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Grade Padrão</span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">34 ao 42</div>
            <p className="text-xs text-slate-400 mt-1">12 cores pré-definidas no catálogo</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Fórmula Markup</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">Markup Divisor</div>
            <p className="text-xs text-slate-400 mt-1">Custo / (1 - (Margem+Comissão+Impostos))</p>
          </div>
        </div>
      </div>

      {/* Módulos do Sistema */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
          <span>Módulos de Gestão Operacional</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Módulo 1 */}
          <Link
            href="/clientes"
            className="glass-panel p-6 rounded-2xl hover:border-sky-500/40 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                Módulo 1: Cadastros & BrasilAPI
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Auto-preenchimento automático por CNPJ via BrasilAPI, armazenamento no Supabase e gestão cadastral completa.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-sky-400">
              <span>Acessar Módulo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Módulo 2 & 3 */}
          <Link
            href="/produtos"
            className="glass-panel p-6 rounded-2xl hover:border-amber-500/40 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                Módulo 2 & 3: BOM, Cotações & Markup
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Fichas técnicas com upload de fotos no Supabase Storage, motor de menores preços e precificação por divisor.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-400">
              <span>Acessar Módulo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Módulo 4 & 5 */}
          <Link
            href="/pedidos"
            className="glass-panel p-6 rounded-2xl hover:border-indigo-500/40 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                Módulo 4 & 5: Lotes, PDF & SEFAZ-CE
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Criação de ordens de produção em lote, explosão de insumos, relatórios em PDF e simulação de payload NFe.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-400">
              <span>Acessar Módulo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
