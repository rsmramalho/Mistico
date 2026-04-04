import { useState } from 'react';
import { motion } from 'framer-motion';
import type { CardState } from '../hooks/useJourney';
type CardId = CardState['id'];

// ═══════════════════════════════════════
// Cartografia da Alma — Journey Timeline
// Horizontal progress bar: fixed top
// ═══════════════════════════════════════

interface JourneyTimelineProps {
  cards: CardState[];
  currentIndex: number;
}

const CARD_ICONS: Record<CardId | 'map', string> = {
  astrology:  '♈',
  kabbalah:   '✡',
  shadow:     '☯',
  frequency:  '♪',
  numerology: '①',
  map:        '○',
};

const CARD_TOOLTIPS: Record<CardId | 'map', string> = {
  astrology:  'Astrologia — o signo como padrão de origem',
  kabbalah:   'Kabbalah — sua posição na Árvore da Vida',
  shadow:     'Jung — o arquétipo e a sombra',
  frequency:  'Solfeggio — a frequência do seu campo',
  numerology: 'Numerologia — o número que carrega seu nome',
  map:        'O Mapa — a síntese de tudo',
};

const pulseAnimation = {
  scale: [1, 1.08, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
};

export function JourneyTimeline({ cards, currentIndex }: JourneyTimelineProps) {
  const [tooltip, setTooltip] = useState<string | null>(null);

  const allCompleted = cards.every(c => c.completed);

  // Build steps: each card + map
  const steps = [
    ...cards.map((card, i) => ({
      id: card.id as CardId | 'map',
      icon: CARD_ICONS[card.id],
      completed: card.completed,
      isCurrent: i === currentIndex,
    })),
    {
      id: 'map' as CardId | 'map',
      icon: CARD_ICONS.map,
      completed: false,
      isCurrent: allCompleted,
    },
  ];

  const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          pointerEvents: 'auto',
          position: 'relative',
        }}
      >
        {steps.map((step, i) => {
          const isCompleted = step.completed;
          const isCurrent = step.isCurrent;
          const isFuture = !isCompleted && !isCurrent;

          const iconOpacity = isFuture ? 0.25 : 1;
          const iconColor = 'var(--gold)';

          // Connecting line (not after last step)
          const showLine = i < steps.length - 1;
          const nextStep = steps[i + 1];
          const lineFull = isCompleted && nextStep?.completed;
          const lineOpacity = lineFull ? 1 : 0.2;

          return (
            <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
              {/* Icon */}
              <motion.div
                animate={isCurrent ? pulseAnimation : { scale: 1 }}
                onMouseEnter={isMobile ? undefined : () => setTooltip(CARD_TOOLTIPS[step.id])}
                onMouseLeave={isMobile ? undefined : () => setTooltip(null)}
                style={{
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  color: iconColor,
                  opacity: iconOpacity,
                  cursor: 'default',
                  userSelect: 'none',
                }}
              >
                {step.icon}
              </motion.div>

              {/* Connecting line */}
              {showLine && (
                <div
                  style={{
                    width: 20,
                    height: 1,
                    background: 'var(--gold)',
                    opacity: lineOpacity,
                  }}
                />
              )}
            </div>
          );
        })}

        {/* Tooltip */}
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: 4,
            fontFamily: 'var(--sans)',
            fontSize: 9,
            fontWeight: 200,
            letterSpacing: '0.2em',
            color: 'var(--gold)',
            textTransform: 'lowercase',
            whiteSpace: 'nowrap',
            opacity: tooltip ? 1 : 0,
            transition: 'opacity 0.15s',
            pointerEvents: 'none',
          }}
        >
          {tooltip ?? ''}
        </div>
      </div>
    </div>
  );
}
