'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, pass: string) => Promise<{ error: string | null; message?: string }>;
  signOut: () => Promise<void>;
  demoLogin: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  signOut: async () => {},
  demoLogin: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const demoUserStr = localStorage.getItem('disantorini_demo_user');
        if (demoUserStr) {
          return JSON.parse(demoUserStr);
        }
      } catch (e) {}
    }
    return null;
  });
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const demo = localStorage.getItem('disantorini_demo_user');
      if (demo) return false;
    }
    return true;
  });
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;

    // Timeout de segurança: nunca deixa a tela presa em loading por mais de 800ms
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 800);

    const checkUser = async () => {
      try {
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<{ data: { session: null } }>((resolve) => 
          setTimeout(() => resolve({ data: { session: null } }), 600)
        );

        const res = await Promise.race([sessionPromise, timeoutPromise]);
        if (!isMounted) return;

        if (res?.data?.session) {
          setSession(res.data.session);
          setUser(res.data.session.user);
        } else {
          const demoUserStr = localStorage.getItem('disantorini_demo_user');
          if (demoUserStr) {
            try {
              setUser(JSON.parse(demoUserStr));
            } catch (e) {}
          }
        }
      } catch (err) {
        console.warn('Verificação de sessão concluída com fallback:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
          clearTimeout(safetyTimer);
        }
      }
    };

    checkUser();

    // Listener de mudanças de estado de autenticação no Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (!isMounted) return;
      setSession(currentSession);
      if (currentSession?.user) {
        setUser(currentSession.user);
      }
      setLoading(false);

      if (event === 'SIGNED_IN') {
        localStorage.removeItem('disantorini_demo_user');
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        return { error: error.message };
      }

      setUser(data.user);
      setSession(data.session);
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Erro ao realizar login.' };
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user && !data.session) {
        return { error: null, message: 'Cadastro realizado! Verifique seu e-mail para confirmar a conta ou tente fazer login.' };
      }

      setUser(data.user);
      setSession(data.session);
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Erro ao criar conta.' };
    }
  };

  const demoLogin = () => {
    const mockUser: any = {
      id: 'demo-admin-01',
      email: 'admin@disantorini.com.br',
      user_metadata: {
        name: 'Administrador Santorine',
      },
    };
    localStorage.setItem('disantorini_demo_user', JSON.stringify(mockUser));
    setUser(mockUser);
    router.push('/');
  };

  const signOut = async () => {
    localStorage.removeItem('disantorini_demo_user');
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Erro ao deslogar do Supabase:', err);
    }
    setUser(null);
    setSession(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
