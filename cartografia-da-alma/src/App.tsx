import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoulMap } from './hooks/useSoulMap';
import { CosmosBackground } from './geometry/CosmosBackground';
import { Entry } from './screens/Entry';
import { PalmEntry } from './screens/PalmEntry';
import { Loading } from './screens/Loading';
import { Revelation } from './screens/Revelation';
import { SoulMateRevelation } from './screens/SoulMateRevelation';
import { Landing } from './screens/Landing';
import { Journey } from './screens/Journey';
import { MapaFinal } from './screens/MapaFinal';
import { NotFound } from './screens/NotFound';
import { About } from './screens/About';

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
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over); }
  }, []);
  return <div ref={curRef} className="cursor" />;
}

function Gateway({ onBirth, onPalm }: { onBirth: () => void; onPalm: () => void }) {
  return (
    <motion.div
      key="gateway"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ padding: '40px 24px', position: 'relative' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        style={{ textAlign: 'center', maxWidth: '560px' }}
      >
        <p style={{ fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200, letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '24px' }}>
          uma cartografia pessoal
        </p>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(48px, 7vw, 88px)', fontWeight: 300, lineHeight: 1, letterSpacing: '0.02em', color: 'var(--white)', marginBottom: '48px' }}>
          Cartografia<br /><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>da Alma</em>
        </h1>
        <p style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 300, fontStyle: 'italic', color: 'var(--white-dim)', lineHeight: 1.7, marginBottom: '56px' }}>
          Seis tradições. Um mapa. O padrão que já opera em você, com ou sem nome.
        </p>
        <motion.button
          onClick={onBirth}
          whileHover={{ letterSpacing: '0.42em' }}
          style={{
            background: 'transparent', border: 'none', borderBottom: '1px solid var(--gold)',
            fontFamily: 'var(--sans)', fontSize: '11px', fontWeight: 300,
            letterSpacing: '0.35em', color: 'var(--gold)', textTransform: 'uppercase',
            padding: '0 0 8px', transition: 'letter-spacing 0.3s', display: 'block', margin: '0 auto 32px',
          }}
        >
          iniciar cartografia →
        </motion.button>
        <button
          onClick={onPalm}
          style={{
            background: 'transparent', border: 'none',
            fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
            letterSpacing: '0.3em', color: 'var(--white-dim)', textTransform: 'uppercase',
            padding: 0, transition: 'color 0.3s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--white-dim)')}
        >
          ou via leitura de palma
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const {
    screen, soulMap, viewerMap, soulMateReading, soulMateShareUrl,
    readingId, shareUrl, isSharing, isSaving, shareError, shareCopied, canShare, tier,
    generate, generateFromPalm, share, submitEmail,
    meetAnotherSoul, meetFromViewer, saveOracleAnswer,
    goToGateway, goToEntry, goToPalmEntry, goToMapaFinal, reset,
    goToAbout,
  } = useSoulMap();

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: '#07070f' }}>
      <Cursor />
      <CosmosBackground />
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {screen === 'landing'    && <Landing key="landing" onEnter={goToGateway} onAbout={goToAbout} />}
          {screen === 'gateway'    && <Gateway key="gateway" onBirth={goToEntry} onPalm={goToPalmEntry} />}
          {screen === 'entry'      && <Entry key="entry" onSubmit={generate} onBack={reset} />}
          {screen === 'palmEntry'  && <PalmEntry key="palmEntry" onSubmit={generateFromPalm} onBack={reset} />}
          {screen === 'loading'    && <Loading key="loading" soulMap={soulMap} />}
          {screen === 'journey'    && soulMap && (
            <Journey key="journey" soulMap={soulMap} onComplete={goToMapaFinal} onOracleAnswer={saveOracleAnswer} tier={tier} readingId={readingId} onEmailSubmit={submitEmail} />
          )}
          {screen === 'mapaFinal'  && soulMap && (
            <MapaFinal
              key="mapaFinal"
              soulMap={soulMap}
              onShare={share}
              onMeet={meetAnotherSoul}
              onReset={reset}
              shareUrl={shareUrl}
              isSharing={isSharing}
              shareError={shareError}
              shareCopied={shareCopied}
              tier={tier}
              readingId={readingId}
            />
          )}
          {screen === 'viewer'     && viewerMap && (
            <MapaFinal
              key="viewer"
              soulMap={viewerMap}
              onShare={() => {}}
              onMeet={() => meetFromViewer()}
              onReset={reset}
            />
          )}
          {screen === 'revelation' && soulMap && (
            <Revelation
              key="revelation"
              soulMap={soulMap}
              onReset={reset}
              canShare={canShare}
              shareUrl={shareUrl}
              isSharing={isSharing}
              isSaving={isSaving}
              tier={tier}
              readingId={readingId}
              onShare={share}
              onMeet={meetAnotherSoul}
              onEmailSubmit={submitEmail}
              onTierUpgrade={() => {}}
            />
          )}
          {screen === 'meetLoading' && <Loading key="meetLoading" />}
          {screen === 'soulMate'    && soulMateReading && (
            <SoulMateRevelation
              key="soulMate"
              reading={soulMateReading}
              shareUrl={soulMateShareUrl}
              onReset={reset}
            />
          )}
          {screen === 'notFound' && <NotFound key="notFound" onHome={reset} />}
          {screen === 'about'    && <About key="about" onBack={reset} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
