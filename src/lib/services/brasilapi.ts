export interface BrasilApiCnpjResponse {
  cnpj: string;
  identificador_matriz_filial?: number;
  descricao_matriz_filial?: string;
  razao_social: string;
  nome_fantasia: string;
  situacao_cadastral?: number;
  descricao_situacao_cadastral: string;
  data_situacao_cadastral?: string;
  motivo_situacao_cadastral?: number;
  nome_cidade_exterior?: string | null;
  codigo_natureza_juridica?: number;
  data_inicio_atividade?: string;
  cnae_fiscal?: number | string;
  cnae_fiscal_descricao?: string;
  descricao_tipo_de_logradouro?: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: number | string;
  uf: string;
  codigo_municipio?: number | string;
  municipio: string;
  ddd_telefone_1?: string;
  ddd_telefone_2?: string | null;
  ddd_fax?: string | null;
  qualificacao_do_responsavel?: number;
  capital_social?: number;
  porte?: string;
  descricao_porte?: string;
  opcao_pelo_simples?: boolean | null;
  data_opcao_pelo_simples?: string | null;
  data_exclusao_do_simples?: string | null;
  opcao_pelo_mei?: boolean | null;
  situacao_especial?: string | null;
  data_situacao_especial?: string | null;
  email?: string;
  cnaes_secundarios?: Array<{
    codigo: number | string;
    descricao: string;
  }>;
  qsa?: Array<{
    identificador_de_socio?: number;
    nome_socio: string;
    cnpj_cpf_do_socio?: string;
    codigo_qualificacao_socio?: number;
    percentual_capital_social?: number;
    data_entrada_sociedade?: string;
    cpf_representante_legal?: string | null;
    nome_representante_legal?: string | null;
    codigo_qualificacao_representante_legal?: number | null;
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

  // 1. Tenta BrasilAPI
  try {
    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Falha na consulta via BrasilAPI, tentando fallback...', err);
  }

  // 2. Fallback 1: CNPJ.ws (Pública)
  try {
    const res = await fetch(`https://publica.cnpj.ws/cnpj/${cleanCnpj}`, {
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const data = await res.json();
      const est = data.estabelecimento || {};
      return {
        cnpj: est.cnpj || cleanCnpj,
        razao_social: data.razao_social || '',
        nome_fantasia: est.nome_fantasia || data.razao_social || '',
        descricao_situacao_cadastral: est.situacao_cadastral || 'Ativa',
        cnae_fiscal: est.atividade_principal?.id || '',
        cnae_fiscal_descricao: est.atividade_principal?.descricao || '',
        descricao_tipo_de_logradouro: est.tipo_logradouro || '',
        logradouro: est.logradouro || '',
        numero: est.numero || '',
        complemento: est.complemento || '',
        bairro: est.bairro || '',
        cep: est.cep || '',
        uf: est.estado?.sigla || '',
        codigo_municipio: est.cidade?.ibge_id || '',
        municipio: est.cidade?.nome || '',
        ddd_telefone_1: est.ddd1 && est.telefone1 ? `(${est.ddd1}) ${est.telefone1}` : '',
        email: est.email || '',
        porte: data.porte?.descricao || '',
        descricao_porte: data.porte?.descricao || '',
        opcao_pelo_simples: data.simples?.simples === 'Sim',
        opcao_pelo_mei: data.simples?.mei === 'Sim',
      };
    }
  } catch (err) {
    console.warn('Falha na consulta via CNPJ.ws, tentando fallback...', err);
  }

  // 3. Fallback 2: ReceitaWS (Pública via CORS/fetch)
  try {
    const res = await fetch(`https://receitaws.com.br/v1/cnpj/${cleanCnpj}`, {
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'OK') {
        return {
          cnpj: cleanCnpj,
          razao_social: data.nome || '',
          nome_fantasia: data.fantasia || data.nome || '',
          descricao_situacao_cadastral: data.situacao || 'Ativa',
          cnae_fiscal: data.atividade_principal?.[0]?.code || '',
          cnae_fiscal_descricao: data.atividade_principal?.[0]?.text || '',
          descricao_tipo_de_logradouro: '',
          logradouro: data.logradouro || '',
          numero: data.numero || '',
          complemento: data.complemento || '',
          bairro: data.bairro || '',
          cep: data.cep?.replace(/\D/g, '') || '',
          uf: data.uf || '',
          codigo_municipio: '',
          municipio: data.municipio || '',
          ddd_telefone_1: data.telefone || '',
          email: data.email || '',
          porte: data.porte || '',
          descricao_porte: data.porte || '',
        };
      }
    }
  } catch (err) {
    console.warn('Falha na consulta via ReceitaWS, tentando fallback...', err);
  }

  // 4. Fallback 3: CNPJá (Open)
  try {
    const res = await fetch(`https://open.cnpja.com/office/${cleanCnpj}`, {
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const comp = data.company || {};
      const phone = data.phones?.[0];
      const emailObj = data.emails?.[0];
      return {
        cnpj: cleanCnpj,
        razao_social: comp.name || '',
        nome_fantasia: data.alias || comp.name || '',
        descricao_situacao_cadastral: data.status?.text || 'Ativa',
        cnae_fiscal: data.mainActivity?.id || '',
        cnae_fiscal_descricao: data.mainActivity?.text || '',
        descricao_tipo_de_logradouro: '',
        logradouro: addr.street || '',
        numero: addr.number || '',
        complemento: addr.details || '',
        bairro: addr.district || '',
        cep: addr.zip || '',
        uf: addr.state || '',
        codigo_municipio: addr.municipality || '',
        municipio: addr.city || '',
        ddd_telefone_1: phone ? `(${phone.area}) ${phone.number}` : '',
        email: emailObj?.address || '',
        porte: comp.size?.text || '',
        descricao_porte: comp.size?.text || '',
        opcao_pelo_simples: comp.simples?.optant || false,
        opcao_pelo_mei: comp.simei?.optant || false,
      };
    }
  } catch (err) {
    console.warn('Falha na consulta via CNPJá', err);
  }

  throw new Error('Não foi possível obter dados deste CNPJ nos provedores da Receita Federal. Você pode preencher os campos manualmente.');
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
    const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${clean}`, {
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // fallback
  }

  // Fallback para ViaCEP
  const viaCepRes = await fetch(`https://viacep.com.br/ws/${clean}/json/`, {
    signal: AbortSignal.timeout(5000),
  });
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
