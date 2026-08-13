// ============================================================
// AVALIAÇÕES DE CLIENTES
// ============================================================
// Para adicionar ou editar avaliações, mexa SOMENTE neste arquivo.
// Nenhuma outra parte do site precisa ser alterada.
//
// Campos de cada avaliação:
//   - name   : nome do cliente (obrigatório)
//   - rating : nota de 1 a 5 (obrigatório)
//   - text   : texto da avaliação (obrigatório)
//   - date   : data da avaliação (opcional - pode ser removido)
//
// Exemplo de como adicionar uma nova avaliação:
//   {
//     name: 'Fulano de Tal',
//     rating: 5,
//     text: 'Ótimo atendimento.',
//     date: '10/08/2026',
//   },
// ============================================================

export interface Review {
  name: string;
  rating: number;
  text: string;
  date?: string;
}

export const reviews: Review[] = [
  {
    name: 'Giulliana RH Souza Ramos',
    rating: 5,
    text: 'A contabilidade Orcoma presta um serviço de excelência, com eficiência, profissionais altamente capacitados e um atendimento ao cliente rápido e eficaz, especialmente por telefone. Além disso, demonstram comprometimento e atenção às necessidades de cada cliente, garantindo segurança e confiança em todos os processos.',
  },
  {
    name: 'Viviane Lopes',
    rating: 5,
    text: 'Excelente contabilidade. Recomendo. Responsabilidade, competência...',
  },
  {
    name: 'Ramon Sapocaia',
    rating: 5,
    text: 'Incrível. Serviços de primeira, equipe especializada e atendimento único. Parabéns!!',
  },
  {
    name: 'Damiana Portella',
    rating: 5,
    text: 'Atendimento agilizado e resolutivo. Equipe excelente e muito bem preparada! Sinto segurança em ter minha empresa cuidada pela Orcoma.',
  },
  {
    name: 'Wagner Santos',
    rating: 5,
    text: 'Muito bom... ótimo serviço... serviços de extrema qualidade... contabilidade de confiança.... ótimos profissionais...',
  },
  {
    name: 'Enny Carvalho',
    rating: 5,
    text: 'Muito positiva, minhas demandas em nome das empresas Comercial Evamar Serra Ltda, Marcelo Pereira Serra ME e Marcelo Pereira Serra Ltda sempre são muito bem atendidas.',
  },
];

export const googleRating = {
  score: '4.9',
  total: '110',
};
