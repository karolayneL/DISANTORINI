export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type CategoriaProduto = 'Rasteira' | 'Salto' | 'Papete' | 'Plataforma';
export type UnidadeMedida = 'PAR' | 'METRO' | 'M2' | 'KG' | 'LITRO' | 'UNIDADE' | 'CENTO' | 'MILHEIRO';
export type StatusPedido = 'Rascunho' | 'Cotado' | 'Aprovado' | 'Em Producao' | 'Finalizado' | 'Faturado' | 'Cancelado';

export interface Cliente {
  id: string;
  tipo_pessoa: 'PJ' | 'PF';
  cnpj_cpf: string;
  razao_social: string;
  nome_fantasia: string | null;
  inscricao_estadual: string | null;
  email: string | null;
  telefone: string | null;
  whatsapp: string | null;
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string;
  uf: string;
  codigo_ibge: string | null;
  situacao_cadastral: string | null;
  cnae_principal: string | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Fornecedor {
  id: string;
  cnpj_cpf: string;
  razao_social: string;
  nome_fantasia: string | null;
  contato_nome: string | null;
  telefone: string | null;
  whatsapp: string | null;
  email: string | null;
  cidade: string | null;
  uf: string | null;
  chave_pix: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Insumo {
  id: string;
  codigo_referencia: string;
  nome: string;
  categoria_insumo: string;
  unidade_medida: UnidadeMedida;
  descricao: string | null;
  estoque_minimo: number;
  created_at: string;
  updated_at: string;
}

export interface CotacaoInsumo {
  id: string;
  insumo_id: string;
  fornecedor_id: string;
  preco_unitario: number;
  disponivel_estoque: boolean;
  lead_time_dias: number;
  observacao: string | null;
  data_cotacao: string;
  created_at: string;
  updated_at: string;
  fornecedor?: Fornecedor;
}

export interface Produto {
  id: string;
  referencia: string;
  nome: string;
  categoria: CategoriaProduto;
  foto_url: string | null;
  margem_lucro_pct: number;
  comissao_pct: number;
  impostos_pct: number;
  custo_adicional_caixa: number;
  custo_base_calculado: number;
  preco_venda_sugerido: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  insumos?: ProdutoInsumo[];
}

export interface ProdutoInsumo {
  id: string;
  produto_id: string;
  insumo_id: string;
  quantidade_por_par: number;
  observacao: string | null;
  insumo?: Insumo;
}

export interface CorCatalogo {
  id: string;
  nome: string;
  codigo_hex: string | null;
  ativo: boolean;
  ordem_exibicao: number;
}

export interface Pedido {
  id: string;
  numero_pedido: string;
  cliente_id: string;
  status: StatusPedido;
  condicao_pagamento: string;
  previsao_entrega: string;
  total_pares: number;
  valor_total_custo: number;
  valor_total_venda: number;
  observacoes: string | null;
  payload_sefaz_ce: Json | null;
  created_at: string;
  updated_at: string;
  cliente?: Cliente;
  itens?: PedidoItem[];
}

export interface PedidoItem {
  id: string;
  pedido_id: string;
  produto_id: string;
  cor_nome: string;
  grade_34: number;
  grade_35: number;
  grade_36: number;
  grade_37: number;
  grade_38: number;
  grade_39: number;
  grade_40: number;
  grade_41: number;
  grade_42: number;
  total_pares_item: number;
  custo_unitario_base: number;
  preco_unitario_venda: number;
  subtotal_venda: number;
  produto?: Produto;
}
