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

// ── Step animation variants ──

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

// ── Palm shape icon SVG ──

function PalmIcon({ palmW, palmH, fingerH, selected }: { palmW: number; palmH: number; fingerH: number; selected: boolean }) {
  const stroke = selected ? '#c9a84c' : '#c9a84c80';
  const w = 80;
  const h = 110;
  const px = (w - palmW) / 2;
  const py = h - palmH;
  const fw = 8;
  const gap = (palmW - 4 * fw) / 5;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Palm */}
      <rect x={px} y={py} width={palmW} height={palmH} rx={6} stroke={stroke} strokeWidth={1.5} />
      {/* Fingers */}
      {[0, 1, 2, 3].map((i) => {
        const fx = px + gap + i * (fw + gap);
        const fy = py - fingerH;
        return <rect key={i} x={fx} y={fy} width={fw} height={fingerH} rx={3} stroke={stroke} strokeWidth={1.5} />;
      })}
    </svg>
  );
}

// ── Hand diagram SVG for mount selection ──

function HandDiagram({ selected, onSelect }: { selected: MountName | null; onSelect: (m: MountName) => void }) {
  return (
    <svg
      viewBox="0 0 300 420"
      className="w-full max-w-[300px] mx-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hand outline — right hand, palm facing viewer */}
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
        stroke="#c9a84c"
        strokeWidth={1.5}
        strokeLinejoin="round"
        fill="none"
      />

      {/* Mount zones */}
      {mountZones.map((m) => {
        const isSelected = selected === m.id;
        return (
          <g key={m.id} onClick={() => onSelect(m.id)} className="cursor-pointer">
            <motion.circle
              cx={m.cx}
              cy={m.cy}
              r={m.r}
              fill={isSelected ? 'rgba(201,168,76,0.25)' : 'rgba(201,168,76,0.05)'}
              stroke={isSelected ? '#c9a84c' : '#c9a84c50'}
              strokeWidth={isSelected ? 1.5 : 1}
              animate={isSelected ? { fill: ['rgba(201,168,76,0.25)', 'rgba(201,168,76,0.15)', 'rgba(201,168,76,0.25)'] } : {}}
              transition={isSelected ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
              whileHover={{ fill: 'rgba(201,168,76,0.2)' }}
            />
            <text
              x={m.cx}
              y={m.cy + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fill={isSelected ? '#c9a84c' : '#c9a84c99'}
              fontSize={m.r < 24 ? 8 : 9}
              fontFamily="'Cormorant Garamond', serif"
              className="pointer-events-none select-none"
            >
              {m.label}
            </text>
          </g>
        );
      })}
    </svg>
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
      className="min-h-screen flex items-center justify-center px-4 py-8"
    >
      <div className="w-full max-w-md">
        {/* Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1
            className="text-3xl md:text-4xl text-[#c9a84c] mb-3"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            Leitura da Palma
          </h1>
          <p
            className="text-[#e8dcc8]/60 text-lg"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Revele os sinais gravados nas suas mãos
          </p>
        </motion.div>

        {/* Step indicator */}
        <p
          className="text-center text-[#c9a84c]/50 text-sm mb-6 tracking-wider"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Passo {step} de 3
        </p>

        {/* Step content */}
        <div className="relative overflow-hidden min-h-[380px]">
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
                <h2
                  className="text-center text-[#e8dcc8] text-lg mb-6"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Qual é a forma da sua mão?
                </h2>

                <div className="grid grid-cols-2 gap-4 max-w-[300px] mx-auto">
                  {handShapes.map((hs) => {
                    const sel = handShape === hs.id;
                    return (
                      <motion.button
                        key={hs.id}
                        type="button"
                        onClick={() => setHandShape(hs.id)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-300 ${
                          sel
                            ? 'border-[#c9a84c] bg-[#c9a84c]/10 shadow-[0_0_16px_rgba(201,168,76,0.2)]'
                            : 'border-[#c9a84c]/20 bg-white/5 hover:border-[#c9a84c]/40'
                        }`}
                        style={{ minHeight: '160px' }}
                      >
                        <PalmIcon palmW={hs.palmW} palmH={hs.palmH} fingerH={hs.fingerH} selected={sel} />
                        <span
                          className={`text-sm mt-2 ${sel ? 'text-[#c9a84c]' : 'text-[#c9a84c]/70'}`}
                          style={{ fontFamily: "'Cinzel Decorative', serif" }}
                        >
                          {hs.label}
                        </span>
                        <span
                          className="text-[#e8dcc8]/40 text-xs mt-1 text-center leading-tight"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                          {hs.desc}
                        </span>
                      </motion.button>
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
                <h2
                  className="text-center text-[#e8dcc8] text-lg mb-4"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Qual monte é mais proeminente na sua palma?
                </h2>
                <p
                  className="text-center text-[#e8dcc8]/30 text-sm mb-4"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Toque no monte mais elevado
                </p>

                <HandDiagram selected={dominantMount} onSelect={setDominantMount} />

                {dominantMount && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-[#c9a84c] text-sm mt-3"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Monte de {mountZones.find((m) => m.id === dominantMount)?.label} selecionado
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
                <h2
                  className="text-center text-[#e8dcc8] text-lg mb-6"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Qual linha é mais marcada?
                </h2>

                <div className="grid grid-cols-2 gap-3 max-w-[300px] mx-auto mb-8">
                  {lineOptions.map((ln) => {
                    const sel = dominantLine === ln.id;
                    return (
                      <motion.button
                        key={ln.id}
                        type="button"
                        onClick={() => setDominantLine(ln.id)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-300 ${
                          sel
                            ? 'border-[#c9a84c] bg-[#c9a84c]/10 shadow-[0_0_16px_rgba(201,168,76,0.2)]'
                            : 'border-[#c9a84c]/20 bg-white/5 hover:border-[#c9a84c]/40'
                        }`}
                      >
                        <span
                          className={`text-sm ${sel ? 'text-[#c9a84c]' : 'text-[#c9a84c]/70'}`}
                          style={{ fontFamily: "'Cinzel Decorative', serif" }}
                        >
                          {ln.label}
                        </span>
                        <span
                          className="text-[#e8dcc8]/40 text-xs mt-1 text-center"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                          {ln.desc}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Name input */}
                <div className="max-w-[300px] mx-auto">
                  <label className="block text-[#c9a84c]/70 text-sm mb-2 tracking-wider uppercase">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome de nascimento"
                    className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-lg px-4 py-3 text-[#e8dcc8] placeholder-[#e8dcc8]/20 focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 gap-4">
          <motion.button
            type="button"
            onClick={goPrev}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2 rounded-lg border border-[#c9a84c]/30 text-[#c9a84c]/70 text-sm tracking-wider uppercase hover:border-[#c9a84c]/50 hover:text-[#c9a84c] transition-all duration-300 cursor-pointer"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            Voltar
          </motion.button>

          {step < 3 ? (
            <motion.button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              whileHover={canNext ? { scale: 1.02 } : {}}
              whileTap={canNext ? { scale: 0.98 } : {}}
              className={`px-5 py-2 rounded-lg border text-sm tracking-wider uppercase transition-all duration-300 ${
                canNext
                  ? 'border-[#c9a84c]/40 text-[#c9a84c] hover:border-[#c9a84c]/60 cursor-pointer'
                  : 'border-white/10 text-white/20 cursor-not-allowed'
              }`}
              style={{ fontFamily: "'Cinzel Decorative', serif" }}
            >
              Próximo
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              whileHover={canSubmit ? { scale: 1.02 } : {}}
              whileTap={canSubmit ? { scale: 0.98 } : {}}
              className={`flex-1 py-3 rounded-lg text-sm tracking-wider uppercase transition-all duration-300 ${
                canSubmit
                  ? 'bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c]/30 cursor-pointer'
                  : 'bg-white/5 border border-white/10 text-white/20 cursor-not-allowed'
              }`}
              style={{ fontFamily: "'Cinzel Decorative', serif" }}
            >
              Revelar Mapa
            </motion.button>
          )}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-center text-[#e8dcc8]/20 text-xs mt-8"
        >
          Seus dados permanecem apenas no seu navegador
        </motion.p>
      </div>
    </motion.div>
  );
}
