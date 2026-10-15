// Base de conhecimento da atendente virtual (Ana).
// Textos de serviços vêm das páginas do site (ServicesOrbital.tsx e SolucoesPage.tsx).
// Para mudar uma resposta, edite só este arquivo.

export interface ItemConhecimento {
  id: string;
  titulo: string;
  // Palavras que, quando aparecem na pergunta, levam a este item
  palavras: string[];
  resposta: string;
}

export const servicos: ItemConhecimento[] = [
  {
    id: 'departamento-contabil',
    titulo: 'Departamento Contábil',
    palavras: ['contabil', 'contabilidade', 'departamento contabil', 'balanco', 'patrimonio'],
    resposta:
      'O Departamento Contábil registra, organiza e acompanha as movimentações do patrimônio da sua empresa, de acordo com a atividade econômica que ela exerce.',
  },
  {
    id: 'departamento-fiscal',
    titulo: 'Departamento Fiscal',
    palavras: ['fiscal', 'departamento fiscal', 'compliance', 'obrigacoes', 'impostos'],
    resposta:
      'O Departamento Fiscal faz planejamento tributário estratégico e compliance, para garantir que sua empresa pague o mínimo legal com segurança.',
  },
  {
    id: 'departamento-pessoal',
    titulo: 'Departamento Pessoal',
    palavras: ['pessoal', 'folha', 'folha de pagamento', 'funcionario', 'funcionarios', 'trabalhista', 'salario'],
    resposta:
      'O Departamento Pessoal cuida da gestão completa da folha de pagamento e das relações trabalhistas, com segurança jurídica para sua empresa e seus colaboradores.',
  },
  {
    id: 'consultoria-tributaria',
    titulo: 'Consultoria Tributária',
    palavras: ['consultoria tributaria', 'tributaria', 'tributario', 'economia fiscal'],
    resposta:
      'A Consultoria Tributária faz a assessoria especializada na interpretação e aplicação da legislação tributária, identifica oportunidades de economia fiscal e garante a conformidade com as obrigações acessórias.',
  },
  {
    id: 'planejamento-tributario',
    titulo: 'Planejamento Tributário',
    palavras: ['planejamento tributario', 'regime tributario', 'carga de impostos', 'simples nacional', 'lucro presumido', 'lucro real'],
    resposta:
      'O Planejamento Tributário analisa qual regime tributário é o ideal para o seu negócio, com simulações e projeções que reduzem a carga de impostos de forma legal e segura.',
  },
  {
    id: 'consultoria-societaria',
    titulo: 'Consultoria Societária',
    palavras: ['societaria', 'contrato social', 'alteracao contratual', 'reestruturacao', 'societario'],
    resposta:
      'A Consultoria Societária cuida de alterações contratuais e reestruturação societária, com agilidade e segurança.',
  },
  {
    id: 'abertura-empresa',
    titulo: 'Abertura de empresa',
    palavras: ['abrir empresa', 'abertura de empresa', 'abrir uma empresa', 'abrir minha empresa', 'registro', 'cnpj', 'licenciamento'],
    resposta:
      'Fazemos a abertura de empresa com análise do enquadramento tributário, registro e licenciamento, para você começar com tudo certo desde o início.',
  },
  {
    id: 'migracao-mei-me',
    titulo: 'Migração de MEI para ME',
    palavras: ['mei', 'limite do mei', 'passei do limite', 'migrar de mei'],
    resposta:
      'Se você passou do limite do MEI, fazemos a transição para ME de forma planejada e sem perda de benefícios, com a nova estrutura tributária já definida.',
  },
  {
    id: 'declaracao-irpf',
    titulo: 'Declaração de IRPF',
    palavras: ['irpf', 'imposto de renda', 'declaracao', 'declaração', 'pessoa fisica'],
    resposta:
      'Fazemos a Declaração de Imposto de Renda da Pessoa Física com cuidado: analisamos as deduções e entregamos a declaração sem erros, para você declarar certo e pagar o mínimo legal.',
  },
  {
    id: 'servicos-financeiros',
    titulo: 'Serviços Financeiros',
    palavras: ['financeiro', 'bpo', 'fluxo de caixa', 'pagamentos', 'contas a pagar', 'contas a receber'],
    resposta:
      'Oferecemos BPO Financeiro: cuidamos do seu fluxo de caixa e dos pagamentos para você focar no seu negócio.',
  },
  {
    id: 'consultoria-empresarial',
    titulo: 'Consultoria Empresarial',
    palavras: ['consultoria empresarial', 'crescimento', 'eficiencia', 'estrategia', 'gestao'],
    resposta:
      'A Consultoria Empresarial traz soluções estratégicas personalizadas para impulsionar o crescimento e a eficiência da sua empresa.',
  },
];

export const trocaContador: ItemConhecimento = {
  id: 'troca-contador',
  titulo: 'Troca de contador',
  palavras: ['troca', 'trocar', 'contador', 'migrar contabilidade', 'migracao', 'migracao de contabilidade', 'mudar de contabilidade', 'mudar de contador', 'trocar de contabilidade'],
  resposta:
    'Para trocar de contabilidade, nós recebemos sua empresa, organizamos os documentos e assumimos todo o processo. Você encontra mais detalhes em "Migração de Contabilidade", na página de Soluções. Se preferir, escreva "consultor" e um especialista te atende.',
};

export const listaServicos: ItemConhecimento = {
  id: 'lista-servicos',
  titulo: 'Serviços prestados',
  palavras: ['servico', 'servicos', 'prestam', 'prestados', 'oferecem', 'oferecidos'],
  resposta: `Prestamos os seguintes serviços: ${servicos.map((s) => s.titulo).join(', ')}. Sobre qual deles você quer saber mais?`,
};

export const informacoesGerais: ItemConhecimento[] = [
  {
    id: 'unidades',
    titulo: 'Unidades e atendimento',
    palavras: ['unidade', 'unidades', 'endereco', 'onde fica', 'localizacao', 'cidade', 'filial', 'presencial', 'distancia', 'online', 'atendem', 'atendimento a distancia'],
    resposta:
      'Temos unidades na Bahia (Salvador, Feira de Santana, Jequié, Seabra, Jaguaquara, Várzea Nova, Maracás, Utinga, Itaberaba, Jiquiriçá e Campo Formoso) e em São Paulo. Também atendemos à distância, para clientes de qualquer estado. Me diga sua cidade e estado para eu indicar a unidade mais próxima.',
  },
  {
    id: 'horario',
    titulo: 'Horário de atendimento',
    palavras: ['horario', 'horarios', 'funciona', 'abre', 'fecha', 'expediente'],
    resposta:
      'Nosso atendimento é de segunda a sexta, das 8h às 18h (sexta até as 17h). Fora desse horário, você pode deixar sua mensagem que retornamos no próximo horário de atendimento.',
  },
];

// Todos os itens que a atendente consegue responder
// trocaContador vem primeiro: em empate de palavras, a pergunta sobre troca ganha de "contabilidade"
export const todosItens: ItemConhecimento[] = [trocaContador, listaServicos, ...servicos, ...informacoesGerais];

// Procura o item que melhor combina com a pergunta (pelo número de palavras-chave encontradas)
export function buscarConhecimento(pergunta: string, itens: ItemConhecimento[]): ItemConhecimento | null {
  const texto = pergunta
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

  let melhor: ItemConhecimento | null = null;
  let melhorPontuacao = 0;

  for (const item of itens) {
    const pontuacao = item.palavras.reduce((total, palavra) => {
      const termo = palavra
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase();
      const escapado = termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`(^|[^a-z])${escapado}($|[^a-z])`).test(texto) ? total + 1 : total;
    }, 0);

    if (pontuacao > melhorPontuacao) {
      melhor = item;
      melhorPontuacao = pontuacao;
    }
  }

  return melhor;
}
