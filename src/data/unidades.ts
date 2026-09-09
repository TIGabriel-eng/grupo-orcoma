export interface Unidade {
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  matriz?: boolean;
}

export const unidades: Unidade[] = [
  {
    nome: 'Unidade Itaberaba',
    endereco: 'Avenida Ruy Barbosa, 138, Centro, Itaberaba - BA. 46880-000.',
    telefone: '(75) 3251-1824',
    email: 'itaberaba@orcoma.com.br',
    matriz: true,
  },
  {
    nome: 'Unidade Itaberaba (Pública)',
    endereco: 'Avenida Governador Luiz Viana Filho, 13, Itaberaba - BA. 46880-000. Auditório (75) 3251-4300.',
    telefone: '(75) 3251-4300',
    email: 'itaberaba@orcoma.com.br',
  },
  {
    nome: 'Unidade Maracás',
    endereco: 'Rua Afranio Peixoto, Maracás - BA, 45360-000.',
    telefone: '(73) 3533-2147',
    email: 'maracas@orcoma.com.br',
  },
  {
    nome: 'Unidade Feira de Santana',
    endereco: 'Avenida Getúlio Vargas, 1745, Capuchinhos, Feira de Santana - BA, 44075-425.',
    telefone: '(75) 3021-5950',
    email: 'fsa@orcoma.com.br',
  },
  {
    nome: 'Unidade Jequié',
    endereco: 'Rua Álvares Cabral, 04, Centro, Jequié - BA, 45200-256.',
    telefone: '(73) 3525-6383',
    email: 'jequie@orcoma.com.br',
  },
  {
    nome: 'Unidade Jaguaquara',
    endereco: 'Rua Coronel Durval de Matos, Jaguaquara - BA. 45345-000.',
    telefone: '(73) 3534-1558',
    email: 'jaguaquara@orcoma.com.br',
  },
  {
    nome: 'Unidade Jequié 2',
    endereco: 'Avenida Rio Branco, 25, Campo do América, Jequié - BA. 45203-011.',
    telefone: '(73) 3525-3685',
    email: 'jequie1leads@orcoma.com.br',
  },
  {
    nome: 'Unidade Jiquiriçá',
    endereco: 'Rua Sete de Setembro, Jiquiriçá - BA, 45470-000.',
    telefone: '(75) 3651-2563',
    email: 'jiquirica@orcoma.com.br',
  },
  {
    nome: 'Unidade Várzea Nova',
    endereco: 'Várzea Nova, 44690-000, BA.',
    telefone: '(74) 3659-2614',
    email: 'varzeanova@orcoma.com.br',
  },
  {
    nome: 'Unidade Ruy Barbosa',
    endereco: 'Avenida José Cerqueira Braga, Ruy Barbosa - BA. 46800-000.',
    telefone: '(75) 3252-1467',
    email: 'ruybarbosa@orcoma.com.br',
  },
  {
    nome: 'Unidade Utinga',
    endereco: 'Avenida Monteiro, Utinga - BA. 46810-000.',
    telefone: '(75) 3337-1383',
    email: 'utinga@orcoma.com.br',
  },
  {
    nome: 'Unidade Salvador',
    endereco: 'Rua Frederico Simões, Caminho das Árvores, 447 - BA. 41820-020. Ceo Salvador Shopping, torre Londres, 10° andar, sala 1016.',
    telefone: '(71) 3901-2519',
    email: 'salvador@orcoma.com.br',
  },
  {
    nome: 'Unidade Seabra',
    endereco: 'Rua Ana Nery, 108, 1° andar, sala 01, Centro, Seabra - BA. 46900-000.',
    telefone: '(75) 3331-3798',
    email: 'seabra@orcoma.com.br',
  },
  {
    nome: 'Unidade São Paulo',
    endereco: 'Avenida Brigadeiro Faria Lima, 1461, conjunto 41 e 3 vgs, Pinheiros, Torre Sul, 01452-921, São Paulo.',
    telefone: '(11) 2050-0486',
    email: 'contato@orcoma.com.br',
  },
];

export function telefoneParaLink(telefone: string): string {
  const digitos = telefone.replace(/\D/g, '');
  return `tel:+55${digitos}`;
}
