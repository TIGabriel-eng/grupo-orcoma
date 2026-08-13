import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export interface ClienteInfo {
  nome: string;
  email: string;
  celular: string;
  cpf: string;
  cnpj: string;
}

interface ClienteContextValue {
  token: string | null;
  cliente: ClienteInfo | null;
  isAuthenticated: boolean;
  saveSession: (token: string, cliente: ClienteInfo) => void;
  clearSession: () => void;
  registrarAcesso: (interesse: string) => void;
}

const TOKEN_KEY = 'orcoma_cliente_token';
const CLIENTE_KEY = 'orcoma_cliente_info';

const ClienteContext = createContext<ClienteContextValue>({
  token: null,
  cliente: null,
  isAuthenticated: false,
  saveSession: () => {},
  clearSession: () => {},
  registrarAcesso: () => {},
});

function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function readCliente(): ClienteInfo | null {
  try {
    const raw = localStorage.getItem(CLIENTE_KEY);
    return raw ? (JSON.parse(raw) as ClienteInfo) : null;
  } catch {
    return null;
  }
}

export function ClienteProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readToken);
  const [cliente, setCliente] = useState<ClienteInfo | null>(readCliente);

  const saveSession = useCallback((newToken: string, info: ClienteInfo) => {
    try {
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(CLIENTE_KEY, JSON.stringify(info));
    } catch {
      // localStorage indisponível — segue com o estado em memória
    }
    setToken(newToken);
    setCliente(info);
  }, []);

  const clearSession = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(CLIENTE_KEY);
    } catch {
      // localStorage indisponível — segue com o estado em memória
    }
    setToken(null);
    setCliente(null);
  }, []);

  const registrarAcesso = useCallback((interesse: string) => {
    const t = readToken();
    if (!t) return;
    try {
      fetch('/api/cliente/acesso/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: t, interesse }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // silencioso — nunca bloqueia a abertura do WhatsApp
    }
  }, []);

  return (
    <ClienteContext.Provider
      value={{
        token,
        cliente,
        isAuthenticated: !!token,
        saveSession,
        clearSession,
        registrarAcesso,
      }}
    >
      {children}
    </ClienteContext.Provider>
  );
}

export const useCliente = () => useContext(ClienteContext);
