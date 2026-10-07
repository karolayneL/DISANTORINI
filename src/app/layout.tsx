import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import AuthGuard from '@/components/AuthGuard';

export const metadata: Metadata = {
  title: 'D I S A N T O R I N I - ERP - X | Gestão de Calçados',
  description: 'Sistema ERP moderno para gestão industrial e comercial de fábrica de calçados',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#0b132b] text-slate-100 antialiased selection:bg-sky-500 selection:text-white min-h-screen">
        <AuthProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}

