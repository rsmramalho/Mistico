import { motion } from 'framer-motion';
import { FlowerOfLife } from '../geometry/FlowerOfLife';

// ═══════════════════════════════════════
// About — As seis tradições
// Sem misticismo. Linguagem de documentação.
// ═══════════════════════════════════════

interface AboutProps {
  onBack: () => void;
}

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay },
});

const TRADITIONS = [
  {
    icon: '♈',
    name: 'Astrologia',
    description: 'Posição do Sol no zodíaco no momento do nascimento. Determina signo, elemento (fogo/terra/ar/água) e modalidade (cardinal/fixo/mutável). Sistema de correspondências entre ciclos celestes e padrões comportamentais.',
    source: 'Ptolomeu (séc. II), tradição helenística. Cálculo: data de nascimento → posição eclíptica.',
  },
  {
    icon: '✡',
    name: 'Kabbalah',
    description: 'Posição na Árvore da Vida baseada na correspondência entre signo e regente planetário clássico. Cada sephirah representa um princípio organizador com caminhos adjacentes e uma correção específica (tikkun).',
    source: 'Golden Dawn (séc. XIX), Sefer Yetzirah, Tabela 777 de Crowley. Cadeia: signo → regente → sephirah.',
  },
  {
    icon: '☯',
    name: 'Psicologia Analítica',
    description: 'Mapeamento de arquétipos e sombras. Cada signo corresponde a um padrão arquetípico com desejo central, medo central, e duas manifestações de sombra (inflada e deflacionada).',
    source: 'Jung, Carol Pearson, Liz Greene. Mapeamento interpretativo (Jung não mapeou diretamente zodíaco → arquétipos).',
  },
  {
    icon: '♪',
    name: 'Solfeggio',
    description: 'Frequências da escala de Solfeggio (174-963 Hz) associadas aos elementos. Cada frequência corresponde a um campo de ressonância com significado próprio — da liberação à conexão com o todo.',
    source: 'Tradição medieval, redescoberta por Dr. Joseph Puleo. Correspondência elemento → frequência.',
  },
  {
    icon: '①',
    name: 'Numerologia',
    description: 'Número de expressão derivado do nome completo via redução pitagórica. Cada letra corresponde a um número (1-9). A soma reduzida revela o padrão numérico com traços e sombra.',
    source: 'Pitágoras (séc. VI a.C.), tradição pitagórica ocidental. Cálculo: letras do nome → soma → redução.',
  },
  {
    icon: '🧠',
    name: 'Psicanálise',
    description: 'Distribuição da estrutura psíquica (id/ego/superego) baseada no elemento astrológico. O fogo amplifica o id, a terra reforça o superego, o ar equilibra o ego, a água dissolve fronteiras.',
    source: 'Freud. Correspondência interpretativa elemento → distribuição psíquica.',
  },
];

export function About({ onBack }: AboutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ minHeight: '100svh', position: 'relative', overflow: 'hidden' }}
    >
      {/* Background */}
      <motion.div
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.04, pointerEvents: 'none',
          width: 'min(90vw, 700px)', height: 'min(90vw, 700px)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 200, repeat: Infinity, ease: 'linear' }}
      >
        <FlowerOfLife />
      </motion.div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px', margin: '0 auto', padding: '64px 24px' }}>
        {/* Header */}
        <motion.div {...fade(0.2)}>
          <p style={{
            fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
            letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase',
            marginBottom: '24px',
          }}>
            as seis tradições
          </p>
          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 300, color: 'var(--white)', lineHeight: 1.2, marginBottom: '16px',
          }}>
            De onde vem<br />
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>cada conclusão</em>
          </h1>
          <p style={{
            fontFamily: 'var(--serif)', fontSize: '17px', fontWeight: 300,
            fontStyle: 'italic', color: 'var(--white-dim)', lineHeight: 1.7, marginBottom: '48px',
          }}>
            Cartografia da Alma cruza seis tradições filosóficas. Cada uma tem origem, método e limitações documentadas. Não é misticismo vazio — é cartografia com proveniência.
          </p>
        </motion.div>

        {/* Traditions */}
        {TRADITIONS.map((t, i) => (
          <motion.div
            key={t.name}
            {...fade(0.5 + i * 0.15)}
            style={{
              marginBottom: '40px',
              paddingLeft: '16px',
              borderLeft: '2px solid var(--gold-line)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '20px' }}>{t.icon}</span>
              <span style={{
                fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 300,
                letterSpacing: '0.35em', color: 'var(--gold)', textTransform: 'uppercase',
              }}>
                {t.name}
              </span>
            </div>
            <p style={{
              fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 300,
              color: 'var(--white-dim)', lineHeight: 1.7, margin: '0 0 8px',
            }}>
              {t.description}
            </p>
            <p style={{
              fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 200,
              color: 'var(--white-ghost)', lineHeight: 1.5, margin: 0,
            }}>
              Fonte: {t.source}
            </p>
          </motion.div>
        ))}

        {/* Disclaimer */}
        <motion.div {...fade(1.5)} style={{
          borderTop: '1px solid var(--gold-line)', paddingTop: '32px', marginTop: '16px',
        }}>
          <p style={{
            fontFamily: 'var(--serif)', fontSize: '15px', fontWeight: 300,
            fontStyle: 'italic', color: 'var(--white-dim)', lineHeight: 1.7,
            textAlign: 'center', marginBottom: '32px',
          }}>
            Estes sistemas são espelhos, não verdades absolutas. A cartografia revela padrões — o que você faz com eles é decisão sua.
          </p>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={onBack}
              style={{
                background: 'transparent', border: 'none',
                borderBottom: '1px solid var(--gold)',
                fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 300,
                letterSpacing: '0.32em', color: 'var(--gold)', textTransform: 'uppercase',
                padding: '0 0 6px', transition: 'color 0.3s, letter-spacing 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--white)'; e.currentTarget.style.letterSpacing = '0.42em'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.letterSpacing = '0.32em'; }}
            >
              ← voltar
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
