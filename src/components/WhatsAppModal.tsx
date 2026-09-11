import { useEffect, useRef, useState } from 'react';
import { Headset, User, X, Send } from 'lucide-react';
import { useWhatsApp } from '../context/WhatsAppContext';
import { attendantConfig, getAttendantStatus, findNearestUnit, buildWhatsAppUrl } from '../config/attendant';

const BUBBLE_MESSAGES = [
  'Tem alguma dúvida? Posso ajudar!',
  'Oi! Se precisar, eu estou aqui, viu?',
  'Temos o prazer em te atender!',
];
const INTERACTED_KEY = 'orcoma_chat_interacted';
const BUBBLE_INITIAL_DELAY = 2000;
const BUBBLE_ROTATION_MS = 6000;

interface Message {
  id: number;
  text: string;
  sender: 'ana' | 'user';
  timestamp: Date;
  isOptions?: boolean;
}

function alreadyInteracted(): boolean {
  try {
    return localStorage.getItem(INTERACTED_KEY) === '1';
  } catch {
    return false;
  }
}

function markInteracted(): void {
  try {
    localStorage.setItem(INTERACTED_KEY, '1');
  } catch {
    // localStorage indisponível — ignora
  }
}

type ChatTurn = 'options' | 'await_region' | 'region_resolved';

export default function WhatsAppModal() {
  const { isOpen, open, close } = useWhatsApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [bubbleShown, setBubbleShown] = useState(false);
  const [bubbleIndex, setBubbleIndex] = useState(0);
  const [status, setStatus] = useState(getAttendantStatus);
  const [chatTurn, setChatTurn] = useState<ChatTurn>('options');
  const prevOpenRef = useRef(isOpen);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const bubbleContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const timer = setInterval(() => setStatus(getAttendantStatus()), 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!bubbleVisible) return;
    const initial = setTimeout(() => setBubbleShown(true), BUBBLE_INITIAL_DELAY);
    const interval = setInterval(
      () => setBubbleIndex((i) => (i + 1) % BUBBLE_MESSAGES.length),
      BUBBLE_ROTATION_MS,
    );
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [bubbleVisible]);

  useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      markInteracted();
      setBubbleVisible(false);
      // Mostra mensagem de boas-vindas da Ana ao abrir
      setMessages([
        {
          id: Date.now(),
          text: 'Oi! Como podemos te ajudar? :D',
          sender: 'ana',
          timestamp: new Date(),
          isOptions: true,
        },
      ]);
    } else if (!isOpen && prevOpenRef.current) {
      setBubbleVisible(true);
    }
    prevOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    const container = bubbleContainerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = (x - centerX) / 20;
      const rotateX = (centerY - y) / 20;
      container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      container.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const regionInput = inputValue.trim();
    setInputValue('');

        // Se está aguardando a região do usuário
    if (chatTurn === 'await_region') {
      const foundUnit = findNearestUnit(regionInput);
      const whatsappUrl = buildWhatsAppUrl(
        `Olá, gostaria de conversar com um consultor(a). Vim do site Orcoma e sou da região ${regionInput}.`
      );

      setTimeout(() => {
        if (foundUnit) {
          const anaMessage: Message = {
            id: Date.now() + 1,
            text: `Perfeito! Temos atendentes em ${foundUnit.nome} - ${foundUnit.estado}. Vou redirecionar você para nosso WhatsApp.`,
            sender: 'ana',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, anaMessage]);
          setChatTurn('region_resolved');

          // Redireciona para o WhatsApp após 1.5 segundo
          setTimeout(() => {
            window.open(whatsappUrl, '_blank');
          }, 1500);
        } else {
          const anaMessage: Message = {
            id: Date.now() + 1,
            text: `Não encontramos uma unidade próxima a "${regionInput}" no momento. De qualquer forma, vou te conectar com nosso consultor que irá orientar sobre a melhor opção para sua região.`,
            sender: 'ana',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, anaMessage]);
          setChatTurn('region_resolved');

          // Redireciona para o WhatsApp após 1.5 segundo
          setTimeout(() => {
            window.open(whatsappUrl, '_blank');
          }, 1500);
        }
      }, 500);
      return;
    }

    // Resposta padrão para outras mensagens
    setTimeout(() => {
      const anaResponses = [
        'Obrigada pela mensagem! Um de nossos especialistas entrará em contato em breve.',
        'Entendido! Vou encaminhar sua mensagem para nossa equipe.',
        'Ótimo! Como posso te ajudar com isso?',
        'Certo! Estamos aqui para ajudar. Mais alguma dúvida?',
      ];
      const randomResponse = anaResponses[Math.floor(Math.random() * anaResponses.length)];
      
      const anaMessage: Message = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: 'ana',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, anaMessage]);
    }, 1000);
  };

  const handleOptionDuvidas = () => {
    const userMessage: Message = {
      id: Date.now(),
      text: 'Quero apenas tirar dúvidas',
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const anaMessage: Message = {
        id: Date.now() + 1,
        text: 'Ótimo! Estou aqui para ajudar. Qual é a sua dúvida?',
        sender: 'ana',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, anaMessage]);
    }, 500);
  };

  const handleOptionConsultor = () => {
    const userMessage: Message = {
      id: Date.now(),
      text: 'Gostaria de falar com um consultor',
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setChatTurn('await_region');

    setTimeout(() => {
            const anaMessage: Message = {
        id: Date.now() + 1,
        text: 'Perfeito! De qual cidade e estado vocêé? Pois assim, conseguimos direcioná-lo para um especialista mais próximo da sua localidade.',
        sender: 'ana',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, anaMessage]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpen = () => {
    open();
  };

  const handleClose = () => {
    setMessages([]);
    setInputValue('');
    close();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3">
          <div
            className="w-[320px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl overflow-hidden transition-all"
            style={{ background: 'white', border: '1px solid #e5e7eb' }}
          >
            <div className="flex items-center gap-3 px-5 py-4" style={{ background: '#f3f4f6' }}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}
              >
                <User size={20} style={{ color: '#25D366' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{attendantConfig.name}</p>
                <p className="text-xs text-gray-400">{status}</p>
              </div>
              <button onClick={() => handleClose()} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            {/* Área do Chat */}
            <div className="h-[300px] overflow-y-auto p-4 space-y-3" style={{ background: '#f9fafb' }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                      message.sender === 'user'
                        ? 'rounded-br-md'
                        : 'rounded-bl-md'
                    }`}
                    style={{
                      background: message.sender === 'user' ? '#25D366' : 'white',
                      color: message.sender === 'user' ? 'white' : '#374151',
                      border: message.sender === 'ana' ? '1px solid #e5e7eb' : 'none',
                    }}
                  >
                    {message.sender === 'ana' && (
                      <p className="text-xs font-semibold mb-1" style={{ color: '#25D366' }}>Ana</p>
                    )}
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
              
              {/* Botões de opção - exibidos apenas no turno de opções */}
              {chatTurn === 'options' && messages.length >= 1 && messages[messages.length - 1]?.isOptions && (
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={handleOptionDuvidas}
                    className="w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all hover:brightness-110 hover:scale-[1.02] flex items-center justify-center gap-2"
                    style={{ background: '#25D366', color: 'white' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    Quero apenas tirar dúvidas
                  </button>
                  <button
                    onClick={handleOptionConsultor}
                    className="w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all hover:brightness-110 hover:scale-[1.02] flex items-center justify-center gap-2"
                    style={{ background: 'white', color: '#25D366', border: '2px solid #25D366' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    Gostaria de falar com um consultor
                  </button>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Campo de entrada */}
            <div className="p-3 border-t" style={{ background: 'white', borderColor: '#e5e7eb' }}>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-4 py-2.5 rounded-full border text-sm text-gray-800 focus:outline-none"
                  style={{ borderColor: '#e5e7eb' }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:brightness-110 disabled:opacity-50"
                  style={{ background: '#25D366' }}
                >
                  <Send size={18} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {bubbleVisible && !isOpen && (
        <div className="fixed bottom-24 right-6 z-50" ref={bubbleContainerRef}>
          <div
            className="bg-white rounded-2xl px-4 py-2.5 shadow-lg relative max-w-[280px] transition-transform duration-200"
            style={{ border: '1px solid #e5e7eb', animation: bubbleShown ? 'bubbleFadeIn 0.4s ease-out both' : 'none' }}
          >
            <style>{`
              @keyframes bubbleFadeIn {
                from { opacity: 0; transform: translateY(8px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            <p className="text-sm text-gray-700 font-medium">{BUBBLE_MESSAGES[bubbleIndex]}</p>
            <div
              className="absolute -bottom-1.5 right-6 w-3 h-3 rotate-45"
              style={{
                background: 'white',
                borderRight: '1px solid #e5e7eb',
                borderBottom: '1px solid #e5e7eb',
              }}
            />
          </div>
        </div>
      )}

      <button
        onClick={() => (isOpen ? handleClose() : handleOpen())}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110"
        style={{ background: '#25D366' }}
        aria-label={isOpen ? 'Fechar' : 'Falar com um Consultor(a)'}
      >
        {isOpen ? <X size={26} className="text-white" /> : <Headset size={26} className="text-white" />}
      </button>
    </>
  );
}
