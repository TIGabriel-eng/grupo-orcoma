/**
 * Fotos do carrossel da home (seção Sobre Nós), incluídas no build em public/carrossel/.
 *
 * O site não consulta mais a API do admin para essas fotos: o carrossel mostra
 * sempre esta lista. Para trocar uma foto, substitua o arquivo WebP em
 * public/carrossel/ e ajuste o caminho aqui.
 */

// Sem repetições: a foto 07 repete a 06, a 09 repete a 08 e as 01, 02, 03 e 11 repetem a cena da 10.
const FOTOS_LOCAIS = [
  '/carrossel/sobrenos-04.webp',
  '/carrossel/sobrenos-05.webp',
  '/carrossel/sobrenos-06.webp',
  '/carrossel/sobrenos-08.webp',
  '/carrossel/sobrenos-10.webp',
  '/carrossel/sobrenos-13.webp',
  '/carrossel/sobrenos-14.webp',
  '/carrossel/sobrenos-15.webp',
];

export const SOBRE_NOS_FOTOS_LOCAIS = FOTOS_LOCAIS.map((imagem, i) => ({
  id: i,
  titulo: '',
  imagem,
  ordem: i,
}));
