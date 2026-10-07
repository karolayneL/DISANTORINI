export interface BrasilApiCnpjResponse {
  cnpj: string;
  identificador_matriz_filial: number;
  descricao_matriz_filial: string;
  razao_social: string;
  nome_fantasia: string;
  situacao_cadastral: number;
  descricao_situacao_cadastral: string;
  data_situacao_cadastral: string;
  motivo_situacao_cadastral: number;
  nome_cidade_exterior: string | null;
  codigo_natureza_juridica: number;
  data_inicio_atividade: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  descricao_tipo_de_logradouro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: number | string;
  uf: string;
  codigo_municipio: number;
  municipio: string;
  ddd_telefone_1: string;
  ddd_telefone_2: string | null;
  ddd_fax: string | null;
  qualificacao_do_responsavel: number;
  capital_social: number;
  porte: string;
  descricao_porte: string;
  opcao_pelo_simples: boolean | null;
  data_opcao_pelo_simples: string | null;
  data_exclusao_do_simples: string | null;
  opcao_pelo_mei: boolean | null;
  situacao_especial: string | null;
  data_situacao_especial: string | null;
  cnaes_secundarios: Array<{
    codigo: number;
    descricao: string;
  }>;
  qsa: Array<{
    identificador_de_socio: number;
    nome_socio: string;
    cnpj_cpf_do_socio: string;
    codigo_qualificacao_socio: number;
    percentual_capital_social: number;
    data_entrada_sociedade: string;
    cpf_representante_legal: string | null;
    nome_representante_legal: string | null;
    codigo_qualificacao_representante_legal: number | null;
  }>;
}

export function sanitizeCnpj(cnpj: string): string {
  return cnpj.replace(/\D/g, '');
}

export function formatCnpj(cnpj: string): string {
  const clean = sanitizeCnpj(cnpj);
  if (clean.length !== 14) return cnpj;
  return clean.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

export function formatCep(cep: string | number): string {
  const clean = String(cep).replace(/\D/g, '').padStart(8, '0');
  if (clean.length !== 8) return String(cep);
  return clean.replace(/^(\d{5})(\d{3})$/, '$1-$2');
}

export async function fetchCnpjData(cnpj: string): Promise<BrasilApiCnpjResponse> {
  const cleanCnpj = sanitizeCnpj(cnpj);
  if (cleanCnpj.length !== 14) {
    throw new Error('CNPJ deve conter exatamente 14 dígitos numéricos.');
  }

  const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('CNPJ não encontrado na base da Receita Federal.');
    }
    if (response.status === 429) {
      throw new Error('Limite de requisições excedido. Tente novamente em alguns instantes.');
    }
    throw new Error(`Erro ao consultar CNPJ (Status: ${response.status})`);
  }

  return response.json();
}

export interface BrasilApiCepResponse {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
}

export async function fetchCepData(cep: string): Promise<BrasilApiCepResponse> {
  const clean = String(cep).replace(/\D/g, '');
  if (clean.length !== 8) {
    throw new Error('CEP deve conter 8 dígitos.');
  }

  try {
    const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${clean}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // fallback
  }

  // Fallback para ViaCEP
  const viaCepRes = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
  if (!viaCepRes.ok) {
    throw new Error('CEP não encontrado.');
  }
  const data = await viaCepRes.json();
  if (data.erro) {
    throw new Error('CEP não encontrado.');
  }
  return {
    cep: data.cep,
    state: data.uf,
    city: data.localidade,
    neighborhood: data.bairro,
    street: data.logradouro,
    service: 'viacep',
  };
}
