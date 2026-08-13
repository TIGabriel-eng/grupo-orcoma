export default function OrcomaLogo() {
  return (
    <div className="flex justify-center -mt-40 mb-2">
      <style>{`
        @keyframes orbit-pulse {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 0; }
          100% { transform: scale(1); opacity: 0.6; }
        }
        @keyframes orbit-pulse2 {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.25); opacity: 0; }
          100% { transform: scale(1); opacity: 0.5; }
        }
        @keyframes orbit-pulse3 {
          0% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.35); opacity: 0; }
          100% { transform: scale(1); opacity: 0.4; }
        }
        @keyframes orbit-pulse4 {
          0% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.45); opacity: 0; }
          100% { transform: scale(1); opacity: 0.35; }
        }
        @keyframes orbit-pulse5 {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1); opacity: 0.3; }
        }
        @keyframes orbit-pulse6 {
          0% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.55); opacity: 0; }
          100% { transform: scale(1); opacity: 0.25; }
        }
        @keyframes orbit-pulse7 {
          0% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1); opacity: 0.2; }
        }
        .orbit-ring1 { animation: orbit-pulse 2s ease-in-out infinite; }
        .orbit-ring2 { animation: orbit-pulse2 2.5s ease-in-out infinite 0.3s; }
        .orbit-ring3 { animation: orbit-pulse3 3s ease-in-out infinite 0.6s; }
        .orbit-ring4 { animation: orbit-pulse4 3.2s ease-in-out infinite 0.9s; }
        .orbit-ring5 { animation: orbit-pulse5 3.5s ease-in-out infinite 1.2s; }
        .orbit-ring6 { animation: orbit-pulse6 3.8s ease-in-out infinite 1.5s; }
        .orbit-ring7 { animation: orbit-pulse7 4s ease-in-out infinite 1.8s; }
        @keyframes icon-pulse {
          0% { transform: scale(1); filter: brightness(0) invert(1); }
          50% { transform: scale(1.05); filter: brightness(0) invert(1); }
          100% { transform: scale(1); filter: brightness(0) invert(1); }
        }
        .icon-pulse { animation: icon-pulse 2s ease-in-out infinite; }
      `}</style>
      <div className="relative" style={{ zIndex: 20 }}>
        <div className="absolute inset-0 rounded-full orbit-ring1" style={{ border: '2px solid rgba(255,255,255,0.5)' }} />
        <div className="absolute inset-0 rounded-full orbit-ring2" style={{ border: '2px solid rgba(255,255,255,0.4)' }} />
        <div className="absolute inset-0 rounded-full orbit-ring3" style={{ border: '2px solid rgba(255,255,255,0.35)' }} />
        <div className="absolute inset-0 rounded-full orbit-ring4" style={{ border: '2px solid rgba(255,255,255,0.3)' }} />
        <div className="absolute inset-0 rounded-full orbit-ring5" style={{ border: '2px solid rgba(255,255,255,0.25)' }} />
        <div className="absolute inset-0 rounded-full orbit-ring6" style={{ border: '2px solid rgba(255,255,255,0.2)' }} />
        <div className="absolute inset-0 rounded-full orbit-ring7" style={{ border: '2px solid rgba(255,255,255,0.15)' }} />
        <div className="w-52 h-52 rounded-full overflow-hidden relative" style={{ zIndex: 20 }}>
          <img src="/icon3.png" alt="Logo" className="w-full h-full object-cover icon-pulse" />
        </div>
      </div>
    </div>
  );
}