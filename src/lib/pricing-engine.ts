/**
 * DISANTORINI ERP-X - Motor de Custos e Precificação (Markup Divisor)
 */

export interface InsumoCotacaoCalculo {
  insumoId: string;
  nome: string;
  quantidadePorPar: number;
  cotacoes: Array<{
    fornecedorNome: string;
    precoUnitario: number;
    disponivelEstoque: boolean;
  }>;
}

export interface ResultadoCustoBOM {
  custoInsumos: number;
  custoCaixaExterna: number;
  custoTotalPar: number;
  detalhesInsumos: Array<{
    insumoId: string;
    nome: string;
    quantidadePorPar: number;
    menorPreco: number;
    fornecedorEscolhido: string;
    subtotal: number;
  }>;
}

export interface ParametrosPrecificacao {
  custoTotal: number;
  margemLucroPct: number;
  comissaoPct: number;
  impostosPct: number;
}

export interface ResultadoPrecificacao {
  precoVenda: number;
  divisorMarkup: number;
  lucroAbsoluto: number;
  comissaoAbsoluta: number;
  impostosAbsoluto: number;
  custoTotal: number;
}

export const CUSTO_CAIXA_EXTERNA_PADRAO = 1.30;

/**
 * Calcula o custo de matéria-prima escolhendo sempre o fornecedor com MENOR PREÇO DISPONÍVEL EM ESTOQUE
 * e somando o custo obrigatório de Caixa Externa (R$ 1,30).
 */
export function calcularCustoBOM(
  insumos: InsumoCotacaoCalculo[],
  custoCaixa: number = CUSTO_CAIXA_EXTERNA_PADRAO
): ResultadoCustoBOM {
  let custoInsumos = 0;
  const detalhesInsumos: ResultadoCustoBOM['detalhesInsumos'] = [];

  for (const item of insumos) {
    // Filtra apenas cotações com estoque disponível
    const disponiveis = item.cotacoes.filter((c) => c.disponivelEstoque);
    
    // Escolhe a menor cotação disponível (ou a menor geral como fallback)
    const cotacoesOrdenadas = (disponiveis.length > 0 ? disponiveis : item.cotacoes).sort(
      (a, b) => a.precoUnitario - b.precoUnitario
    );

    const melhorCotacao = cotacoesOrdenadas[0] || {
      precoUnitario: 0,
      fornecedorNome: 'Sem Cotação',
    };

    const subtotal = Number((item.quantidadePorPar * melhorCotacao.precoUnitario).toFixed(4));
    custoInsumos += subtotal;

    detalhesInsumos.push({
      insumoId: item.insumoId,
      nome: item.nome,
      quantidadePorPar: item.quantidadePorPar,
      menorPreco: melhorCotacao.precoUnitario,
      fornecedorEscolhido: melhorCotacao.fornecedorNome,
      subtotal,
    });
  }

  const custoTotalPar = Number((custoInsumos + custoCaixa).toFixed(2));

  return {
    custoInsumos: Number(custoInsumos.toFixed(2)),
    custoCaixaExterna: custoCaixa,
    custoTotalPar,
    detalhesInsumos,
  };
}

/**
 * Aplica a regra de negócio do Markup Divisor:
 * Preço de Venda = Custo / (1 - ((Margem + Comissão + Impostos) / 100))
 */
export function calcularMarkupDivisor({
  custoTotal,
  margemLucroPct,
  comissaoPct,
  impostosPct,
}: ParametrosPrecificacao): ResultadoPrecificacao {
  if (custoTotal <= 0) {
    return {
      precoVenda: 0,
      divisorMarkup: 1,
      lucroAbsoluto: 0,
      comissaoAbsoluta: 0,
      impostosAbsoluto: 0,
      custoTotal: 0,
    };
  }

  const somaPercentuais = (margemLucroPct + comissaoPct + impostosPct) / 100.0;
  let divisor = 1.0 - somaPercentuais;

  // Evita divisor zero ou negativo que geraria preços infinitos/inválidos
  if (divisor <= 0.05) {
    divisor = 0.05;
  }

  const precoVenda = Number((custoTotal / divisor).toFixed(2));
  const lucroAbsoluto = Number(((precoVenda * margemLucroPct) / 100).toFixed(2));
  const comissaoAbsoluta = Number(((precoVenda * comissaoPct) / 100).toFixed(2));
  const impostosAbsoluto = Number(((precoVenda * impostosPct) / 100).toFixed(2));

  return {
    precoVenda,
    divisorMarkup: Number(divisor.toFixed(4)),
    lucroAbsoluto,
    comissaoAbsoluta,
    impostosAbsoluto,
    custoTotal,
  };
}
