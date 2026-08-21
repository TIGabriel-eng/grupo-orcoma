import { useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { formatCelular } from '../utils/phone';
import { buildWhatsAppUrl } from '../config/attendant';

const BLUE = 'linear-gradient(160deg, #0c0ccc 0%, #1a1aff 50%, #0000b3 100%)';

interface FormErrors {
  nome?: string;
  celular?: string;
  email?: string;
  mensagem?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ContactForm() {
  const [form, setForm] = useState({ nome: '', celular: '', email: '', mensagem: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [enviado, setEnviado] = useState(false);
  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === 'celular' ? formatCelular(value) : value,
    }));
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!form.nome.trim()) {
      next.nome = 'Informe seu nome.';
    } else if (form.nome.trim().length < 2) {
      next.nome = 'Nome muito curto.';
    }
    const celularDigits = form.celular.replace(/\D/g, '');
    if (!form.celular.trim()) {
      next.celular = 'Informe seu celular.';
    } else if (celularDigits.length < 10 || celularDigits.length > 13) {
      next.celular = 'Informe um celular válido.';
    }
    if (!form.email.trim()) {
      next.email = 'Informe seu e-mail.';
    } else if (!EMAIL_RE.test(form.email.trim())) {
      next.email = 'Informe um e-mail válido.';
    }
    if (!form.mensagem.trim()) {
      next.mensagem = 'Escreva uma mensagem.';
    }
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const mensagem = [
      'Olá! Vim pelo site de vocês. Quero conversar com um consultor da Orcoma, por gentileza.',
      '',
      `Meu nome: ${form.nome.trim()}`,
      `Celular: ${form.celular.trim()}`,
      `E-mail: ${form.email.trim()}`,
      `Mensagem: ${form.mensagem.trim()}`,
    ].join('\n');

    window.open(buildWhatsAppUrl(mensagem), '_blank');

    const interesseParam = new URLSearchParams(window.location.search).get('interesse');
    const interessesValidos = [
      'abrir_empresa',
      'migracao_contabilidade',
      'migracao_mei_me',
      'declaracao_irpf',
      'geral',
    ];
    const interesse = interessesValidos.includes(interesseParam || '') ? interesseParam : 'geral';

    try {
      const res = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, origem: 'pagina_contato', interesse }),
      });
      if (res.ok) {
        setEnviado(true);
        setForm({ nome: '', celular: '', email: '', mensagem: '' });
      }
    } catch {
      // silencioso
    }
  };

  if (enviado) {
    return (
    <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-xl w-full md:w-[400px] flex-shrink-0 reveal">
        <div className="flex flex-col items-center text-center gap-3 py-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#22c55e' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Dados enviados com Sucesso!</h3>
          <p className="text-gray-500 text-sm">Em breve entraremos em contato contigo!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-xl w-full md:w-[400px] flex-shrink-0">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Nome*</label>
          <input
            name="nome"
            value={form.nome}
            onChange={set}
            placeholder="Seu nome completo"
            className="w-full px-4 py-2.5 rounded-lg border text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            style={{ borderColor: errors.nome ? '#ef4444' : '#e5e7eb' }}
          />
          {errors.nome && <p className="mt-1 text-xs text-red-500">{errors.nome}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">País + Celular*</label>
          <div className="flex gap-2">
            <select className="px-3 py-2.5 rounded-lg border text-sm text-gray-700 bg-white focus:outline-none" style={{ borderColor: errors.celular ? '#ef4444' : '#e5e7eb' }}>
              <option>BR +55</option>
              <option>US +1</option>
              <option>PT +351</option>
            </select>
            <input
              name="celular"
              type="tel"
              inputMode="numeric"
              value={form.celular}
              onChange={set}
              placeholder="(11)91234-5678"
              className="flex-1 px-4 py-2.5 rounded-lg border text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
              style={{ borderColor: errors.celular ? '#ef4444' : '#e5e7eb' }}
            />
          </div>
          {errors.celular && <p className="mt-1 text-xs text-red-500">{errors.celular}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">E-mail*</label>
          <input
            name="email"
            value={form.email}
            onChange={set}
            placeholder="seu@email.com.br"
            className="w-full px-4 py-2.5 rounded-lg border text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            style={{ borderColor: errors.email ? '#ef4444' : '#e5e7eb' }}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Como podemos te ajudar?*</label>
          <textarea
            name="mensagem"
            value={form.mensagem}
            onChange={set}
            placeholder="Como podemos ajudar?"
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg border text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600/30 resize-none"
            style={{ borderColor: errors.mensagem ? '#ef4444' : '#e5e7eb' }}
          />
          {errors.mensagem && <p className="mt-1 text-xs text-red-500">{errors.mensagem}</p>}
        </div>

        <input
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          style={{ display: 'none' }}
          aria-hidden="true"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-lg text-white text-sm font-bold transition-all hover:brightness-110 flex items-center justify-center gap-2"
          style={{ background: '#22c55e' }}
        >
          Iniciar Atendimento
          <span>→</span>
        </button>
      </form>
    </div>
  );
}

function CTABar() {
  return (
    <div className="py-5 px-4 sm:px-6" style={{ background: '#0000b3' }}>
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="flex items-start sm:items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: '#e8b800' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="m9 15 6-6" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-sm">Pronto para transformar?</p>
            <p className="text-white/60 text-xs">Fale com um de nossos especialistas agora.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <a
            href="https://wa.me/557399747460"
            className="flex items-center gap-2 px-5 py-2 rounded-full text-white text-xs font-bold transition-all hover:brightness-110"
            style={{ background: '#22c55e' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            WhatsApp
          </a>
          <a
            href="#"
            className="px-5 py-2 rounded-full text-xs font-bold transition-all hover:brightness-110"
            style={{ background: '#e8b800', color: '#000' }}
          >
            Saiba mais
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Blue hero */}
      <div className="relative overflow-hidden" style={{ background: BLUE }}>
        {/* fundo-hero.mp4 não existe em public/; o gradiente abaixo mantém o visual do hero */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(12,12,204,0.4) 0%, rgba(26,26,255,0.4) 50%, rgba(0,0,179,0.4) 100%)' }}></div>
        <div className="relative z-10">
          <Nav />

        <section className="px-4 sm:px-6 py-10 sm:py-16 pb-14 sm:pb-20">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start gap-8 sm:gap-12">
            {/* Left */}
            <div className="flex-1 pt-2 sm:pt-4">
              <h1 className="font-extrabold leading-tight mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
                <span className="text-white">Entre em </span>
                <span style={{ color: '#e8b800' }}>Contato.</span>
              </h1>
              <p className="text-white/65 text-sm leading-relaxed mb-6 sm:mb-8 max-w-xs">
                Estamos prontos para transformar a gestão da sua empresa com inteligência e estratégia contábil.
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#e8b800' }}
                  >
                    <Phone size={18} color="#000" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Telefone</p>
                    <a href="tel:+557399747460" className="text-white text-sm font-semibold hover:text-yellow-300 transition-colors">
                      (73) 9974-7460
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#e8b800' }}
                  >
                    <Mail size={18} color="#000" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">E-mail</p>
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=gilton.novaes@orcoma.com.br" target="_blank" rel="noopener noreferrer" className="text-white text-sm font-semibold hover:text-yellow-300 transition-colors break-all">
                      gilton.novaes@orcoma.com.br
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <ContactForm />
          </div>
        </section>
        </div>
      </div>

      <CTABar />
      <Footer />
    </div>
  );
}
