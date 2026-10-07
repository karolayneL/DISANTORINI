'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Loader2, 
  AlertCircle, 
  Sparkles,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';

const authSchema = z.object({
  email: z.string().email('Insira um e-mail corporativo válido'),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { signInWithEmail, demoLogin, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormData) => {
    try {
      setSubmitting(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = await signInWithEmail(data.email, data.password);
      if (res.error) {
        if (res.error === 'Invalid login credentials') {
          setErrorMsg('Credenciais inválidas. Verifique seu e-mail e senha.');
        } else if (res.error.includes('Email not confirmed')) {
          setErrorMsg('E-mail não confirmado. Confirme o usuário no painel do Supabase.');
        } else {
          setErrorMsg(res.error);
        }
      } else {
        setSuccessMsg('Acesso autorizado! Redirecionando...');
        router.push('/');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocorreu um erro ao processar sua autenticação.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-[#d4af37]" />
          <p className="text-xs font-medium text-neutral-400">Verificando sessão segura...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#09090b] relative overflow-hidden p-6">
      {/* Luz ambiente dourada muito suave de fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#c5a059]/5 blur-[160px] pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10">
        
        {/* Card Principal (Estilo Luxury Noir & Gold) */}
        <div className="bg-[#101014] border border-[#22222a] p-8 sm:p-9 rounded-2xl shadow-2xl space-y-6">
          
          {/* ========================================================================= */}
          {/* ESPAÇO RESERVADO PARA LOGOMARCA (Substitua este bloco pela sua <img />)   */}
          {/* ========================================================================= */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#dfc175] via-[#c5a059] to-[#8d7034] p-0.5 shadow-md mb-1">
              <div className="w-full h-full bg-[#0d0d10] rounded-[10px] flex items-center justify-center">
                <span className="font-serif font-black text-sm text-[#d4af37] tracking-widest">DS</span>
              </div>
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-wider text-white">
                DISANTORINI
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059] mt-0.5">
                ERP - X • Footwear OS
              </p>
            </div>
            
            <p className="text-xs text-neutral-400 pt-1">
              Acesso restrito para gestão fabril e comercial
            </p>
          </div>
          {/* ========================================================================= */}

          {/* Mensagens de Feedback */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>E-mail Corporativo</span>
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="operador@disantorini.com.br"
                className="w-full bg-[#09090b] border border-[#262630] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/40 transition-all"
              />
              {errors.email && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Senha de Acesso</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full bg-[#09090b] border border-[#262630] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/40 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#dfc175] via-[#c5a059] to-[#a37f37] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divisor Elegante */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#202028] w-full" />
            <span className="bg-[#101014] px-3 text-[10px] uppercase tracking-widest text-neutral-500 font-semibold absolute">
              acesso de demonstração
            </span>
          </div>

          {/* Acesso Rápido Demo */}
          <div>
            <button
              type="button"
              onClick={demoLogin}
              className="w-full py-2.5 rounded-lg border border-[#c5a059]/30 bg-[#c5a059]/10 hover:bg-[#c5a059]/20 text-[#dfc175] font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Acesso Rápido / Demonstração</span>
            </button>
          </div>

          {/* Rodapé de Segurança */}
          <div className="pt-2 border-t border-[#1e1e26] flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Autenticação Centralizada no Supabase</span>
          </div>

        </div>
      </div>
    </div>
  );
}
