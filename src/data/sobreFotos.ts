/**
 * Fotos do carrossel da home, já incluídas no build (public/carrossel/).
 *
 * O CurvedCarousel mostra estas imagens na hora, sem esperar a API (que pode
 * demorar para acordar no Render). Depois ele consulta /api/sobre-nos-fotos/:
 * cada foto da API é trocada pela versão local quando o nome do arquivo já
 * existe aqui. Foto nova cadastrada no admin usa a URL original da API.
 *
 * Para atualizar uma foto: gere a versão leve (WebP, máx. 1200 px) em
 * public/carrossel/ e adicione o nome original do arquivo neste mapa.
 */

const LOCAIS_POR_ARQUIVO: Record<string, string> = {
  '1.jpg': '/carrossel/sobrenos-01.webp',
  '2.jpg': '/carrossel/sobrenos-02.webp',
  '3.jpg': '/carrossel/sobrenos-03.webp',
  '4.jpg': '/carrossel/sobrenos-04.webp',
  '5.jpg': '/carrossel/sobrenos-05.webp',
  '6.jpg': '/carrossel/sobrenos-06.webp',
  '7.jpg': '/carrossel/sobrenos-07.webp',
  '8.jpg': '/carrossel/sobrenos-08.webp',
  '9.jpg': '/carrossel/sobrenos-09.webp',
  '10.jpg': '/carrossel/sobrenos-10.webp',
  '11.jpg': '/carrossel/sobrenos-11.webp',
};

/** Devolve a versão local da foto da API, ou a própria URL se não houver versão local. */
export function imagemLocalOuOriginal(url: string): string {
  const arquivo = url.split('/').pop() ?? '';
  return LOCAIS_POR_ARQUIVO[arquivo] ?? url;
}

/** Fotos mostradas antes da resposta da API. */
export const SOBRE_NOS_FOTOS_LOCAIS = Object.values(LOCAIS_POR_ARQUIVO).map((imagem, i) => ({
  id: i,
  titulo: '',
  imagem,
  ordem: i,
}));
