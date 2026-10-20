export const ESPECIALIDADE_IMAGENS: Record<string, string> = {
  'iniciativa-publica': '/especialidades/iniciativa-publica.jpg',
  'comercio-varejista-e-atacadista': '/especialidades/comercio-varejista-e-atacadista.jpg',
  'medicos-clinicas': '/especialidades/medicos-clinicas.jpg',
  'hospitais': '/especialidades/hospitais.jpg',
  'terceiro-setor': '/especialidades/terceiro-setor.jpg',
  'construcao-civil': '/especialidades/construcao-civil.jpg',
};

export function imagemEspecialidade(slug: string, imagemApi: string): string {
  return ESPECIALIDADE_IMAGENS[slug] ?? imagemApi;
}
