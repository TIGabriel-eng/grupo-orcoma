import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { apiUrl } from '../config/api';

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
      fetch(apiUrl('/api/cliente/acesso/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: t, interesse }),
        keepalive: true,
      }).catch((err) => {
        console.warn('[ClienteContext] Falha ao registrar acesso do cliente:', err);
      });
    } catch (err) {
      // Nunca bloqueia o fluxo do cliente
      console.warn('[ClienteContext] Falha ao registrar acesso do cliente:', err);
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
