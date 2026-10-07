# D I S A N T O R I N I - ERP - X
> Sistema ERP completo para gestão industrial e comercial de fábrica de calçados femininos.

---

## 🚀 Stack Tecnológica
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Estilização & Design System:** Tailwind CSS, Tema Escuro Industrial Santorini, Lucide Icons
- **Backend & Database:** Supabase (PostgreSQL 15+, Storage para fotos, RLS habilitado)
- **Validação & Formulários:** React Hook Form + Zod
- **Integração Externa:** BrasilAPI (Receita Federal para consulta de CNPJ automática)
- **Relatórios & Produção:** Ordem de produção profissional para impressão em PDF e simulação SEFAZ-CE (NFe 4.00)

---

## 📦 Estrutura de Módulos Implementados

1. **Módulo 1: Cadastros Base & BrasilAPI**
   - Cadastro completo de Clientes e Fornecedores
   - Busca em tempo real na BrasilAPI pelo CNPJ com auto-preenchimento cadastral e de endereço
2. **Módulo 2: Inteligência de Compras e Custos**
   - Motor de cotação comparativo com exigência de no mínimo 4 fornecedores por matéria-prima
   - Seleção automática do menor preço disponível em estoque
   - Adição automática da taxa de R$ 1,30 por par referente à Caixa Externa
3. **Módulo 3: Precificação (Markup Divisor)**
   - Fórmula: `Preço = Custo / (1 - ((Margem + Comissão + Impostos) / 100))`
   - Decomposição visual de lucro líquido, comissões e carga tributária
4. **Módulo 4: Gestão de Lotes, Grades & Ordens**
   - Grade padrão do 34 ao 42 e cores do catálogo Santorini
   - Explosão e consolidação do lote completo de insumos
5. **Módulo 5: Exportação em PDF & SEFAZ-CE**
   - Emissão de espelho de pedido com totalizadores por categoria (Rasteiras, Saltos, Papetes, Plataformas)
   - Simulador virtual de payload de integração com a SEFAZ-CE

---

## 🛠️ Passo a Passo para Execução

### 1. Configurar Banco de Dados no Supabase
1. Crie um projeto no [Supabase](https://supabase.com).
2. Acesse o **SQL Editor** no painel do Supabase.
3. Copie e execute todo o conteúdo do arquivo [`supabase/migrations/20261005_initial_schema.sql`](file:///c:/Users/Admin/Desktop/Workspace/DISANTORINI/DISANTORINI/supabase/migrations/20261005_initial_schema.sql).

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz baseado no `.env.local.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui
NEXT_PUBLIC_BRASILAPI_URL=https://brasilapi.com.br/api
```

### 3. Instalar Dependências e Executar
```bash
npm install
npm run dev
```
O sistema estará disponível em `http://localhost:3000`.
