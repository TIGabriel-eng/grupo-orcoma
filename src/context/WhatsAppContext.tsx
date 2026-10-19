import { createContext, useContext, useState, type ReactNode } from 'react';

// 'padrao': chat abre com as opções. 'regiao': chat abre já perguntando a localidade.
export type WhatsAppIntent = 'padrao' | 'regiao';

interface WhatsAppContextValue {
  isOpen: boolean;
  intent: WhatsAppIntent;
  open: () => void;
  // `pergunta` é a primeira mensagem da Ana no fluxo 'regiao' (cada botão tem a sua)
  openRegiao: (pergunta?: string) => void;
  pergunta: string | undefined;
  close: () => void;
}

const WhatsAppContext = createContext<WhatsAppContextValue>({
  isOpen: false,
  intent: 'padrao',
  open: () => {},
  openRegiao: () => {},
  pergunta: undefined,
  close: () => {},
});

export function WhatsAppProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [intent, setIntent] = useState<WhatsAppIntent>('padrao');
  const [pergunta, setPergunta] = useState<string | undefined>(undefined);
  return (
    <WhatsAppContext.Provider
      value={{
        isOpen,
        intent,
        pergunta,
        open: () => {
          setIntent('padrao');
          setOpen(true);
        },
        openRegiao: (texto?: string) => {
          setIntent('regiao');
          setPergunta(texto);
          setOpen(true);
        },
        close: () => setOpen(false),
      }}
    >
      {children}
    </WhatsAppContext.Provider>
  );
}

export const useWhatsApp = () => useContext(WhatsAppContext);
