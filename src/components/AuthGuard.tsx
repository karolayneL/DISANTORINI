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
      <div className="min-h-screen w-full flex items-center justify-center bg-[#09090b] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#c5a059] to-[#dfc175] p-0.5 shadow-xl shadow-amber-500/10">
            <div className="w-full h-full bg-[#09090b] rounded-[14px] flex items-center justify-center">
              <Layers className="w-6 h-6 text-[#d4af37] animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Loader2 className="w-4 h-4 animate-spin text-[#d4af37]" />
            <span>Carregando ecossistema...</span>
          </div>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado e não for login, impede acesso
  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#09090b] text-white p-4">
        <div className="bg-[#121216] border border-neutral-800 p-8 rounded-2xl max-w-md w-full text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-[#d4af37] mx-auto" />
          <h2 className="text-xl font-bold text-white">Acesso Restrito</h2>
          <p className="text-xs text-neutral-400">
            É necessário estar autenticado com credencial autorizada para acessar o sistema.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#dfc175] to-[#c5a059] text-black font-bold text-sm transition-all hover:brightness-110 cursor-pointer"
          >
            Ir para Tela de Login
          </button>
        </div>
      </div>
    );
  }

  // Navegação do Sistema
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
    <div className="flex min-h-screen bg-[#09090b] text-neutral-100 antialiased selection:bg-[#d4af37] selection:text-black">
      {/* Sidebar Principal (Noir + Dourado + Branco) */}
      <aside className="w-64 border-r border-[#1f1f26] bg-[#0d0d10] flex flex-col fixed inset-y-0 z-50">
        
        {/* ========================================================================= */}
        {/* ESPAÇO RESERVADO PARA LOGOMARCA (Substitua este bloco pela sua <img />)   */}
        {/* ========================================================================= */}
        <div className="p-5 border-b border-[#1f1f26] flex items-center justify-between min-h-[76px]">
          <Link href="/" className="flex items-center gap-3 group w-full">
            {/* Slot Container da Logomarca */}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#dfc175] via-[#c5a059] to-[#8d7034] p-0.5 flex-shrink-0 shadow-md">
              <div className="w-full h-full bg-[#0d0d10] rounded-[6px] flex items-center justify-center">
                <span className="font-serif font-black text-xs text-[#d4af37] tracking-wider">DS</span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold tracking-wider text-sm text-white group-hover:text-[#d4af37] transition-colors truncate">
                  DISANTORINI
                </h1>
              </div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#c5a059] truncate">
                ERP - X • Footwear OS
              </p>
            </div>
          </Link>
        </div>
        {/* ========================================================================= */}

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <React.Fragment key={item.href}>
                {item.section && (
                  <div className={`text-[10px] font-bold uppercase tracking-widest text-neutral-500 px-3 ${index === 0 ? 'py-1.5' : 'pt-4 pb-1.5'}`}>
                    {item.section}
                  </div>
                )}
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-[#18181f] text-[#d4af37] border-l-2 border-[#d4af37] shadow-sm'
                      : 'text-neutral-400 hover:bg-[#141418] hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#d4af37]' : 'text-neutral-500 group-hover:text-[#d4af37]'
                  }`} />
                  <span>{item.label}</span>
                </Link>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Informações do Usuário & Logout */}
        <div className="p-3.5 border-t border-[#1f1f26] bg-[#0a0a0d] space-y-2.5">
          <div className="flex items-center gap-2.5 px-1 py-1">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#c5a059] to-[#dfc175] flex items-center justify-center font-bold text-black text-[11px] shadow-sm">
              {user.email ? user.email.slice(0, 2).toUpperCase() : 'DS'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário'}
              </p>
              <p className="text-[10px] text-neutral-500 truncate">
                {user.email || 'Conectado'}
              </p>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="w-full py-1.5 px-3 rounded-lg border border-[#23232b] hover:border-neutral-700 hover:bg-[#15151a] text-neutral-400 hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-neutral-500" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-14 border-b border-[#1f1f26] bg-[#0d0d10]/90 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2.5 text-xs text-neutral-400">
            <span className="text-white font-semibold">Fábrica de Calçados</span>
            <span className="text-neutral-600">/</span>
            <span className="text-[#d4af37] font-medium capitalize">
              {pathname === '/' ? 'Painel Executivo' : pathname.replace('/', '')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 rounded-full bg-[#15151a] border border-[#262630] text-neutral-300 text-[11px] font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sessão Ativa</span>
            </div>

            <div className="px-2.5 py-1 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#dfc175] text-[11px] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#d4af37]" />
              <span>Markup Divisor Ativo</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 bg-[#09090b]">
          {children}
        </main>
      </div>
    </div>
  );
}
