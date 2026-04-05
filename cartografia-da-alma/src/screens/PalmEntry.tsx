import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PalmData, HandShape, MountName, LineName } from '../types/soul-map';

interface PalmEntryProps {
  onSubmit: (data: PalmData) => void;
  onBack: () => void;
}

// ── Hand Shape data ──

const handShapes: { id: HandShape; label: string; desc: string; palmW: number; palmH: number; fingerH: number }[] = [
  { id: 'fire',  label: 'Fogo',  desc: 'Palma retangular, dedos curtos', palmW: 50, palmH: 70, fingerH: 30 },
  { id: 'earth', label: 'Terra', desc: 'Palma quadrada, dedos curtos',    palmW: 60, palmH: 60, fingerH: 30 },
  { id: 'air',   label: 'Ar',    desc: 'Palma quadrada, dedos longos',    palmW: 60, palmH: 60, fingerH: 50 },
  { id: 'water', label: 'Água',  desc: 'Palma retangular, dedos longos',  palmW: 50, palmH: 70, fingerH: 50 },
];

// ── Line data ──

const lineOptions: { id: LineName; label: string; desc: string }[] = [
  { id: 'heart', label: 'Coração', desc: 'Vida emocional, afetos' },
  { id: 'head',  label: 'Cabeça',  desc: 'Intelecto, razão' },
  { id: 'life',  label: 'Vida',    desc: 'Vitalidade, caminho' },
  { id: 'fate',  label: 'Destino', desc: 'Propósito, direção' },
];

// ── Mount data ──

interface MountZone {
  id: MountName;
  label: string;
  cx: number;
  cy: number;
  r: number;
}

const mountZones: MountZone[] = [
  { id: 'jupiter', label: 'Júpiter',  cx: 105, cy: 110, r: 22 },
  { id: 'saturn',  label: 'Saturno',  cx: 148, cy: 90,  r: 22 },
  { id: 'apollo',  label: 'Apolo',    cx: 192, cy: 100, r: 22 },
  { id: 'mercury', label: 'Mercúrio', cx: 232, cy: 130, r: 20 },
  { id: 'venus',   label: 'Vênus',    cx: 85,  cy: 270, r: 30 },
  { id: 'mars',    label: 'Marte',    cx: 160, cy: 220, r: 26 },
  { id: 'moon',    label: 'Lua',      cx: 235, cy: 270, r: 26 },
];

// ── Animation helpers ──

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay },
});

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

// ── Shared styles ──

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--sans)',
  fontSize: '9px',
  fontWeight: 200,
  letterSpacing: '0.38em',
  color: 'var(--gold)',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: '14px',
};

const fieldStyle: React.CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(201,168,76,0.2)',
  color: 'var(--white)',
  fontFamily: 'var(--serif)',
  fontSize: '22px',
  fontWeight: 300,
  padding: '0 0 12px',
  outline: 'none',
  caretColor: 'var(--gold)',
  transition: 'border-color 0.4s',
};

// ── Palm shape icon SVG ──

function PalmIcon({ palmW, palmH, fingerH, selected }: { palmW: number; palmH: number; fingerH: number; selected: boolean }) {
  const stroke = selected ? 'var(--gold)' : 'rgba(201,168,76,0.4)';
  const w = 48;
  const h = 66;
  const scale = 0.6;
  const sW = palmW * scale;
  const sH = palmH * scale;
  const sFH = fingerH * scale;
  const px = (w - sW) / 2;
  const py = h - sH;
  const fw = 5;
  const gap = (sW - 4 * fw) / 5;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x={px} y={py} width={sW} height={sH} rx={4} stroke={stroke} strokeWidth={1} />
      {[0, 1, 2, 3].map((i) => {
        const fx = px + gap + i * (fw + gap);
        const fy = py - sFH;
        return <rect key={i} x={fx} y={fy} width={fw} height={sFH} rx={2} stroke={stroke} strokeWidth={1} />;
      })}
    </svg>
  );
}

// ── Hand diagram SVG for mount selection ──

function HandDiagram({ selected, onSelect }: { selected: MountName | null; onSelect: (m: MountName) => void }) {
  return (
    <svg
      viewBox="0 0 300 420"
      style={{ width: '100%', maxWidth: '280px', margin: '0 auto', display: 'block' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="
          M 60 370
          Q 40 330 42 280
          Q 40 240 55 200
          Q 58 180 55 150
          Q 50 120 30 80
          Q 25 60 40 50
          Q 55 42 62 58
          Q 72 80 78 110
          Q 80 125 82 140
          L 85 140
          Q 82 100 80 70
          Q 78 30 82 15
          Q 88 2 100 2
          Q 112 2 116 18
          Q 120 40 118 70
          Q 118 100 120 140
          L 125 140
          Q 128 90 132 55
          Q 136 20 140 8
          Q 146 -2 158 2
          Q 168 8 166 30
          Q 164 55 160 90
          Q 158 120 158 145
          L 163 145
          Q 170 105 178 75
          Q 184 55 192 48
          Q 200 42 210 50
          Q 218 60 214 80
          Q 208 105 198 140
          Q 192 170 195 145
          L 195 145
          Q 220 120 235 118
          Q 252 116 260 128
          Q 268 142 255 158
          Q 242 172 225 185
          Q 250 200 255 230
          Q 260 270 258 310
          Q 255 350 240 375
          Q 220 400 180 410
          Q 140 415 100 405
          Q 75 395 60 370
          Z
        "
        stroke="var(--gold)"
        strokeWidth={1}
        strokeLinejoin="round"
        fill="none"
      />

      {mountZones.map((m) => {
        const isSelected = selected === m.id;
        return (
          <g key={m.id} onClick={() => onSelect(m.id)} style={{ cursor: 'pointer' }}>
            <motion.circle
              cx={m.cx}
              cy={m.cy}
              r={m.r}
              fill={isSelected ? 'rgba(201,168,76,0.25)' : 'rgba(201,168,76,0.05)'}
              stroke={isSelected ? 'var(--gold)' : 'rgba(201,168,76,0.3)'}
              strokeWidth={isSelected ? 1.5 : 0.8}
              animate={isSelected ? { fill: ['rgba(201,168,76,0.25)', 'rgba(201,168,76,0.15)', 'rgba(201,168,76,0.25)'] } : {}}
              transition={isSelected ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
              style={{ transition: 'opacity 0.4s, fill 0.3s, stroke 0.3s' }}
            />
            <text
              x={m.cx}
              y={m.cy + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fill={isSelected ? 'var(--gold)' : 'rgba(201,168,76,0.55)'}
              fontSize={m.r < 24 ? 8 : 9}
              fontFamily="var(--serif)"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {m.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Progress bar (3 segments) ──

function StepProgress({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', gap: '6px', marginBottom: '48px' }}>
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          style={{
            flex: 1,
            height: '1px',
            background: s <= current ? 'var(--gold)' : 'rgba(201,168,76,0.15)',
            transition: 'background 0.5s',
          }}
        />
      ))}
    </div>
  );
}

// ── Main component ──

export function PalmEntry({ onSubmit, onBack }: PalmEntryProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [handShape, setHandShape] = useState<HandShape | null>(null);
  const [dominantMount, setDominantMount] = useState<MountName | null>(null);
  const [dominantLine, setDominantLine] = useState<LineName | null>(null);
  const [name, setName] = useState('');

  const goNext = () => { setDirection(1); setStep((s) => Math.min(s + 1, 3)); };
  const goPrev = () => {
    if (step === 1) { onBack(); return; }
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const canNext = (step === 1 && handShape !== null) ||
                  (step === 2 && dominantMount !== null);

  const canSubmit = dominantLine !== null && name.trim().length > 0;

  const handleSubmit = () => {
    if (!handShape || !dominantMount || !dominantLine || !name.trim()) return;
    onSubmit({ handShape, dominantMount, dominantLine, name: name.trim() });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex items-center justify-center px-6"
    >
      <div style={{ width: '100%', maxWidth: '520px' }}>

        {/* Header */}
        <motion.div {...fade(0.2)} style={{ marginBottom: '24px' }}>
          <p style={{
            fontFamily: 'var(--sans)',
            fontSize: '9px',
            fontWeight: 200,
            letterSpacing: '0.4em',
            color: 'var(--gold)',
            textTransform: 'uppercase' as const,
            marginBottom: '18px',
          }}>
            via palma
          </p>
          <h1 style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(36px, 5vw, 58px)',
            fontWeight: 300,
            lineHeight: 1.05,
            color: 'var(--white)',
          }}>
            Que mão <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>é essa?</em>
          </h1>
        </motion.div>

        {/* Step progress */}
        <motion.div {...fade(0.35)}>
          <StepProgress current={step} />
        </motion.div>

        {/* Step content */}
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: '380px' }}>
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <p style={{
                  fontFamily: 'var(--serif)',
                  fontSize: '20px',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: 'var(--white-dim)',
                  marginBottom: '32px',
                }}>
                  qual é a forma da sua mão?
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {handShapes.map((hs) => {
                    const sel = handShape === hs.id;
                    return (
                      <button
                        key={hs.id}
                        type="button"
                        onClick={() => setHandShape(hs.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          borderBottom: sel ? '1px solid var(--gold)' : '1px solid rgba(201,168,76,0.1)',
                          padding: '18px 0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '20px',
                          transition: 'border-color 0.4s',
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'left',
                        }}
                        onMouseEnter={e => {
                          if (!sel) (e.currentTarget as HTMLElement).style.borderBottomColor = 'rgba(201,168,76,0.35)';
                        }}
                        onMouseLeave={e => {
                          if (!sel) (e.currentTarget as HTMLElement).style.borderBottomColor = 'rgba(201,168,76,0.1)';
                        }}
                      >
                        <PalmIcon palmW={hs.palmW} palmH={hs.palmH} fingerH={hs.fingerH} selected={sel} />
                        <div>
                          <span style={{
                            fontFamily: 'var(--serif)',
                            fontSize: '20px',
                            fontWeight: 300,
                            color: sel ? 'var(--gold)' : 'var(--white-dim)',
                            transition: 'color 0.3s',
                            display: 'block',
                            marginBottom: '4px',
                          }}>
                            {hs.label}
                          </span>
                          <span style={{
                            fontFamily: 'var(--serif)',
                            fontSize: '14px',
                            fontWeight: 300,
                            color: 'rgba(232,228,218,0.25)',
                          }}>
                            {hs.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <p style={{
                  fontFamily: 'var(--serif)',
                  fontSize: '20px',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: 'var(--white-dim)',
                  marginBottom: '8px',
                }}>
                  qual monte é mais proeminente?
                </p>
                <p style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '9px',
                  fontWeight: 200,
                  letterSpacing: '0.38em',
                  color: 'rgba(232,228,218,0.25)',
                  textTransform: 'uppercase',
                  marginBottom: '24px',
                }}>
                  toque no monte mais elevado
                </p>

                <HandDiagram selected={dominantMount} onSelect={setDominantMount} />

                {dominantMount && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      textAlign: 'center',
                      fontFamily: 'var(--serif)',
                      fontSize: '16px',
                      fontWeight: 300,
                      fontStyle: 'italic',
                      color: 'var(--gold)',
                      marginTop: '16px',
                    }}
                  >
                    Monte de {mountZones.find((m) => m.id === dominantMount)?.label}
                  </motion.p>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <p style={{
                  fontFamily: 'var(--serif)',
                  fontSize: '20px',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: 'var(--white-dim)',
                  marginBottom: '32px',
                }}>
                  qual linha é mais marcada?
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '40px' }}>
                  {lineOptions.map((ln) => {
                    const sel = dominantLine === ln.id;
                    return (
                      <button
                        key={ln.id}
                        type="button"
                        onClick={() => setDominantLine(ln.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          borderBottom: sel ? '1px solid var(--gold)' : '1px solid rgba(201,168,76,0.1)',
                          padding: '16px 0',
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: '16px',
                          transition: 'border-color 0.4s',
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'left',
                        }}
                        onMouseEnter={e => {
                          if (!sel) (e.currentTarget as HTMLElement).style.borderBottomColor = 'rgba(201,168,76,0.35)';
                        }}
                        onMouseLeave={e => {
                          if (!sel) (e.currentTarget as HTMLElement).style.borderBottomColor = 'rgba(201,168,76,0.1)';
                        }}
                      >
                        <span style={{
                          fontFamily: 'var(--serif)',
                          fontSize: '20px',
                          fontWeight: 300,
                          color: sel ? 'var(--gold)' : 'var(--white-dim)',
                          transition: 'color 0.3s',
                        }}>
                          {ln.label}
                        </span>
                        <span style={{
                          fontFamily: 'var(--serif)',
                          fontSize: '14px',
                          fontWeight: 300,
                          color: 'rgba(232,228,218,0.2)',
                        }}>
                          {ln.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Name input */}
                <div>
                  <label style={labelStyle}>nome completo</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="como você veio ao mundo"
                    style={{ ...fieldStyle, fontSize: '26px' }}
                    onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
                    onBlur={e => (e.target.style.borderBottomColor = 'rgba(201,168,76,0.2)')}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <motion.div {...fade(0.9)} style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '32px' }}>
          {step < 3 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: `1px solid ${canNext ? 'var(--gold)' : 'rgba(201,168,76,0.2)'}`,
                fontFamily: 'var(--sans)',
                fontSize: '10px',
                fontWeight: 300,
                letterSpacing: '0.32em',
                color: canNext ? 'var(--gold)' : 'rgba(201,168,76,0.3)',
                textTransform: 'uppercase',
                padding: '0 0 6px',
                transition: 'color 0.3s, border-color 0.3s, letter-spacing 0.3s',
                cursor: canNext ? 'pointer' : 'default',
              }}
              onMouseEnter={e => { if (canNext) { (e.target as HTMLElement).style.color = 'var(--white)'; (e.target as HTMLElement).style.letterSpacing = '0.42em'; } }}
              onMouseLeave={e => { if (canNext) { (e.target as HTMLElement).style.color = 'var(--gold)'; (e.target as HTMLElement).style.letterSpacing = '0.32em'; } }}
            >
              próximo
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: `1px solid ${canSubmit ? 'var(--gold)' : 'rgba(201,168,76,0.2)'}`,
                fontFamily: 'var(--sans)',
                fontSize: '10px',
                fontWeight: 300,
                letterSpacing: '0.32em',
                color: canSubmit ? 'var(--gold)' : 'rgba(201,168,76,0.3)',
                textTransform: 'uppercase',
                padding: '0 0 6px',
                transition: 'color 0.3s, border-color 0.3s, letter-spacing 0.3s',
                cursor: canSubmit ? 'pointer' : 'default',
              }}
              onMouseEnter={e => { if (canSubmit) { (e.target as HTMLElement).style.color = 'var(--white)'; (e.target as HTMLElement).style.letterSpacing = '0.42em'; } }}
              onMouseLeave={e => { if (canSubmit) { (e.target as HTMLElement).style.color = 'var(--gold)'; (e.target as HTMLElement).style.letterSpacing = '0.32em'; } }}
            >
              revelar mapa
            </button>
          )}

          <button
            type="button"
            onClick={goPrev}
            style={{
              background: 'transparent',
              border: 'none',
              fontFamily: 'var(--sans)',
              fontSize: '9px',
              fontWeight: 200,
              letterSpacing: '0.25em',
              color: 'var(--white-ghost)',
              textTransform: 'uppercase',
              transition: 'color 0.3s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--white-dim)')}
            onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--white-ghost)')}
          >
            ← voltar
          </button>
        </motion.div>

        <motion.p
          {...fade(1.2)}
          style={{
            marginTop: '48px',
            fontFamily: 'var(--sans)',
            fontSize: '9px',
            fontWeight: 200,
            letterSpacing: '0.2em',
            color: 'var(--white-ghost)',
            textTransform: 'uppercase',
          }}
        >
          cartografia gerada por ia · leitura salva por 12 meses
        </motion.p>
      </div>
    </motion.div>
  );
}
