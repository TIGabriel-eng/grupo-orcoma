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
  '02021545_DSC_65.jpg': '/carrossel/00-02021545.webp',
  '02021545_DSC_79_5gfxVh5.jpg': '/carrossel/01-02021545_dsc_79_5gfxvh5.webp',
  'download_NAcGzPG.jpg': '/carrossel/02-download_nacgzpg.webp',
  'DSC08191_a7bmicX.jpg': '/carrossel/03-dsc08191_a7bmicx.webp',
  'politica_B8Dth9z.jpg': '/carrossel/04-politica_b8dth9z.webp',
  '2008_zSUzoAm.jpg': '/carrossel/05-2008_zsuzoam.webp',
  '2014.jpg': '/carrossel/06-2014.webp',
  'imagem-6-1-sobre.jpg': '/carrossel/07-imagem-6-1-sobre.webp',
  'nossa-historia.jpg': '/carrossel/08-nossa-historia.webp',
  'abertura.jpg': '/carrossel/09-abertura.webp',
  'bino.png': '/carrossel/10-bino.webp',
  'OrcomaContraternizacao2025.png': '/carrossel/11-orcomacontraternizacao2025.webp',
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
