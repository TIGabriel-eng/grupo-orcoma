import { useEffect, useState } from 'react';

export default function SlowLoadingHint({ delayMs = 5000 }: { delayMs?: number }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  if (!show) return null;

  return (
    <p className="text-sm text-gray-400 text-center mt-2">
      Carregando... pode levar alguns segundos.
    </p>
  );
}