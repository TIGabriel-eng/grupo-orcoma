import { useState } from 'react';
import { User, Eye, EyeOff, ShieldCheck, Lock as LockIcon } from 'lucide-react';
import { useNav } from '../context/NavContext';
import PageNav from '../components/PageNav';
import Footer from '../components/Footer';
import WhatsAppToggle from '../components/WhatsAppToggle';

export default function LoginPage() {
  const { navigate } = useNav();
  const [cnpj, setCnpj] = useState('');
  const [senha, setSenha] = useState('');
  const [showPass, setShowPass] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: '#0a0acc',
        backgroundImage: `repeating-linear-gradient(
          135deg,
          transparent,
          transparent 18px,
          rgba(255,255,255,0.04) 18px,
          rgba(255,255,255,0.04) 19px
        )`,
      }}
    >
      {/* Decorative shapes — hidden on very small screens to avoid overflow */}
      <div className="hidden sm:block absolute top-20 left-12 w-32 h-32 rounded-full border-2 border-white/10 pointer-events-none" />
      <div className="hidden sm:block absolute top-32 left-20 w-16 h-16 rounded-full border border-white/8 pointer-events-none" />
      <div className="hidden sm:block absolute bottom-40 right-16 w-48 h-48 rounded-full border-2 border-white/10 pointer-events-none" />
      <div
        className="hidden sm:block absolute right-24 top-1/2 w-14 h-14 pointer-events-none"
        style={{
          background: 'rgba(255,255,255,0.08)',
          transform: 'translateY(-50%) rotate(45deg)',
          borderRadius: '4px',
        }}
      />

      {/* Nav */}
      <div className="relative z-40">
        <PageNav activePage="login" showConsultor={false} />
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 relative z-10 py-8">
        <div className="w-full max-w-sm">
          <p className="text-center text-white/60 text-sm leading-relaxed mb-8">
            Entre com suas credenciais para garantir<br />sua contabilidade
          </p>

          <div className="flex flex-col gap-4">
            {/* CNPJ / E-mail */}
            <div>
              <label className="block text-white/60 text-xs mb-1.5">CNPJ ou E-mail</label>
              <div
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <User size={16} className="text-white/40 flex-shrink-0" />
                <input
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  placeholder="00.000.000/0000-00"
                  className="flex-1 bg-transparent text-white placeholder-white/30 text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-white/60 text-xs mb-1.5">Senha</label>
              <div
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <LockIcon size={16} className="text-white/40 flex-shrink-0" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-white placeholder-white/30 text-sm focus:outline-none"
                />
                <button onClick={() => setShowPass(!showPass)} className="text-white/40 hover:text-white/70 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:brightness-110 hover:scale-[1.02] mt-2"
              style={{ background: '#e8b800', color: '#000' }}
            >
              Entrar no Portal →
            </button>
          </div>

          {/* Divider + link */}
          <div className="my-6 border-t border-white/10" />
          <p className="text-center">
            <button
              onClick={() => navigate('contato')}
              className="text-white/50 text-sm hover:text-white/80 transition-colors"
            >
              Novo por aqui?
            </button>
          </p>

          {/* Security badges */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mt-10">
            <div className="flex items-center gap-1.5 text-white/40">
              <ShieldCheck size={14} />
              <span className="text-xs">Ambiente Seguro</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-1.5 text-white/40">
              <LockIcon size={14} />
              <span className="text-xs">Dados Criptografados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      <WhatsAppToggle />
    </div>
  );
}
