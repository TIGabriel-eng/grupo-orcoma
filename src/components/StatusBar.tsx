import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const hora = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div className="statusbar" aria-hidden="true">
      <span className="statusbar__time">{hora}</span>
      <div className="statusbar__icons">
        <svg className="statusbar__icon" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="9" width="3" height="4" rx="1" fill="#fff" />
          <rect x="5" y="6" width="3" height="7" rx="1" fill="#fff" />
          <rect x="10" y="3" width="3" height="10" rx="1" fill="#fff" />
          <rect x="15" y="0" width="3" height="13" rx="1" fill="#fff" />
        </svg>
        <svg className="statusbar__icon statusbar__icon--wifi" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 4a7.7 7.7 0 0 1 5.7 2.6l-1.8 1.9A5.4 5.4 0 0 0 11 6.4c-1.5 0-2.9.6-3.9 1.7L5.3 6.2A7.7 7.7 0 0 1 11 4Z" fill="#fff" />
          <path d="M11 8.5a4 4 0 0 1 3 1.4l-1.8 1.9A1.7 1.7 0 0 0 11 11c-.4 0-.8.2-1.1.5L8.1 9.6A4 4 0 0 1 11 8.5Z" fill="#fff" />
          <circle cx="11" cy="13.5" r="1.7" fill="#fff" />
        </svg>
        <svg className="statusbar__icon statusbar__icon--battery" viewBox="0 0 27 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="#fff" strokeOpacity="0.9" />
          <rect x="2.5" y="2.5" width="18" height="8" rx="2" fill="#fff" />
          <path d="M25 4.5v4a2.5 2.5 0 0 0 0-4Z" fill="#fff" fillOpacity="0.9" />
        </svg>
      </div>
    </div>
  );
}
