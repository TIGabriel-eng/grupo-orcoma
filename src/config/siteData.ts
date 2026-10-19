import { apiUrl } from './api';

/**
 * Carrega dados públicos do site sem depender do backend estar acordado.
 *
 * 1. O snapshot estático (public/data/<arquivo>.json), gerado no build a partir
 *    da API, é servido pela CDN da Vercel e aparece na hora.
 * 2. Em paralelo, a API é consultada. Se responder, os dados ao vivo substituem
 *    o snapshot. Se estiver dormindo ou fora do ar, o snapshot continua na tela.
 *
 * `onData` pode ser chamado duas vezes (snapshot e depois API). A promise resolve
 * assim que houver dados para exibir e rejeita só se nenhuma das duas fontes funcionar.
 */
export function loadSiteData<T>(
  endpoint: string,
  snapshotFile: string,
  onData: (data: T) => void,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let delivered = false;
    let apiDelivered = false;
    let remaining = 2;
    let lastError: unknown = null;

    const emit = (data: T, fromApi: boolean) => {
      // Snapshot que chega depois de a API já ter respondido é descartado
      if (!fromApi && apiDelivered) return;
      if (fromApi) apiDelivered = true;
      onData(data);
      if (!delivered) {
        delivered = true;
        resolve();
      }
    };

    const doneOne = () => {
      remaining -= 1;
      if (remaining === 0 && !delivered) reject(lastError);
    };

    fetch(`/data/${snapshotFile}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Snapshot ${snapshotFile} indisponível`);
        return res.json() as Promise<T>;
      })
      .then((data) => emit(data, false))
      .catch((err) => {
        lastError = err;
      })
      .finally(doneOne);

    fetch(apiUrl(endpoint))
      .then((res) => {
        if (!res.ok) throw new Error(`API ${endpoint} respondeu ${res.status}`);
        return res.json() as Promise<T>;
      })
      .then((data) => emit(data, true))
      .catch((err) => {
        lastError = err;
      })
      .finally(doneOne);
  });
}
