// ═══════════════════════════════════════
// Cartografia da Alma — Glyphs
// Sephirah, Element & Archetype symbols
// ═══════════════════════════════════════

import type { SephirahName, Element, ArchetypeName } from '../types/soul-map';

export interface GlyphProps {
  size?: number;
  color?: string;
  opacity?: number;
  animated?: boolean;
}

const pulseKeyframes = `
@keyframes glyphPulse {
  0%, 100% { opacity: var(--glyph-opacity-max); }
  50% { opacity: var(--glyph-opacity-min); }
}
`;

let styleInjected = false;
function injectPulseStyle() {
  if (styleInjected) return;
  if (typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.textContent = pulseKeyframes;
  document.head.appendChild(style);
  styleInjected = true;
}

function svgProps(
  size: number,
  color: string,
  opacity: number,
  animated: boolean,
) {
  if (animated) injectPulseStyle();
  return {
    width: size,
    height: size,
    viewBox: '0 0 64 64',
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    style: animated
      ? ({
          '--glyph-opacity-max': String(opacity),
          '--glyph-opacity-min': String(opacity * 0.7),
          opacity,
          animation: 'glyphPulse 3s ease-in-out infinite',
        } as React.CSSProperties)
      : { opacity },
  };
}

// ───────────────────────────────────────
// 1. SephirahGlyph
// ───────────────────────────────────────

const sephirahRenderers: Record<SephirahName, (c: string) => React.ReactNode> = {
  Kether: (c) => {
    const lines: React.ReactNode[] = [];
    for (let i = 0; i < 10; i++) {
      const angle = (i * 36 * Math.PI) / 180;
      lines.push(
        <line
          key={i}
          x1={32 + 6 * Math.cos(angle)}
          y1={32 + 6 * Math.sin(angle)}
          x2={32 + 24 * Math.cos(angle)}
          y2={32 + 24 * Math.sin(angle)}
        />,
      );
    }
    return (
      <>
        <circle cx={32} cy={32} r={2} fill={c} stroke="none" />
        {lines}
      </>
    );
  },

  Chokmah: () => (
    <>
      <line x1={12} y1={28} x2={52} y2={28} />
      <line x1={12} y1={36} x2={52} y2={36} />
    </>
  ),

  Binah: () => (
    <polygon points="32,18 14,46 50,46" />
  ),

  Chesed: () => (
    <polyline points="14,46 14,18 50,18 50,46" />
  ),

  Geburah: () => {
    const pts: [number, number][] = [];
    for (let i = 0; i < 5; i++) {
      const angle = (-90 + i * 72) * (Math.PI / 180);
      pts.push([32 + 18 * Math.cos(angle), 32 + 18 * Math.sin(angle)]);
    }
    const pointsStr = pts.map((p) => p.join(',')).join(' ');
    return (
      <>
        <polygon points={pointsStr} />
        <line x1={32} y1={12} x2={32} y2={52} />
      </>
    );
  },

  Tiphareth: () => (
    <>
      <polygon points="32,16 14,46 50,46" />
      <polygon points="32,48 14,18 50,18" />
    </>
  ),

  Netzach: () => {
    let d = 'M 32 32';
    const turns = 2.5;
    const steps = 80;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const angle = t * turns * 2 * Math.PI;
      const r = 2 + t * 18;
      d += ` L ${32 + r * Math.cos(angle)} ${32 + r * Math.sin(angle)}`;
    }
    return <path d={d} />;
  },

  Hod: () => (
    <>
      <circle cx={32} cy={22} r={8} />
      <line x1={32} y1={30} x2={32} y2={52} />
      <line x1={24} y1={42} x2={40} y2={42} />
      <path d="M 24 18 Q 20 14 18 18" />
      <path d="M 40 18 Q 44 14 46 18" />
    </>
  ),

  Yesod: () => (
    <>
      <path d="M 38 16 A 18 18 0 0 0 38 48" />
      <circle cx={30} cy={32} r={4} />
    </>
  ),

  Malkuth: () => (
    <>
      <circle cx={32} cy={32} r={16} />
      <line x1={32} y1={16} x2={32} y2={48} />
      <line x1={16} y1={32} x2={48} y2={32} />
    </>
  ),

  Daath: () => (
    <>
      <circle cx={32} cy={32} r={16} />
      <circle cx={32} cy={32} r={1.5} fill="currentColor" stroke="none" />
    </>
  ),
};

export function SephirahGlyph({
  name,
  size = 64,
  color = 'var(--gold)',
  opacity = 1,
  animated = false,
}: { name: SephirahName } & GlyphProps) {
  return (
    <svg {...svgProps(size, color, opacity, animated)}>
      {sephirahRenderers[name](color)}
    </svg>
  );
}

// ───────────────────────────────────────
// 2. ElementGlyph
// ───────────────────────────────────────

const elementRenderers: Record<Element, () => React.ReactNode> = {
  fire: () => <polygon points="32,12 12,52 52,52" />,

  water: () => <polygon points="32,52 12,12 52,12" />,

  air: () => (
    <>
      <polygon points="32,12 12,52 52,52" />
      <line x1={18} y1={36} x2={46} y2={36} />
    </>
  ),

  earth: () => (
    <>
      <polygon points="32,52 12,12 52,12" />
      <line x1={18} y1={28} x2={46} y2={28} />
    </>
  ),
};

export function ElementGlyph({
  element,
  size = 64,
  color = 'var(--gold)',
  opacity = 1,
  animated = false,
}: { element: Element } & GlyphProps) {
  return (
    <svg {...svgProps(size, color, opacity, animated)}>
      {elementRenderers[element]()}
    </svg>
  );
}

// ───────────────────────────────────────
// 3. ArchetypeGlyph
// ───────────────────────────────────────

const archetypeSymbols: Record<ArchetypeName, () => React.ReactNode> = {
  Hero: () => (
    <path d="M 32 28 L 32 20 M 28 24 L 32 20 L 36 24" />
  ),
  Lover: () => (
    <path d="M 32 28 Q 32 24 28 22 Q 24 22 24 26 Q 24 30 32 34 Q 40 30 40 26 Q 40 22 36 22 Q 32 24 32 28 Z" strokeWidth={1} />
  ),
  Jester: () => (
    <path d="M 26 22 L 29 26 L 32 22 L 35 26 L 38 22" />
  ),
  Caregiver: () => (
    <path d="M 26 28 Q 24 22 28 22 M 38 28 Q 40 22 36 22" />
  ),
  Ruler: () => (
    <path d="M 26 28 L 28 22 L 32 26 L 36 22 L 38 28" />
  ),
  Sage: () => (
    <>
      <ellipse cx={32} cy={24} rx={6} ry={3} />
      <circle cx={32} cy={24} r={1.2} fill="currentColor" stroke="none" />
    </>
  ),
  Diplomat: () => (
    <path d="M 32 20 L 32 28 M 26 28 L 38 28 M 26 28 L 24 32 M 38 28 L 40 32" />
  ),
  Magician: () => {
    const pts: string[] = [];
    for (let i = 0; i < 5; i++) {
      const angle = (-90 + i * 144) * (Math.PI / 180);
      pts.push(`${32 + 6 * Math.cos(angle)},${24 + 6 * Math.sin(angle)}`);
    }
    return <polygon points={pts.join(' ')} />;
  },
  Explorer: () => (
    <>
      <circle cx={32} cy={24} r={5} />
      <path d="M 32 19 L 33 22 L 31 22 Z" fill="currentColor" stroke="none" />
    </>
  ),
  Elder: () => (
    <path d="M 28 20 L 36 20 L 32 25 L 36 30 L 28 30 L 32 25 Z" />
  ),
  Rebel: () => (
    <path d="M 30 20 L 34 24 L 30 24 L 34 30" />
  ),
  Mystic: () => {
    let d = 'M 32 24';
    const steps = 30;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const angle = t * 2 * Math.PI * 1.5;
      const r = 1 + t * 5;
      d += ` L ${32 + r * Math.cos(angle)} ${24 + r * Math.sin(angle)}`;
    }
    return <path d={d} />;
  },
};

export function ArchetypeGlyph({
  name,
  size = 64,
  color = 'var(--gold)',
  opacity = 1,
  animated = false,
}: { name: ArchetypeName } & GlyphProps) {
  return (
    <svg {...svgProps(size, color, opacity, animated)}>
      {/* Upper semicircle — light face */}
      <path
        d="M 12 32 A 20 20 0 0 1 52 32"
        fill="rgba(232,228,218,0.05)"
      />
      {/* Lower semicircle — shadow face */}
      <path
        d="M 12 32 A 20 20 0 0 0 52 32"
        fill="rgba(26,10,10,0.3)"
      />
      {/* Dividing line */}
      <line x1={12} y1={32} x2={52} y2={32} />
      {/* Full circle outline */}
      <circle cx={32} cy={32} r={20} />
      {/* Inner archetype symbol */}
      <g stroke={color} fill="none">
        {archetypeSymbols[name]()}
      </g>
    </svg>
  );
}
