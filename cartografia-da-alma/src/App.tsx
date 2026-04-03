import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoulMap } from './hooks/useSoulMap';
import { CosmosBackground } from './geometry/CosmosBackground';
import { Entry } from './screens/Entry';
import { PalmEntry } from './screens/PalmEntry';
import { Loading } from './screens/Loading';
import { Revelation } from './screens/Revelation';
import { SoulMateRevelation } from './screens/SoulMateRevelation';

function Cursor() {
  const curRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!curRef.current) return;
      curRef.current.style.left = e.clientX + 'px';
      curRef.current.style.top  = e.clientY + 'px';
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      curRef.current?.classList.toggle('open', !!(t.closest('button') || t.closest('input')));
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over); };
  }, []);
  return <div ref={curRef} className="cursor" />;
}

function Gateway({ onBirth, onPalm }: { onBirth: () => void; onPalm: () => void }) {
  return (
    <motion.div
      key="gateway"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="min-h-screen flex flex-col items-center justify-center"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="text-center mb-16 md:mb-20"
      >
        <p style={{ fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200, letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '20px' }}>
          uma cartografia pessoal
        </p>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(42px, 6vw, 80px)', fontWeight: 300, lineHeight: 1, letterSpacing: '0.04em', color: 'var(--white)' }}>
          Cartografia<br /><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>da Alma</em>
        </h1>
      </motion.div>

      {/* Gate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="flex items-stretch w-full"
        style={{ maxWidth: 'min(860px, 90vw)', height: 'min(320px, 48vh)' }}
      >
        {/* Nascimento */}
        <Territory
          tag="via astros"
          title="Nascimento"
          desc="Data, hora e lugar. O momento em que você chegou revela a cartografia que carrega."
          symbol={<SunSymbol />}
          onClick={onBirth}
          align="right"
        />

        {/* Divider */}
        <div style={{ width: '1px', background: 'var(--gold-line)', flexShrink: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--gold)', boxShadow: '0 0 10px var(--gold)' }} />
        </div>

        {/* Palma */}
        <Territory
          tag="via palma"
          title="Mão"
          desc="As linhas que você carrega. Um mapa escrito antes de qualquer escolha."
          symbol={<HandSymbol />}
          onClick={onPalm}
          align="left"
        />
      </motion.div>
    </motion.div>
  );
}

function Territory({ tag, title, desc, symbol, onClick, align }: {
  tag: string; title: string; desc: string;
  symbol: React.ReactNode; onClick: () => void; align: 'left' | 'right';
}) {
  const padding = align === 'right' ? '0 56px 0 max(56px, 8vw)' : '0 max(56px, 8vw) 0 56px';
  return (
    <motion.button
      onClick={onClick}
      className="group"
      style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding, background: 'transparent', border: 'none', textAlign: 'left',
        position: 'relative', overflow: 'hidden',
      }}
      whileHover="hover"
    >
      <motion.div
        variants={{ hover: { opacity: 1 }, initial: { opacity: 0 } }}
        initial="initial"
        style={{ position: 'absolute', inset: 0, background: 'var(--gold-dim)', pointerEvents: 'none' }}
      />
      <motion.div
        variants={{ hover: { opacity: 0.9, scale: 1.04 }, initial: { opacity: 0.4, scale: 1 } }}
        initial="initial"
        style={{ marginBottom: '28px' }}
        transition={{ duration: 0.4 }}
      >
        {symbol}
      </motion.div>
      <p style={{ fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200, letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '14px' }}>
        {tag}
      </p>
      <p style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 3.2vw, 42px)', fontWeight: 300, color: 'var(--white)', lineHeight: 1.05, marginBottom: '14px' }}>
        {title}
      </p>
      <motion.p
        variants={{ hover: { opacity: 1, y: 0 }, initial: { opacity: 0, y: 8 } }}
        initial="initial"
        transition={{ duration: 0.4, delay: 0.05 }}
        style={{ fontFamily: 'var(--serif)', fontSize: '15px', fontWeight: 300, fontStyle: 'italic', color: 'var(--white-dim)', lineHeight: 1.6, maxWidth: '280px' }}
      >
        {desc}
      </motion.p>
      <motion.p
        variants={{ hover: { opacity: 1, y: 0 }, initial: { opacity: 0, y: 6 } }}
        initial="initial"
        transition={{ duration: 0.35, delay: 0.1 }}
        style={{ marginTop: '28px', fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase' }}
      >
        entrar →
      </motion.p>
    </motion.button>
  );
}

function SunSymbol() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <circle cx="17" cy="17" r="6.5" stroke="#c9a84c" strokeWidth="0.8" />
      <line x1="17" y1="2" x2="17" y2="7" stroke="#c9a84c" strokeWidth="0.8" />
      <line x1="17" y1="27" x2="17" y2="32" stroke="#c9a84c" strokeWidth="0.8" />
      <line x1="2" y1="17" x2="7" y2="17" stroke="#c9a84c" strokeWidth="0.8" />
      <line x1="27" y1="17" x2="32" y2="17" stroke="#c9a84c" strokeWidth="0.8" />
      <line x1="6.5" y1="6.5" x2="10" y2="10" stroke="#c9a84c" strokeWidth="0.8" opacity="0.5" />
      <line x1="24" y1="24" x2="27.5" y2="27.5" stroke="#c9a84c" strokeWidth="0.8" opacity="0.5" />
      <line x1="27.5" y1="6.5" x2="24" y2="10" stroke="#c9a84c" strokeWidth="0.8" opacity="0.5" />
      <line x1="10" y1="24" x2="6.5" y2="27.5" stroke="#c9a84c" strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}

function HandSymbol() {
  return (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <path d="M18 32 C10 32 5 26 5 19 L5 10 C5 8.3 6.3 7 8 7 C9.7 7 11 8.3 11 10 L11 8 C11 6.3 12.3 5 14 5 C15.7 5 17 6.3 17 8 L17 7 C17 5.3 18.3 4 20 4 C21.7 4 23 5.3 23 7 L23 8 C23 6.3 24.3 5 26 5 C27.7 5 29 6.3 29 8 L29 19 C29 26 24 32 18 32 Z" stroke="#c9a84c" strokeWidth="0.8" fill="none" />
      <path d="M11 18 Q14 22 18 22 Q22 22 25 18" stroke="#c9a84c" strokeWidth="0.7" fill="none" opacity="0.6" />
      <line x1="12" y1="14" x2="24" y2="14" stroke="#c9a84c" strokeWidth="0.7" opacity="0.4" />
    </svg>
  );
}

export default function App() {
  const { screen, soulMap, soulMateReading, shareUrl, isSharing, canShare, generate, generateFromPalm, share, meetAnotherSoul, goToEntry, goToPalmEntry, reset } = useSoulMap();

  return (
    <div className="relative min-h-screen bg-[#04040a] overflow-x-hidden">
      <Cursor />
      <CosmosBackground />
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {screen === 'gateway' && <Gateway key="gateway" onBirth={goToEntry} onPalm={goToPalmEntry} />}
          {screen === 'entry' && <Entry key="entry" onSubmit={generate} onBack={reset} />}
          {screen === 'palmEntry' && <PalmEntry key="palmEntry" onSubmit={generateFromPalm} onBack={reset} />}
          {screen === 'loading' && <Loading key="loading" soulMap={soulMap} />}
          {screen === 'revelation' && soulMap && (
            <Revelation key="revelation" soulMap={soulMap} onReset={reset} canShare={canShare} shareUrl={shareUrl} isSharing={isSharing} onShare={share} onMeet={meetAnotherSoul} />
          )}
          {screen === 'meetLoading' && <Loading key="meetLoading" />}
          {screen === 'soulMate' && soulMateReading && (
            <SoulMateRevelation key="soulMate" reading={soulMateReading} onReset={reset} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
