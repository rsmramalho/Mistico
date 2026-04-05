import { useState } from 'react';
import { motion } from 'framer-motion';
import type { SoulMateReading, Element } from '../types/soul-map';
import { PsycheBar } from '../components/PsycheBar';

// ═══════════════════════════════════════
// Soul Mate Revelation — V2
// Score + matches/tensions + visual comparison
// ═══════════════════════════════════════

interface SoulMateRevelationProps {
  reading: SoulMateReading;
  onReset: () => void;
  shareUrl?: string | null;
}

const ELEMENT_PT: Record<Element, string> = {
  fire: 'Fogo', earth: 'Terra', air: 'Ar', water: 'Água',
};

const SIGN_PT: Record<string, string> = {
  Aries: 'Áries', Taurus: 'Touro', Gemini: 'Gêmeos', Cancer: 'Câncer',
  Leo: 'Leão', Virgo: 'Virgem', Libra: 'Libra', Scorpio: 'Escorpião',
  Sagittarius: 'Sagitário', Capricorn: 'Capricórnio', Aquarius: 'Aquário', Pisces: 'Peixes',
};

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay },
});

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
  letterSpacing: '0.38em', color: 'var(--gold)', textTransform: 'uppercase',
  margin: 0,
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--sans)', fontSize: '8px', fontWeight: 200,
  letterSpacing: '0.35em', color: 'var(--gold)', textTransform: 'uppercase',
  margin: '0 0 16px',
};

const bodyStyle: React.CSSProperties = {
  fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 300,
  color: 'var(--white-dim)', lineHeight: 1.7, margin: 0,
};

const goldLine: React.CSSProperties = {
  width: '100%', height: '1px',
  background: 'var(--gold-line)', margin: '32px 0',
};

const btnStyle: React.CSSProperties = {
  background: 'transparent', border: 'none',
  borderBottom: '1px solid var(--gold)',
  fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 300,
  letterSpacing: '0.32em', color: 'var(--gold)',
  textTransform: 'uppercase', padding: '0 0 6px',
  transition: 'color 0.3s, letter-spacing 0.3s',
};

const hover = (e: React.MouseEvent, enter: boolean) => {
  const el = e.currentTarget as HTMLElement;
  el.style.color = enter ? 'var(--white)' : 'var(--gold)';
  el.style.letterSpacing = enter ? '0.42em' : '0.32em';
};

// ── Animated score counter ──

function ScoreCounter({ target, delay }: { target: number; delay: number }) {
  const [count, setCount] = useState(0);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      onAnimationComplete={() => {
        let current = 0;
        const step = Math.max(1, Math.floor(target / 40));
        const interval = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          setCount(current);
        }, 30);
      }}
      style={{
        fontFamily: 'var(--serif)',
        fontSize: 'clamp(64px, 12vw, 96px)',
        fontWeight: 300,
        color: 'var(--gold)',
        lineHeight: 1,
      }}
    >
      {count}%
    </motion.span>
  );
}

// ── Mini map cell ──

function MiniMapCell({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <p style={{ ...labelStyle, fontSize: '7px', marginBottom: '4px' }}>{label}</p>
      <p style={{ fontFamily: 'var(--serif)', fontSize: '15px', fontWeight: 300, color: 'var(--white)', margin: 0, lineHeight: 1.3 }}>
        {value}
      </p>
      {sub && (
        <p style={{ fontFamily: 'var(--sans)', fontSize: '8px', fontWeight: 200, color: 'var(--white-ghost)', margin: '2px 0 0' }}>
          {sub}
        </p>
      )}
    </div>
  );
}

// ── Match/Tension card ──

function ResonanceCard({ text, type }: { text: string; type: 'match' | 'tension' }) {
  const [expanded, setExpanded] = useState(false);
  const color = type === 'match' ? 'var(--gold)' : 'rgba(201,140,76,0.7)';

  return (
    <button
      type="button"
      onClick={() => setExpanded(prev => !prev)}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        background: 'transparent',
        border: 'none',
        borderLeft: `2px solid ${color}`,
        padding: '8px 0 8px 14px',
        marginBottom: '8px',
        transition: 'border-color 0.3s',
      }}
    >
      <p style={{
        fontFamily: 'var(--serif)',
        fontSize: '14px',
        fontWeight: 300,
        color: expanded ? 'var(--white)' : 'var(--white-dim)',
        lineHeight: 1.5,
        margin: 0,
        transition: 'color 0.3s',
      }}>
        {text}
      </p>
    </button>
  );
}

// ══════════════════════════════════════════

export function SoulMateRevelation({ reading, onReset, shareUrl }: SoulMateRevelationProps) {
  const { readingA, readingB, elementDynamic, mirror, tikkun, frequencyHarmony, combinedPsyche, meetingNumber, compatibility } = reading;
  const [copied, setCopied] = useState(false);
  const nameA = readingA.birthData.name.split(' ')[0];
  const nameB = readingB.birthData.name.split(' ')[0];

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ minHeight: '100vh', padding: '80px 24px 64px', position: 'relative' }}
    >
      {/* Background atmosphere */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse at 30% 30%, rgba(201,76,76,0.03) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(76,139,201,0.03) 0%, transparent 50%)',
      }} />

      <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── Header: names + score ── */}
        <motion.div {...fade(0.2)} style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ ...labelStyle, marginBottom: '18px' }}>soul mate</p>
          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(32px, 5vw, 54px)',
            fontWeight: 300, lineHeight: 1.05, color: 'var(--white)', marginBottom: '20px',
          }}>
            {nameA} &#10022; {nameB}
          </h1>

          {/* Animated score */}
          <div style={{ margin: '24px 0' }}>
            <ScoreCounter target={compatibility.score} delay={0.8} />
          </div>
          <p style={{
            fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
            letterSpacing: '0.3em', color: 'var(--white-ghost)', textTransform: 'uppercase',
          }}>
            ressonância
          </p>
        </motion.div>

        {/* ── Mini maps side by side ── */}
        <motion.div {...fade(1.2)} style={{ marginBottom: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Map A */}
            <div style={{ borderRight: '1px solid var(--gold-line)', paddingRight: '20px' }}>
              <p style={{ ...labelStyle, marginBottom: '14px' }}>{nameA}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <MiniMapCell label="signo" value={SIGN_PT[readingA.sunSign] ?? readingA.sunSign} sub={ELEMENT_PT[readingA.element]} />
                <MiniMapCell label="sephirah" value={readingA.sephirah.name} sub={readingA.sephirah.planet} />
                <MiniMapCell label="arquétipo" value={readingA.archetype.titlePt} />
                <MiniMapCell label="frequência" value={`${readingA.frequency.hz} Hz`} />
                <MiniMapCell label="número" value={`${readingA.numerology.number}`} sub={readingA.numerology.namePt} />
              </div>
            </div>
            {/* Map B */}
            <div style={{ paddingLeft: '4px' }}>
              <p style={{ ...labelStyle, marginBottom: '14px' }}>{nameB}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <MiniMapCell label="signo" value={SIGN_PT[readingB.sunSign] ?? readingB.sunSign} sub={ELEMENT_PT[readingB.element]} />
                <MiniMapCell label="sephirah" value={readingB.sephirah.name} sub={readingB.sephirah.planet} />
                <MiniMapCell label="arquétipo" value={readingB.archetype.titlePt} />
                <MiniMapCell label="frequência" value={`${readingB.frequency.hz} Hz`} />
                <MiniMapCell label="número" value={`${readingB.numerology.number}`} sub={readingB.numerology.namePt} />
              </div>
            </div>
          </div>
        </motion.div>

        <div style={goldLine} />

        {/* ── O que ressoa ── */}
        {compatibility.matches.length > 0 && (
          <motion.div {...fade(1.6)} style={{ marginBottom: '32px' }}>
            <p style={sectionTitleStyle}>o que ressoa</p>
            {compatibility.matches.map((m, i) => (
              <ResonanceCard key={i} text={m} type="match" />
            ))}
          </motion.div>
        )}

        {/* ── O que tensiona ── */}
        {compatibility.tensions.length > 0 && (
          <motion.div {...fade(1.9)} style={{ marginBottom: '32px' }}>
            <p style={sectionTitleStyle}>o que tensiona</p>
            {compatibility.tensions.map((t, i) => (
              <ResonanceCard key={i} text={t} type="tension" />
            ))}
          </motion.div>
        )}

        <div style={goldLine} />

        {/* ── Element Dynamic ── */}
        <motion.div {...fade(2.2)} style={{ marginBottom: '32px' }}>
          <p style={sectionTitleStyle}>{elementDynamic.name} — {elementDynamic.nature}</p>
          <p style={bodyStyle}>{elementDynamic.description}</p>
        </motion.div>

        {/* ── The Mirror ── */}
        <motion.div {...fade(2.5)} style={{ marginBottom: '32px' }}>
          <p style={sectionTitleStyle}>o espelho — projeção arquetípica</p>
          <div style={{ paddingLeft: '12px', borderLeft: '1px solid var(--gold-line)', marginBottom: '16px' }}>
            <p style={{ ...labelStyle, fontSize: '7px', marginBottom: '6px' }}>{nameA} → {nameB}</p>
            <p style={{ ...bodyStyle, fontSize: '14px' }}>{mirror.projectionAtoB}</p>
          </div>
          <div style={{ paddingLeft: '12px', borderLeft: '1px solid var(--gold-line)', marginBottom: '16px' }}>
            <p style={{ ...labelStyle, fontSize: '7px', marginBottom: '6px' }}>{nameB} → {nameA}</p>
            <p style={{ ...bodyStyle, fontSize: '14px' }}>{mirror.projectionBtoA}</p>
          </div>
          <p style={{ ...bodyStyle, fontSize: '14px', fontStyle: 'italic', color: 'var(--gold)', opacity: 0.7 }}>
            {mirror.integration}
          </p>
        </motion.div>

        {/* ── Frequency Harmony ── */}
        <motion.div {...fade(2.8)} style={{ marginBottom: '32px' }}>
          <p style={sectionTitleStyle}>harmonia — solfeggio</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '12px' }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: '24px', fontWeight: 300, color: 'var(--gold)' }}>
              {frequencyHarmony.hzA} Hz
            </span>
            <span style={{ color: 'var(--white-ghost)', fontSize: '14px' }}>↔</span>
            <span style={{ fontFamily: 'var(--serif)', fontSize: '24px', fontWeight: 300, color: 'var(--gold)' }}>
              {frequencyHarmony.hzB} Hz
            </span>
          </div>
          <p style={{ ...labelStyle, textAlign: 'center', marginBottom: '10px' }}>{frequencyHarmony.interval}</p>
          <p style={{ ...bodyStyle, textAlign: 'center' }}>{frequencyHarmony.description}</p>
        </motion.div>

        {/* ── Tikkun ── */}
        <motion.div {...fade(3.0)} style={{ marginBottom: '32px' }}>
          <p style={sectionTitleStyle}>tikkun — árvore da vida</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 300, color: 'var(--gold)' }}>
              {tikkun.sephirahA}
            </span>
            <span style={{ ...labelStyle, fontSize: '8px', color: 'var(--white-ghost)' }}>
              — distância {tikkun.distance} —
            </span>
            <span style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 300, color: 'var(--gold)' }}>
              {tikkun.sephirahB}
            </span>
          </div>
          <p style={bodyStyle}>{tikkun.meaning}</p>
        </motion.div>

        {/* ── Psyche + Meeting Number ── */}
        <motion.div {...fade(3.2)} style={{ marginBottom: '32px' }}>
          <p style={sectionTitleStyle}>psique do encontro</p>
          <p style={{ ...bodyStyle, marginBottom: '20px' }}>{combinedPsyche.signature}</p>
          <PsycheBar psyche={combinedPsyche} delay={3.3} />
        </motion.div>

        <motion.div {...fade(3.4)} style={{ marginBottom: '32px' }}>
          <p style={sectionTitleStyle}>número do encontro — {meetingNumber.number} · {meetingNumber.namePt}</p>
          <p style={bodyStyle}>{meetingNumber.description}</p>
        </motion.div>

        <div style={goldLine} />

        {/* ── Summary ── */}
        <motion.div {...fade(3.6)} style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{
            fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 300,
            fontStyle: 'italic', color: 'var(--white-dim)', lineHeight: 1.7,
          }}>
            {compatibility.summary}
          </p>
          <p style={{
            fontFamily: 'var(--sans)', fontSize: '8px', fontWeight: 200,
            letterSpacing: '0.3em', color: 'var(--white-ghost)', textTransform: 'uppercase',
            marginTop: '16px',
          }}>
            ressonância não é garantia · tensão não é fracasso
          </p>
        </motion.div>

        {/* ── Actions ── */}
        <motion.div
          {...fade(3.8)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}
        >
          {shareUrl && (
            <button
              type="button"
              onClick={handleCopy}
              style={btnStyle}
              onMouseEnter={e => hover(e, true)}
              onMouseLeave={e => hover(e, false)}
            >
              {copied ? 'link copiado ✓' : 'compartilhar este encontro'}
            </button>
          )}
          <button
            type="button"
            onClick={onReset}
            style={btnStyle}
            onMouseEnter={e => hover(e, true)}
            onMouseLeave={e => hover(e, false)}
          >
            nova cartografia
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
