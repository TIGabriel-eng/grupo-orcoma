import { useEffect, useRef, useState } from 'react';
import { Headset, User, X, Send } from 'lucide-react';
import { useWhatsApp } from '../context/WhatsAppContext';
import { servicos, trocaContador, listaServicos, todosItens, buscarConhecimento } from '../config/chatKnowledge';
import { apiUrl } from '../config/api';
import {
  attendantConfig,
  getAttendantStatus,
  findNearestUnit,
  buildWhatsAppUrl,
  isAttendantOnline,
  horarioAtendimento,
  trackWhatsAppClick,
} from '../config/attendant';

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

// options: botões iniciais · topico: escolha do assunto · faq: perguntas sobre o assunto escolhido
// coleta_*: pedido de nome, telefone e e-mail para a troca de contador
type ChatTurn =
  | 'options'
  | 'topico'
  | 'faq'
  | 'await_region'
  | 'region_resolved'
  | 'coleta_nome'
  | 'coleta_telefone'
  | 'coleta_email';

interface DadosLead {
  nome: string;
  celular: string;
  email: string;
}

const TOPICOS = [
  { key: 'servicos', label: 'Serviços prestados' },
  { key: 'troca', label: 'Troca de contador' },
  { key: 'outros', label: 'Outros assuntos' },
] as const;

type TopicoKey = (typeof TOPICOS)[number]['key'];

export default function WhatsAppModal() {
  const { isOpen, open, close } = useWhatsApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [bubbleShown, setBubbleShown] = useState(false);
  const [bubbleIndex, setBubbleIndex] = useState(0);
  const [status, setStatus] = useState(getAttendantStatus);
  const [chatTurn, setChatTurn] = useState<ChatTurn>('options');
  const [regionAttempts, setRegionAttempts] = useState(0);
  const [lead, setLead] = useState<DadosLead>({ nome: '', celular: '', email: '' });
  // Link do WhatsApp exibido como botão: o clique do usuário evita o bloqueio de pop-up
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);
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
      // Reinicia o fluxo: sem isso, reabrir depois de um encaminhamento deixava o chat sem botões
      setChatTurn('options');
      setRegionAttempts(0);
      setWhatsappLink(null);
      // Mostra mensagem de boas-vindas da Ana ao abrir
      const boasVindas: Message[] = [
        {
          id: Date.now(),
          text: 'Olá! Seja bem-vindo(a)! Eu me chamo Ana, sou a atendente virtual do grupo Orcoma Contabilidade. Como podemos te ajudar hoje?',
          sender: 'ana',
          timestamp: new Date(),
          isOptions: true,
        },
      ];
      if (!isAttendantOnline()) {
        boasVindas.push({
          id: Date.now() + 1,
          text: `No momento estamos fora do horário de atendimento (${horarioAtendimento}). Pode deixar sua mensagem que retornaremos no próximo horário.`,
          sender: 'ana',
          timestamp: new Date(),
        });
      }
      setMessages(boasVindas);
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

      // Não reconheceu a cidade: pede de novo uma vez antes de encaminhar ao consultor geral
      if (!foundUnit && regionAttempts < 1) {
        setRegionAttempts(1);
        setTimeout(() => {
          const anaMessage: Message = {
            id: Date.now() + 1,
            text: 'Não consegui identificar sua cidade. Pode digitar no formato "Cidade - UF"? Por exemplo: Jequié - BA',
            sender: 'ana',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, anaMessage]);
        }, 500);
        return;
      }

      const whatsappUrl = buildWhatsAppUrl(
        `Olá, gostaria de conversar com um consultor(a). Vim do site Orcoma e sou da região ${regionInput}.`
      );

      setTimeout(() => {
        let texto: string;
        if (!foundUnit) {
          texto = 'Não consegui identificar sua região. Vou te conectar com nosso consultor, que orienta sobre a melhor opção para você. Clique no botão abaixo para continuar no WhatsApp.';
        } else if (foundUnit.exata) {
          texto = `Perfeito! Temos atendentes em ${foundUnit.nome} - ${foundUnit.estado}. Clique no botão abaixo para continuar no WhatsApp.`;
        } else {
          texto = `Ainda não temos unidade física em "${regionInput}", mas atendemos à distância! A unidade mais próxima é ${foundUnit.nome} - ${foundUnit.estado}. Clique no botão abaixo para continuar no WhatsApp.`;
        }
        // Fora do horário, avisa que a resposta não é imediata (em vez de prometer retorno rápido)
        if (!isAttendantOnline()) {
          texto += ` Nossa equipe está fora do horário agora (${horarioAtendimento}), mas sua mensagem fica registrada no WhatsApp.`;
        }

        const anaMessage: Message = {
          id: Date.now() + 1,
          text: texto,
          sender: 'ana',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, anaMessage]);
        setChatTurn('region_resolved');
        setWhatsappLink(whatsappUrl);
      }, 500);
      return;
    }

    // Pergunta digitada "tirar dúvidas": abre o mesmo seletor de assuntos do botão
    if (chatTurn === 'options' && /tirar d[uú]vida/i.test(regionInput)) {
      iniciarDuvidas();
      return;
    }

    // Coleta de nome, telefone e e-mail da troca de contador
    if (chatTurn === 'coleta_nome' || chatTurn === 'coleta_telefone' || chatTurn === 'coleta_email') {
      handleColeta(regionInput);
      return;
    }

    // Dúvida livre dentro do fluxo de assuntos (sem palavra de consultor)
    if ((chatTurn === 'topico' || chatTurn === 'faq') && !/consultor|atendente/i.test(regionInput)) {
      handleDuvidaLivre(regionInput);
      return;
    }

    // Pedido de consultor digitado (ex.: "quero um consultor"): mesmo fluxo do botão
    if (/consultor|atendente/i.test(regionInput) && chatTurn !== 'region_resolved') {
      setChatTurn('await_region');
      setTimeout(() => {
        const anaMessage: Message = {
          id: Date.now() + 1,
          text: 'Perfeito! De qual cidade e estado você é? Assim conseguimos direcioná-lo para um especialista mais próximo da sua localidade.',
          sender: 'ana',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, anaMessage]);
      }, 500);
      return;
    }

    // Resposta padrão para outras mensagens
    setTimeout(() => {
      const anaResponses = isAttendantOnline()
        ? [
            'Obrigada pela mensagem! Um de nossos especialistas entrará em contato em breve.',
            'Entendido! Vou encaminhar sua mensagem para nossa equipe.',
            'Ótimo! Como posso te ajudar com isso?',
            'Certo! Estamos aqui para ajudar. Mais alguma dúvida?',
          ]
        : [
            `Obrigada pela mensagem! Nossa equipe está fora do horário (${horarioAtendimento}) e responderá no próximo horário de atendimento.`,
            'Entendido! Sua mensagem fica registrada e nossa equipe responde no próximo horário de atendimento.',
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

  const adicionarUsuario = (texto: string) => {
    setMessages((prev) => [...prev, { id: Date.now(), text: texto, sender: 'user', timestamp: new Date() }]);
  };

  // Resposta da Ana com pequeno atraso
  const responderAna = (texto: string) => {
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: texto, sender: 'ana', timestamp: new Date() }]);
    }, 500);
  };

  const iniciarDuvidas = () => {
    setChatTurn('topico');
    responderAna('Claro! Sobre qual assunto você quer tirar dúvidas?');
  };

  const handleOptionDuvidas = () => {
    adicionarUsuario('Quero apenas tirar dúvidas');
    iniciarDuvidas();
  };

  const handleTopico = (key: TopicoKey) => {
    setChatTurn('faq');
    if (key === 'servicos') {
      adicionarUsuario('Serviços prestados');
      responderAna(listaServicos.resposta);
    } else if (key === 'troca') {
      adicionarUsuario('Troca de contador');
      iniciarColeta();
    } else {
      adicionarUsuario('Outros assuntos');
      responderAna('Pode me dizer qual assunto você gostaria de tratar?');
    }
  };

  // Troca de contador: a Ana pede nome, telefone e e-mail, um por vez
  const iniciarColeta = () => {
    setLead({ nome: '', celular: '', email: '' });
    setChatTurn('coleta_nome');
    responderAna(
      'Perfeito! Preciso que você me informe:\n\nNome:\nTelefone p/ contato (com DDD):\nE-mail:\n\nAssim conseguimos encaminhar essas informações para os nossos consultores para seguir com o seu atendimento.',
    );
  };

  const handleColeta = (texto: string) => {
    if (chatTurn === 'coleta_nome') {
      if (texto.length < 2) {
        responderAna('Pode me informar seu nome completo?');
        return;
      }
      setLead((prev) => ({ ...prev, nome: texto }));
      setChatTurn('coleta_telefone');
      responderAna('Obrigado! Agora, qual é o telefone para contato, com DDD?');
      return;
    }

    if (chatTurn === 'coleta_telefone') {
      const digitos = texto.replace(/\D/g, '');
      if (digitos.length < 10 || digitos.length > 13) {
        responderAna('Não consegui validar esse número. Informe com DDD, por exemplo: (71) 99999-9999.');
        return;
      }
      setLead((prev) => ({ ...prev, celular: texto }));
      setChatTurn('coleta_email');
      responderAna('Por último, qual é o seu e-mail?');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto)) {
      responderAna('Esse e-mail não parece válido. Pode conferir? Exemplo: nome@empresa.com.br');
      return;
    }
    const dados = { ...lead, email: texto };
    setLead(dados);
    enviarLead(dados);
  };

  // Envia o pedido pelo mesmo endpoint de contato do site, para aparecer no painel de leads
  const enviarLead = async (dados: DadosLead) => {
    setChatTurn('faq');
    try {
      const res = await fetch(apiUrl('/api/contact/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dados,
          mensagem: 'Pedido de troca de contador (chat da Ana)',
          origem: 'whatsapp_modal',
          interesse: 'migracao_contabilidade',
        }),
      });
      if (res.ok) {
        responderAna(
          'Perfeito! Recebemos seus dados e vamos encaminhar para nossos consultores, que darão seguimento ao seu atendimento.',
        );
        return;
      }
      console.error('[WhatsAppModal] Erro ao enviar pedido de troca:', res.status);
    } catch (err) {
      console.error('[WhatsAppModal] Falha de rede ao enviar pedido de troca:', err);
    }
    responderAna(
      'Não conseguimos registrar seus dados agora. Você pode escrever "consultor" para falar com a equipe pelo WhatsApp.',
    );
  };

  // Pergunta livre dentro do fluxo de dúvidas: responde pela base ou admite que não sabe
  const handleDuvidaLivre = (pergunta: string) => {
    setChatTurn('faq');
    const encontrado = buscarConhecimento(pergunta, todosItens);

    // Troca de contador: começa a coleta de dados em vez de só explicar
    if (encontrado?.id === 'troca-contador') {
      iniciarColeta();
      return;
    }

    // Cidade ou estado citado (ex.: "Minas", "Jequié - BA"): indica a unidade mais próxima
    if (!encontrado || encontrado.id === 'unidades') {
      const unidade = findNearestUnit(pergunta);
      if (unidade) {
        responderAna(
          unidade.exata
            ? `Temos atendentes em ${unidade.nome} - ${unidade.estado}. Se quiser falar com a equipe, escreva "consultor".`
            : `Ainda não temos unidade física em "${pergunta}", mas atendemos à distância! A unidade mais próxima é ${unidade.nome} - ${unidade.estado}.`,
        );
        return;
      }
    }

    responderAna(
      encontrado
        ? encontrado.resposta
        : 'Sinto muito, não tenho essa informação. Posso direcionar seu atendimento para um humano: escreva "consultor" que um especialista te atende.',
    );
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
        text: 'Perfeito! De qual cidade e estado você é? Pois assim, conseguimos direcioná-lo para um especialista mais próximo da sua localidade.',
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
    setChatTurn('options');
    setRegionAttempts(0);
    setWhatsappLink(null);
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
                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                  {status === 'Online agora' && (
                    <span className="relative flex h-2 w-2" aria-hidden="true">
                      <span
                        className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                        style={{ background: '#25D366' }}
                      />
                      <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: '#25D366' }} />
                    </span>
                  )}
                  {status}
                </p>
              </div>
              <button onClick={() => handleClose()} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            {/* Área do Chat */}
            <style>{`
                .chat-scroll { scrollbar-width: thin; scrollbar-color: #25D366 #f9fafb; }
                .chat-scroll::-webkit-scrollbar { width: 8px; }
                .chat-scroll::-webkit-scrollbar-track { background: #f9fafb; }
                .chat-scroll::-webkit-scrollbar-thumb { background: #25D366; border-radius: 8px; }
                .chat-scroll::-webkit-scrollbar-thumb:hover { background: #1ebe5a; }
              `}</style>
            <div className="chat-scroll h-[300px] overflow-y-auto p-4 space-y-3" style={{ background: '#f9fafb' }}>
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
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                </div>
              ))}
              
              {/* Botões de opção - exibidos apenas no turno de opções */}
              {/* Link de WhatsApp: o clique é do usuário, então o navegador não bloqueia */}
              {whatsappLink && (
                <div className="flex justify-center pt-1">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick(`chat-ana:${window.location.pathname}`)}
                    className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-center transition-all hover:brightness-110 hover:scale-[1.02]"
                    style={{ background: '#25D366', color: 'white' }}
                  >
                    Abrir conversa no WhatsApp
                  </a>
                </div>
              )}

              {/* Seletor de assunto, exibido após "Quero apenas tirar dúvidas" */}
              {chatTurn === 'topico' && (
                <div className="flex flex-col gap-2 pt-2">
                  {TOPICOS.map((topico) => (
                    <button
                      key={topico.key}
                      onClick={() => handleTopico(topico.key)}
                      className="w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all hover:brightness-110 hover:scale-[1.02]"
                      style={{ background: 'white', color: '#25D366', border: '2px solid #25D366' }}
                    >
                      {topico.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Botões de opção - ficam disponíveis enquanto o fluxo estiver nas opções (sem beco sem saída) */}
              {chatTurn === 'options' && messages.length >= 1 && (
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
