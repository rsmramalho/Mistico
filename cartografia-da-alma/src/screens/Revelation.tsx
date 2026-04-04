// ═══════════════════════════════════════
// Cartografia da Alma — Revelation
// A carta é o produto. O mapa é a origem.
// ═══════════════════════════════════════

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SoulMap, Element } from '../types/soul-map';
import type { ReadingTier } from '../types/database';
import { CartaSection } from '../components/CartaSection';
import { OracleSection } from '../components/OracleSection';
import { RevealSection } from '../components/RevealSection';
import { PsycheBar } from '../components/PsycheBar';
import { FrequencyDisplay } from '../components/FrequencyDisplay';
import { FlowerOfLife } from '../geometry/FlowerOfLife';
import { Hexagram } from '../geometry/Hexagram';
import { Metatron } from '../geometry/Metatron';
import { SriYantra } from '../geometry/SriYantra';
import { TreeOfLife } from '../geometry/TreeOfLife';
import { computeBridges } from '../engine/bridges';
import { useInView } from '../hooks/useInView';
import { useAudio } from '../hooks/useAudio';

// ── Types ──

interface RevelationProps {
  soulMap: SoulMap;
  onReset: () => void;
  canShare?: boolean;
  shareUrl?: string | null;
  isSharing?: boolean;
  isSaving?: boolean;
  tier?: ReadingTier;
  readingId?: string | null;
  onShare?: () => void;
  onMeet?: (otherToken: string) => void;
  onEmailSubmit?: (email: string) => Promise<boolean>;
  onTierUpgrade?: (tier: ReadingTier) => void;
}

// ── Helpers ──

const ELEMENT_NAMES: Record<Element, string> = {
  fire: 'Fogo', earth: 'Terra', air: 'Ar', water: 'Água',
};

const SIGN_NAMES_PT: Record<string, string> = {
  Aries: 'Áries', Taurus: 'Touro', Gemini: 'Gêmeos', Cancer: 'Câncer',
  Leo: 'Leão', Virgo: 'Virgem', Libra: 'Libra', Scorpio: 'Escorpião',
  Sagittarius: 'Sagitário', Capricorn: 'Capricórnio', Aquarius: 'Aquário', Pisces: 'Peixes',
};

const LINE_NAMES_PT: Record<string, string> = {
  heart: 'Coração', head: 'Cabeça', life: 'Vida', fate: 'Destino',
};

function ElementGeometry({ element }: { element: Element }) {
  switch (element) {
    case 'air':   return <FlowerOfLife />;
    case 'fire':  return <Hexagram />;
    case 'earth': return <Metatron />;
    case 'water': return <SriYantra />;
  }
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
  letterSpacing: '0.38em', color: 'var(--gold)', textTransform: 'uppercase',
};

// ── Footer (share + meet + reset) ──

function Footer({
  canShare, shareUrl, isSharing, isSaving, onShare, onMeet, onReset, meetInput, setMeetInput,
}: {
  canShare?: boolean; shareUrl?: string | null; isSharing?: boolean; isSaving?: boolean;
  onShare?: () => void; onMeet?: (t: string) => void; onReset: () => void;
  meetInput: string; setMeetInput: (v: string) => void;
}) {
  const { ref, inView } = useInView(0.1);
  const btn: React.CSSProperties = {
    background: 'transparent', border: 'none', borderBottom: '1px solid var(--gold)',
    fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 300,
    letterSpacing: '0.32em', color: 'var(--gold)', textTransform: 'uppercase',
    padding: '0 0 6px', transition: 'color 0.3s, letter-spacing 0.3s',
  };
  const hover = (e: React.MouseEvent, enter: boolean) => {
    const el = e.currentTarget as HTMLElement;
    el.style.color = enter ? 'var(--white)' : 'var(--gold)';
    el.style.letterSpacing = enter ? '0.42em' : '0.32em';
  };
  const fieldStyle: React.CSSProperties = {
    flex: 1, width: '100%', background: 'transparent', border: 'none',
    borderBottom: '1px solid rgba(201,168,76,0.2)', color: 'var(--white)',
    fontFamily: 'var(--serif)', fontSize: '17px', fontWeight: 300,
    padding: '0 0 10px', outline: 'none', caretColor: 'var(--gold)', transition: 'border-color 0.4s',
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1 }}
      style={{ maxWidth: '640px', margin: '0 auto', padding: '0 24px 80px' }}
    >
      <p style={{
        fontFamily: 'var(--serif)', fontSize: '15px', fontWeight: 300,
        fontStyle: 'italic', color: 'var(--white-ghost)', lineHeight: 1.7,
        textAlign: 'center', marginBottom: '40px',
      }}>
        Os mapeamentos unem tradições — Astrologia, Kabbalah, Jung, Freud, Solfeggio e Numerologia —
        como espelhos, não verdades absolutas. A sombra é tão importante quanto a luz.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
        {canShare && onShare && (
          shareUrl ? (
            <button onClick={() => navigator.clipboard.writeText(shareUrl)} style={btn} onMouseEnter={e => hover(e, true)} onMouseLeave={e => hover(e, false)}>
              copiar link
            </button>
          ) : (
            <button
              onClick={onShare}
              disabled={isSharing || isSaving}
              style={{ ...btn, opacity: (isSharing || isSaving) ? 0.35 : 1 }}
              onMouseEnter={e => { if (!isSharing && !isSaving) hover(e, true); }}
              onMouseLeave={e => { if (!isSharing && !isSaving) hover(e, false); }}
            >
              {isSaving ? 'preparando...' : isSharing ? 'gerando...' : 'compartilhar'}
            </button>
          )
        )}
        <button onClick={onReset} style={btn} onMouseEnter={e => hover(e, true)} onMouseLeave={e => hover(e, false)}>
          nova cartografia
        </button>
      </div>

      {shareUrl && (
        <p style={{ fontFamily: 'var(--sans)', fontSize: '9px', color: 'var(--white-ghost)', marginTop: '16px', textAlign: 'center', wordBreak: 'break-all' }}>
          {shareUrl}
        </p>
      )}

      {onMeet && (
        <div style={{ borderTop: '1px solid var(--gold-line)', marginTop: '40px', paddingTop: '32px' }}>
          <p style={{ ...labelStyle, marginBottom: '20px', textAlign: 'center' }}>encontrar outra alma</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', maxWidth: '460px', margin: '0 auto' }}>
            <input
              type="text" value={meetInput} onChange={e => setMeetInput(e.target.value)}
              placeholder="cole o link de outro mapa" style={fieldStyle}
              onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
              onBlur={e => (e.target.style.borderBottomColor = 'rgba(201,168,76,0.2)')}
            />
            <button
              onClick={() => {
                if (!meetInput.trim()) return;
                let token = meetInput.trim();
                try { const url = new URL(token); const t = url.searchParams.get('token'); if (t) token = t; } catch { /* raw token */ }
                onMeet(token);
              }}
              style={{ ...btn, flexShrink: 0 }}
              onMouseEnter={e => hover(e, true)}
              onMouseLeave={e => hover(e, false)}
            >
              cruzar mapas →
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Map origin (expandable) ──

function MapaOrigem({ soulMap }: { soulMap: SoulMap }) {
  const [open, setOpen] = useState(false);
  const { sunSign, element, ascendant, sephirah, archetype, psyche, frequency, numerology } = soulMap;
  const bridges = computeBridges(soulMap);
  const isPalm = soulMap.source === 'palm';

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 24px' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'transparent', border: 'none',
          fontFamily: 'var(--sans)', fontSize: '8px', fontWeight: 200,
          letterSpacing: '0.38em', color: 'rgba(201,168,76,0.4)',
          textTransform: 'uppercase', padding: '0', transition: 'color 0.3s',
          display: 'block', margin: '0 auto 48px',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(201,168,76,0.4)')}
      >
        {open ? '— fechar origem do mapa' : '+ ver origem do mapa'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.6 }}
            style={{ overflow: 'hidden' }}
          >
            {/* Geometry */}
            <div style={{ position: 'relative', marginBottom: '96px', height: 'min(320px, 40vh)' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
                <TreeOfLife activeSephirah={sephirah.name} />
              </div>
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', inset: 0, opacity: 0.8 }}>
                <ElementGeometry element={element} />
              </motion.div>
            </div>

            {/* Astrologia */}
            <RevealSection title={`${SIGN_NAMES_PT[sunSign] ?? sunSign}`} subtitle={`${ELEMENT_NAMES[element]} · ${element}`}>
              <p style={{ marginBottom: '12px' }}>
                Signo solar em {SIGN_NAMES_PT[sunSign] ?? sunSign}, elemento {ELEMENT_NAMES[element].toLowerCase()}, modalidade {soulMap.modality === 'cardinal' ? 'cardinal' : soulMap.modality === 'fixed' ? 'fixo' : 'mutável'}.
              </p>
              {ascendant && (
                <p style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--white-ghost)' }}>
                  Ascendente em {SIGN_NAMES_PT[ascendant.sign]} — {ascendant.method === 'approximate' ? 'estimado por horário' : 'calculado'}
                </p>
              )}
              {isPalm && soulMap.dominantLine && (
                <p style={{ marginTop: '16px', color: 'var(--white-dim)' }}>
                  Linha dominante: {LINE_NAMES_PT[soulMap.dominantLine]}
                </p>
              )}
            </RevealSection>

            {/* Kabbalah */}
            <RevealSection title={sephirah.name} subtitle={`${sephirah.meaning} · ${sephirah.planet}`}>
              <p>{sephirah.description}</p>
              <p style={{ ...labelStyle, marginTop: '16px', fontSize: '8px', color: 'var(--white-ghost)' }}>
                Sephirah {sephirah.number} · expressão {sephirah.expression === 'diurnal' ? 'diurna' : sephirah.expression === 'nocturnal' ? 'noturna' : 'singular'}
              </p>
            </RevealSection>

            {/* Jung */}
            <RevealSection title={archetype.titlePt} subtitle={archetype.title}>
              <p style={{ marginBottom: '28px' }}>{archetype.description}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '36px' }}>
                <div>
                  <p style={{ ...labelStyle, marginBottom: '8px' }}>desejo central</p>
                  <p style={{ color: 'var(--white)' }}>{archetype.coreDesire}</p>
                </div>
                <div>
                  <p style={{ ...labelStyle, marginBottom: '8px' }}>medo central</p>
                  <p style={{ color: 'var(--white)' }}>{archetype.coreFear}</p>
                </div>
              </div>
              <p style={{ ...labelStyle, marginBottom: '20px', marginTop: '36px' }}>a sombra</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ borderLeft: '1px solid var(--gold-line)', paddingLeft: '16px' }}>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '8px', letterSpacing: '0.3em', color: '#c94c4c', textTransform: 'uppercase', marginBottom: '6px', opacity: 0.7 }}>inflada — excesso</p>
                  <p style={{ color: 'var(--white-dim)' }}>{archetype.shadow.inflated}</p>
                </div>
                <div style={{ borderLeft: '1px solid var(--gold-line)', paddingLeft: '16px' }}>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '8px', letterSpacing: '0.3em', color: '#4c8bc9', textTransform: 'uppercase', marginBottom: '6px', opacity: 0.7 }}>deflacionada — falta</p>
                  <p style={{ color: 'var(--white-dim)' }}>{archetype.shadow.deflated}</p>
                </div>
              </div>
            </RevealSection>

            {/* Solfeggio */}
            <RevealSection title="Frequência de Ressonância" subtitle="solfeggio">
              <FrequencyDisplay frequency={frequency} delay={0} />
            </RevealSection>

            {/* Numerologia */}
            <RevealSection title={numerology.namePt} subtitle={`número ${numerology.number}`}>
              <p style={{ marginBottom: '20px' }}>{numerology.description}</p>
              <p style={{ ...labelStyle, marginBottom: '8px' }}>traços</p>
              <p style={{ color: 'var(--white)', marginBottom: '20px' }}>{numerology.traits}</p>
              <p style={{ ...labelStyle, marginBottom: '8px' }}>sombra</p>
              <p style={{ color: 'var(--white-dim)' }}>{numerology.shadow}</p>
            </RevealSection>

            {/* Psique */}
            <RevealSection title="Estrutura Psíquica" subtitle="id · ego · superego">
              <p style={{ marginBottom: '28px' }}>{psyche.signature}</p>
              <PsycheBar psyche={psyche} delay={0} />
            </RevealSection>

            {/* Síntese */}
            <div style={{ margin: '0 0 96px', padding: '40px 0', borderTop: '1px solid var(--gold-line)', borderBottom: '1px solid var(--gold-line)' }}>
              <p style={{ fontFamily: 'var(--serif)', fontSize: '17px', fontWeight: 300, fontStyle: 'italic', color: 'var(--white-dim)', lineHeight: 1.7, textAlign: 'center' }}>
                {bridges.synthesis}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Revelation ──

export function Revelation({
  soulMap, onReset, canShare, shareUrl, isSharing, isSaving,
  tier = 'session', readingId, onShare, onMeet, onEmailSubmit, onTierUpgrade,
}: RevelationProps) {
  const [meetInput, setMeetInput] = useState('');
  const [showFloat, setShowFloat] = useState(false);
  const [cartaDone, setCartaDone] = useState(false);
  const { sunSign, element, sephirah } = soulMap;
  const audio = useAudio(soulMap.frequency.hz);

  useEffect(() => {
    const onScroll = () => { if (window.scrollY > window.innerHeight * 0.6) setShowFloat(true); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleShare = async () => {
    if (shareUrl) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: `Cartografia de ${soulMap.birthData.name}`,
            text: `${SIGN_NAMES_PT[sunSign] ?? sunSign} · ${sephirah.name} · ${soulMap.archetype.titlePt}`,
            url: shareUrl,
          });
          return;
        } catch { /* cancelled */ }
      }
      navigator.clipboard.writeText(shareUrl);
      return;
    }
    onShare?.();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }} style={{ minHeight: '100vh' }}>

      {/* ── Controls (audio) ── */}
      <div style={{ position: 'fixed', top: '24px', left: '24px', zIndex: 100 }}>
        <button
          onClick={audio.toggle}
          title={audio.playing ? `silêncio` : `${soulMap.frequency.hz} Hz`}
          style={{
            background: audio.playing ? 'rgba(201,168,76,0.12)' : 'rgba(4,4,10,0.8)',
            border: '1px solid var(--gold-line)',
            fontFamily: 'var(--sans)', fontSize: '8px', fontWeight: 200,
            letterSpacing: '0.3em', color: 'var(--gold)',
            textTransform: 'uppercase', padding: '8px 14px',
            backdropFilter: 'blur(12px)', transition: 'background 0.3s',
          }}
        >
          {audio.playing ? `♪ ${soulMap.frequency.hz}hz` : '♩'}
        </button>
      </div>

      {/* ── Floating share ── */}
      {canShare && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={showFloat ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.6 }}
          style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 100 }}
        >
          <button
            onClick={handleShare}
            disabled={isSaving || isSharing}
            style={{
              background: 'rgba(4,4,10,0.9)', border: '1px solid var(--gold-line)',
              fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
              letterSpacing: '0.35em', color: 'var(--gold)', textTransform: 'uppercase',
              padding: '12px 20px', backdropFilter: 'blur(12px)',
              opacity: (isSaving || isSharing) ? 0.45 : 1, transition: 'all 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--gold-line)')}
          >
            {shareUrl ? 'link copiado ✓' : isSaving ? 'preparando...' : isSharing ? 'gerando...' : 'compartilhar mapa'}
          </button>
        </motion.div>
      )}

      {/* ── First viewport: name + sign ── */}
      <div style={{
        minHeight: '100svh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', position: 'relative',
      }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
            style={{ width: 'min(600px, 95vw)', height: 'min(600px, 95vw)', opacity: 0.13 }}>
            <ElementGeometry element={element} />
          </motion.div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }}
            style={{ ...labelStyle, marginBottom: '28px' }}>
            cartografia da alma
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4, delay: 0.6 }}
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(52px, 9vw, 100px)',
              fontWeight: 300, lineHeight: 1, letterSpacing: '-0.01em',
              color: 'var(--white)', margin: '0 0 20px',
            }}
          >
            {soulMap.birthData.name}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}
            style={{ ...labelStyle, fontSize: '10px' }}>
            {SIGN_NAMES_PT[sunSign] ?? sunSign} · {sephirah.name} · {soulMap.archetype.titlePt}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2.5, delay: 2.5, repeat: Infinity }}
          style={{ position: 'absolute', bottom: '40px', width: '1px', height: '48px', background: 'linear-gradient(to bottom, transparent, var(--gold))' }}
        />
      </div>

      {/* ── A Carta ── */}
      <div style={{ paddingTop: '80px' }}>
        <CartaSection
          soulMap={soulMap}
          tier={tier}
          onEmailSubmit={onEmailSubmit}
          onComplete={() => setCartaDone(true)}
        />
      </div>

      {/* ── Oracle (appears after carta is done) ── */}
      <AnimatePresence>
        {cartaDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            style={{ maxWidth: '640px', margin: '0 auto', padding: '0 24px' }}
          >
            <OracleSection
              soulMap={soulMap}
              tier={tier}
              readingId={readingId}
              onTierUpgrade={onTierUpgrade}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mapa origem (expansível) ── */}
      {cartaDone && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
          <div style={{ width: '1px', height: '80px', background: 'linear-gradient(to bottom, transparent, var(--gold-line))', margin: '0 auto' }} />
          <MapaOrigem soulMap={soulMap} />
        </motion.div>
      )}

      {/* ── Footer ── */}
      {cartaDone && (
        <Footer
          canShare={canShare}
          shareUrl={shareUrl}
          isSharing={isSharing}
          isSaving={isSaving}
          onShare={onShare}
          onMeet={onMeet}
          onReset={onReset}
          meetInput={meetInput}
          setMeetInput={setMeetInput}
        />
      )}

    </motion.div>
  );
}
