'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Layers, 
  TrendingUp, 
  FileText, 
  Sparkles,
  Scissors,
  LogOut,
  Loader2,
  ShieldAlert
} from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/login';

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.replace('/login');
    }
  }, [user, loading, isLoginPage, router]);

  // Se estiver na tela de login, renderiza a página de login em tela cheia sem sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Se estiver verificando a autenticação
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0b132b] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-amber-400 p-0.5 shadow-xl shadow-sky-500/20">
            <div className="w-full h-full bg-[#0b132b] rounded-[14px] flex items-center justify-center">
              <Layers className="w-6 h-6 text-sky-400 animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
            <span>Validando credenciais do DISANTORINI ERP...</span>
          </div>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado e não for login, impede acesso
  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0b132b] text-white p-4">
        <div className="bg-[#0e172e] border border-slate-800 p-8 rounded-3xl max-w-md w-full text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Acesso Restrito</h2>
          <p className="text-xs text-slate-400">
            É necessário estar autenticado para acessar os módulos e recursos da fábrica.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all"
          >
            Ir para Tela de Login
          </button>
        </div>
      </div>
    );
  }

  // Navegação Ativa
  const navItems = [
    { href: '/', label: 'Painel Executivo', icon: TrendingUp, section: 'Operacional' },
    { href: '/clientes', label: 'Clientes & CNPJ', icon: Users },
    { href: '/produtos', label: 'Fichas Técnicas (BOM)', icon: Package },
    { href: '/insumos', label: 'Insumos & Cotações', icon: Scissors },
    { href: '/pedidos', label: 'Pedidos & Grades', icon: ShoppingCart, section: 'Produção & Vendas' },
    { href: '/precificacao', label: 'Simulador Markup', icon: Layers },
    { href: '/relatorios', label: 'Exportação PDF & NFe', icon: FileText },
  ];

  return (
    <div className="flex min-h-screen bg-[#0b132b] text-slate-100 antialiased selection:bg-sky-500 selection:text-white">
      {/* Sidebar Principal */}
      <aside className="w-64 border-r border-slate-800 bg-[#0d1633]/90 backdrop-blur-md flex flex-col fixed inset-y-0 z-50">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-amber-400 animate-pulse" />
              <h1 className="font-bold tracking-widest text-lg text-white">DISANTORINI</h1>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-400 mt-0.5">
              ERP - X • Footwear OS
            </p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <React.Fragment key={item.href}>
                {item.section && (
                  <div className={`text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 ${index === 0 ? 'py-1' : 'pt-4 pb-1'}`}>
                    {item.section}
                  </div>
                )}
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                      : 'text-slate-300 hover:bg-sky-950/60 hover:text-sky-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-sky-400'
                  }`} />
                  <span>{item.label}</span>
                </Link>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Informações do Usuário & Logout */}
        <div className="p-4 border-t border-slate-800 bg-[#090f21] space-y-3">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-amber-400 flex items-center justify-center font-bold text-slate-900 text-xs shadow-md">
              {user.email ? user.email.slice(0, 2).toUpperCase() : 'DS'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário Autenticado'}
              </p>
              <p className="text-[10px] text-emerald-400 font-medium truncate">
                {user.email || 'Online'}
              </p>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="w-full py-2 px-3 rounded-lg border border-slate-800 hover:border-rose-500/30 hover:bg-rose-950/30 text-slate-400 hover:text-rose-300 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-16 border-b border-slate-800/80 bg-[#0d1633]/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span className="text-slate-200 font-semibold">Fábrica de Calçados</span>
            <span>/</span>
            <span className="text-sky-400 font-medium capitalize">
              {pathname === '/' ? 'Painel Executivo' : pathname.replace('/', '')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sessão Ativa</span>
            </div>

            <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Markup Divisor Ativo</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
