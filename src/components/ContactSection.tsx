import { useState } from 'react';
import { Handshake } from 'lucide-react';
import { attendantConfig, trackWhatsAppClick } from '../config/attendant';
import { formatCelular } from '../utils/phone';

export default function ContactSection() {
  const [form, setForm] = useState({ nome: '', celular: '', email: '', cnpj: '' });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === 'celular' ? formatCelular(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, origem: 'home_form', interesse: 'geral' }),
      });
      if (res.ok) {
        setEnviado(true);
        setForm({ nome: '', celular: '', email: '', cnpj: '' });
      }
    } catch {
      // silencioso
    }
  };

  if (enviado) {
    return (
      <section className="relative py-14 sm:py-20 px-4 sm:px-6 overflow-hidden" style={{ background: 'transparent' }}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#22c55e' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Dados enviados com Sucesso!</h3>
            <p className="text-gray-500 text-sm">Em breve entraremos em contato contigo!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Form Section */}
      <section
        className="relative py-14 sm:py-20 px-4 sm:px-6 overflow-hidden"
        style={{ background: 'transparent' }}
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 sm:gap-12">
          {/* Left copy */}
          <div className="flex-1 text-left reveal">
            <h2 className="font-extrabold leading-tight mb-4" style={{ fontSize: 'clamp(1.7rem, 4vw, 2.8rem)', color: 'white' }}>
              Assine nosso{' '}
              <span style={{ color: '#e8b800' }}>formulário.</span>
            </h2>
            <p className="text-white/65 text-sm leading-relaxed max-w-xs">
              Dê o primeiro passo para organizar sua gestão com uma contabilidade mais próxima, inteligente e estratégica.
            </p>
          </div>

          {/* Form card */}
          <div className="w-full md:w-auto md:min-w-[360px] bg-white rounded-2xl p-8 sm:p-12 shadow-xl reveal" style={{ '--reveal-delay': '100ms' } as React.CSSProperties}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nome*</label>
                <input
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="João Silva"
                  className="w-full px-4 py-3.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#0c0ccc' } as React.CSSProperties}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Celular*</label>
                <div className="flex gap-2">
                  <select className="px-3 py-3.5 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none">
                    <option>+55</option>
                  </select>
                  <input
                    name="celular"
                    type="tel"
                    inputMode="numeric"
                    value={form.celular}
                    onChange={handleChange}
                    placeholder="(11)91234-5678"
                    className="flex-1 px-4 py-3.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">E-mail*</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="joao.silva@gmail.com"
                  className="w-full px-4 py-3.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">CNPJ*</label>
                <input
                  name="cnpj"
                  value={form.cnpj}
                  onChange={handleChange}
                  placeholder="00.000.000/0001-00"
                  className="w-full px-4 py-3.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none"
                />
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
                className="w-full py-4 rounded-lg text-white text-sm font-bold transition-all hover:brightness-110 mt-2"
                style={{ background: '#22c55e' }}
              >
                Iniciar Atendimento
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <div className="py-5 px-4 sm:px-6" style={{ background: 'linear-gradient(160deg, rgb(38, 69, 217) 0%, rgb(61, 95, 230) 50%, rgb(30, 53, 179) 100%)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between">
          <div className="flex items-start sm:items-center gap-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#e8b800' }}
            >
              <Handshake size={20} color="#000" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-snug">
                Pronto para <span style={{ color: '#e8b800' }}>transformar</span> a gestão da sua empresa?
              </p>
              <p className="text-white/60 text-xs leading-relaxed max-w-sm">
                Conte com uma contabilidade inteligente, estratégica e próxima para apoiar suas decisões, organizar seus números e impulsionar o crescimento do seu negócio.
              </p>
            </div>
          </div>
          <a
            href={attendantConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('home_cta')}
            className="w-full sm:w-auto flex-shrink-0 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:brightness-110 hover:scale-105 text-center"
            style={{ background: '#e8b800', color: '#000' }}
          >
            Iniciar Atendimento
          </a>
        </div>
      </div>
    </>
  );
}