-- ==============================================================================
-- D I S A N T O R I N I - ERP - X
-- SCHEMA COMPLETO DO BANCO DE DADOS (SUPABASE / POSTGRESQL)
-- Versão: 1.0.0
-- ==============================================================================

-- 1. EXTENSÕES NECESSÁRIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS DE DOMÍNIO
DO $$ BEGIN
    CREATE TYPE categoria_produto_enum AS ENUM ('Rasteira', 'Salto', 'Papete', 'Plataforma');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE unidade_medida_enum AS ENUM ('PAR', 'METRO', 'M2', 'KG', 'LITRO', 'UNIDADE', 'CENTO', 'MILHEIRO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE status_pedido_enum AS ENUM ('Rascunho', 'Cotado', 'Aprovado', 'Em Producao', 'Finalizado', 'Faturado', 'Cancelado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. TABELAS PRINCIPAIS
-- ==============================================================================

-- 3.1. CLIENTES (Com campos para integração BrasilAPI)
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_pessoa VARCHAR(2) NOT NULL DEFAULT 'PJ' CHECK (tipo_pessoa IN ('PJ', 'PF')),
    cnpj_cpf VARCHAR(20) NOT NULL UNIQUE,
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    inscricao_estadual VARCHAR(50),
    email VARCHAR(255),
    telefone VARCHAR(30),
    whatsapp VARCHAR(30),
    cep VARCHAR(10),
    logradouro VARCHAR(255),
    numero VARCHAR(30),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100) NOT NULL,
    uf VARCHAR(2) NOT NULL,
    codigo_ibge VARCHAR(10),
    situacao_cadastral VARCHAR(50),
    cnae_principal VARCHAR(20),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3.2. FORNECEDORES
CREATE TABLE IF NOT EXISTS public.fornecedores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cnpj_cpf VARCHAR(20) NOT NULL UNIQUE,
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    contato_nome VARCHAR(100),
    telefone VARCHAR(30),
    whatsapp VARCHAR(30),
    email VARCHAR(255),
    cidade VARCHAR(100),
    uf VARCHAR(2),
    chave_pix VARCHAR(100),
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3.3. INSUMOS / MATÉRIAS-PRIMAS
CREATE TABLE IF NOT EXISTS public.insumos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_referencia VARCHAR(50) UNIQUE NOT NULL,
    nome VARCHAR(200) NOT NULL,
    categoria_insumo VARCHAR(100) NOT NULL, -- Ex: Solado, Couro/Sintético, Palmilha, Metal/Fivela, Adesivo/Cola, Embalagem
    unidade_medida unidade_medida_enum NOT NULL DEFAULT 'UNIDADE',
    descricao TEXT,
    estoque_minimo NUMERIC(12, 4) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3.4. COTAÇÕES DE INSUMOS (Exige múltiplas cotações com menor preço disponível em estoque)
CREATE TABLE IF NOT EXISTS public.cotacoes_insumos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    insumo_id UUID NOT NULL REFERENCES public.insumos(id) ON DELETE CASCADE,
    fornecedor_id UUID NOT NULL REFERENCES public.fornecedores(id) ON DELETE RESTRICT,
    preco_unitario NUMERIC(12, 4) NOT NULL CHECK (preco_unitario >= 0),
    disponivel_estoque BOOLEAN NOT NULL DEFAULT true,
    lead_time_dias INTEGER DEFAULT 3,
    observacao VARCHAR(255),
    data_cotacao DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_insumo_fornecedor UNIQUE (insumo_id, fornecedor_id)
);

-- 3.5. PRODUTOS (Ficha Técnica Master / Precificação)
CREATE TABLE IF NOT EXISTS public.produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referencia VARCHAR(50) UNIQUE NOT NULL,
    nome VARCHAR(200) NOT NULL,
    categoria categoria_produto_enum NOT NULL,
    foto_url TEXT,
    margem_lucro_pct NUMERIC(6, 2) NOT NULL DEFAULT 30.00 CHECK (margem_lucro_pct >= 0),
    comissao_pct NUMERIC(6, 2) NOT NULL DEFAULT 5.00 CHECK (comissao_pct >= 0),
    impostos_pct NUMERIC(6, 2) NOT NULL DEFAULT 8.50 CHECK (impostos_pct >= 0),
    custo_adicional_caixa NUMERIC(10, 2) NOT NULL DEFAULT 1.30 CHECK (custo_adicional_caixa >= 0),
    custo_base_calculado NUMERIC(12, 2) DEFAULT 0.00,
    preco_venda_sugerido NUMERIC(12, 2) DEFAULT 0.00,
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3.6. PRODUTO_INSUMOS (Ficha Técnica / Bill of Materials - BOM)
CREATE TABLE IF NOT EXISTS public.produto_insumos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
    insumo_id UUID NOT NULL REFERENCES public.insumos(id) ON DELETE RESTRICT,
    quantidade_por_par NUMERIC(12, 4) NOT NULL CHECK (quantidade_por_par > 0),
    observacao VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_produto_insumo UNIQUE (produto_id, insumo_id)
);

-- 3.7. CORES DO CATÁLOGO SANTORINI
CREATE TABLE IF NOT EXISTS public.cores_catalogo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) UNIQUE NOT NULL,
    codigo_hex VARCHAR(20),
    ativo BOOLEAN NOT NULL DEFAULT true,
    ordem_exibicao INTEGER DEFAULT 0
);

-- 3.8. PEDIDOS / ORDENS DE PRODUÇÃO
CREATE TABLE IF NOT EXISTS public.pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_pedido VARCHAR(30) UNIQUE NOT NULL,
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE RESTRICT,
    status status_pedido_enum NOT NULL DEFAULT 'Cotado',
    condicao_pagamento VARCHAR(255) NOT NULL DEFAULT '50% crédito material, 50% Pix',
    previsao_entrega DATE NOT NULL,
    total_pares INTEGER NOT NULL DEFAULT 0 CHECK (total_pares >= 0),
    valor_total_custo NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    valor_total_venda NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    observacoes TEXT,
    payload_sefaz_ce JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3.9. ITENS DO PEDIDO (Grade do 34 ao 42 + Cor)
CREATE TABLE IF NOT EXISTS public.pedido_itens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
    produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE RESTRICT,
    cor_nome VARCHAR(100) NOT NULL,
    grade_34 INTEGER NOT NULL DEFAULT 0 CHECK (grade_34 >= 0),
    grade_35 INTEGER NOT NULL DEFAULT 0 CHECK (grade_35 >= 0),
    grade_36 INTEGER NOT NULL DEFAULT 0 CHECK (grade_36 >= 0),
    grade_37 INTEGER NOT NULL DEFAULT 0 CHECK (grade_37 >= 0),
    grade_38 INTEGER NOT NULL DEFAULT 0 CHECK (grade_38 >= 0),
    grade_39 INTEGER NOT NULL DEFAULT 0 CHECK (grade_39 >= 0),
    grade_40 INTEGER NOT NULL DEFAULT 0 CHECK (grade_40 >= 0),
    grade_41 INTEGER NOT NULL DEFAULT 0 CHECK (grade_41 >= 0),
    grade_42 INTEGER NOT NULL DEFAULT 0 CHECK (grade_42 >= 0),
    total_pares_item INTEGER GENERATED ALWAYS AS (
        grade_34 + grade_35 + grade_36 + grade_37 + grade_38 + grade_39 + grade_40 + grade_41 + grade_42
    ) STORED,
    custo_unitario_base NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    preco_unitario_venda NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    subtotal_venda NUMERIC(14, 2) GENERATED ALWAYS AS (
        (grade_34 + grade_35 + grade_36 + grade_37 + grade_38 + grade_39 + grade_40 + grade_41 + grade_42) * preco_unitario_venda
    ) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 4. FUNÇÕES DE NEGÓCIO E MOTORES DE CÁLCULO
-- ==============================================================================

-- 4.1. FUNÇÃO: Calcular o menor custo dos insumos em estoque + R$ 1,30 de Caixa Externa
CREATE OR REPLACE FUNCTION public.calcular_custo_produto(p_produto_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    v_custo_insumos NUMERIC := 0;
    v_custo_caixa NUMERIC := 1.30;
    v_total NUMERIC := 0;
BEGIN
    -- Busca o custo da caixa externa configurado no produto
    SELECT COALESCE(custo_adicional_caixa, 1.30)
    INTO v_custo_caixa
    FROM public.produtos
    WHERE id = p_produto_id;

    -- Soma (quantidade_por_par * menor_preco_disponivel) de cada insumo da ficha técnica
    SELECT COALESCE(SUM(pi.quantidade_por_par * menor_cotacao.menor_preco), 0)
    INTO v_custo_insumos
    FROM public.produto_insumos pi
    CROSS JOIN LATERAL (
        SELECT MIN(c.preco_unitario) as menor_preco
        FROM public.cotacoes_insumos c
        WHERE c.insumo_id = pi.insumo_id
          AND c.disponivel_estoque = true
    ) menor_cotacao
    WHERE pi.produto_id = p_produto_id;

    v_total := ROUND(v_custo_insumos + v_custo_caixa, 2);
    RETURN v_total;
END;
$$ LANGUAGE plpgsql STABLE;

-- 4.2. FUNÇÃO: Calcular Preço de Venda via Markup Divisor
-- Fórmula: Preço = Custo / (1 - ((Margem + Comissao + Impostos) / 100))
CREATE OR REPLACE FUNCTION public.calcular_preco_markup_divisor(
    p_custo NUMERIC,
    p_margem NUMERIC,
    p_comissao NUMERIC,
    p_impostos NUMERIC
) RETURNS NUMERIC AS $$
DECLARE
    v_divisor NUMERIC;
    v_preco NUMERIC;
BEGIN
    IF p_custo IS NULL OR p_custo <= 0 THEN
        RETURN 0.00;
    END IF;

    v_divisor := 1.0 - ((COALESCE(p_margem, 0) + COALESCE(p_comissao, 0) + COALESCE(p_impostos, 0)) / 100.0);

    -- Evita divisão por zero ou negativa
    IF v_divisor <= 0.05 THEN
        v_divisor := 0.05;
    END IF;

    v_preco := ROUND(p_custo / v_divisor, 2);
    RETURN v_preco;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 4.3. FUNÇÃO: Consolidar Consumo Total de Insumos para um Pedido Completo
CREATE OR REPLACE FUNCTION public.get_consumo_lote_pedido(p_pedido_id UUID)
RETURNS TABLE (
    insumo_id UUID,
    codigo_referencia VARCHAR,
    nome_insumo VARCHAR,
    categoria_insumo VARCHAR,
    unidade_medida unidade_medida_enum,
    quantidade_total_necessaria NUMERIC,
    menor_preco_disponivel NUMERIC,
    fornecedor_sugerido VARCHAR,
    custo_total_insumo NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH pares_por_produto AS (
        SELECT 
            pi.produto_id,
            SUM(pi.total_pares_item) as total_pares
        FROM public.pedido_itens pi
        WHERE pi.pedido_id = p_pedido_id
        GROUP BY pi.produto_id
    ),
    insumos_necessarios AS (
        SELECT 
            bom.insumo_id,
            SUM(bom.quantidade_por_par * ppp.total_pares) as qte_total
        FROM pares_por_produto ppp
        JOIN public.produto_insumos bom ON bom.produto_id = ppp.produto_id
        GROUP BY bom.insumo_id
    )
    SELECT 
        i.id AS insumo_id,
        i.codigo_referencia,
        i.nome AS nome_insumo,
        i.categoria_insumo,
        i.unidade_medida,
        ROUND(ins_nec.qte_total, 4) AS quantidade_total_necessaria,
        ROUND(cot.menor_preco, 4) AS menor_preco_disponivel,
        cot.fornecedor_nome AS fornecedor_sugerido,
        ROUND((ins_nec.qte_total * cot.menor_preco), 2) AS custo_total_insumo
    FROM insumos_necessarios ins_nec
    JOIN public.insumos i ON i.id = ins_nec.insumo_id
    CROSS JOIN LATERAL (
        SELECT 
            c.preco_unitario AS menor_preco,
            f.razao_social AS fornecedor_nome
        FROM public.cotacoes_insumos c
        JOIN public.fornecedores f ON f.id = c.fornecedor_id
        WHERE c.insumo_id = i.id
          AND c.disponivel_estoque = true
        ORDER BY c.preco_unitario ASC
        LIMIT 1
    ) cot
    ORDER BY i.categoria_insumo, i.nome;
END;
$$ LANGUAGE plpgsql STABLE;

-- ==============================================================================
-- 5. TRIGGER: Atualização automática de updated_at
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clientes_modtime BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_fornecedores_modtime BEFORE UPDATE ON public.fornecedores FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_insumos_modtime BEFORE UPDATE ON public.insumos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_produtos_modtime BEFORE UPDATE ON public.produtos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_pedidos_modtime BEFORE UPDATE ON public.pedidos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 6. CONFIGURAÇÃO DO SUPABASE STORAGE (BUCKET 'produtos')
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('produtos', 'produtos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Acesso para o Storage
DO $$ BEGIN
    CREATE POLICY "Acesso público às fotos de produtos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'produtos');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Upload permitido no bucket produtos"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'produtos');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Update permitido no bucket produtos"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'produtos');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Delete permitido no bucket produtos"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'produtos');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insumos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cotacoes_insumos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produto_insumos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cores_catalogo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedido_itens ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso irrestrito para dev / autenticado
CREATE POLICY "Acesso total clientes" ON public.clientes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total fornecedores" ON public.fornecedores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total insumos" ON public.insumos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total cotacoes" ON public.cotacoes_insumos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total produtos" ON public.produtos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total produto_insumos" ON public.produto_insumos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total cores_catalogo" ON public.cores_catalogo FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total pedidos" ON public.pedidos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso total pedido_itens" ON public.pedido_itens FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 8. SEED INICIAL (CORES DO CATÁLOGO SANTORINI & VALORES DE REFERÊNCIA)
-- ==============================================================================
INSERT INTO public.cores_catalogo (nome, codigo_hex, ordem_exibicao) VALUES
('Preto', '#000000', 1),
('Caramelo', '#8B4513', 2),
('Nude', '#E3BC9A', 3),
('Branco', '#FFFFFF', 4),
('Off White', '#FAF9F6', 5),
('Champanhe', '#F7E7CE', 6),
('Magenta', '#CA1F7B', 7),
('Preto VZ', '#1C1C1C', 8),
('Caramelo VZ', '#703A0E', 9),
('Nude VZ', '#D1A37E', 10),
('Ouro Light TPU', '#E5C158', 11),
('Prata', '#C0C0C0', 12)
ON CONFLICT (nome) DO NOTHING;
