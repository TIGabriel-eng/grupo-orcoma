import { createContext, useContext, useState, type ReactNode } from 'react';

interface WhatsAppContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const WhatsAppContext = createContext<WhatsAppContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
});

export function WhatsAppProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <WhatsAppContext.Provider value={{ isOpen, open: () => setOpen(true), close: () => setOpen(false) }}>
      {children}
    </WhatsAppContext.Provider>
  );
}

export const useWhatsApp = () => useContext(WhatsAppContext);