import { useState } from 'react';
import { motion } from 'framer-motion';
import type { BirthData } from '../types/soul-map';

interface EntryProps {
  onSubmit: (data: BirthData) => void;
  onBack?: () => void;
}

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay },
});

export function Entry({ onSubmit, onBack }: EntryProps) {
  const [name, setName]     = useState('');
  const [dateStr, setDateStr] = useState('');
  const [time, setTime]     = useState('');
  const [city, setCity]     = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dateStr) return;
    onSubmit({ name: name.trim(), date: new Date(dateStr + 'T12:00:00'), time: time || undefined, city: city.trim() || undefined });
  };

  const isValid = name.trim().length > 0 && dateStr.length > 0;

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
        <motion.div {...fade(0.2)} style={{ marginBottom: '64px' }}>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200, letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '18px' }}>
            via astros
          </p>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: 300, lineHeight: 1.05, color: 'var(--white)' }}>
            Quando e onde<br /><em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>você chegou?</em>
          </h1>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

            {/* Nome */}
            <motion.div {...fade(0.4)}>
              <label style={labelStyle}>nome completo</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="como você veio ao mundo"
                style={{ ...fieldStyle, fontSize: '26px' }}
                onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
                onBlur={e => (e.target.style.borderBottomColor = 'rgba(201,168,76,0.2)')}
                autoFocus
              />
            </motion.div>

            {/* Data */}
            <motion.div {...fade(0.55)}>
              <label style={labelStyle}>data de nascimento</label>
              <input
                type="date"
                value={dateStr}
                onChange={e => setDateStr(e.target.value)}
                style={{ ...fieldStyle, colorScheme: 'dark' }}
                onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
                onBlur={e => (e.target.style.borderBottomColor = 'rgba(201,168,76,0.2)')}
              />
            </motion.div>

            {/* Hora + Cidade — linha */}
            <motion.div {...fade(0.7)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <label style={labelStyle}>hora <span style={{ opacity: 0.4, letterSpacing: '0.1em', textTransform: 'none' }}>(opcional)</span></label>
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  style={{ ...fieldStyle, colorScheme: 'dark' }}
                  onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
                  onBlur={e => (e.target.style.borderBottomColor = 'rgba(201,168,76,0.2)')}
                />
              </div>
              <div>
                <label style={labelStyle}>cidade <span style={{ opacity: 0.4, letterSpacing: '0.1em', textTransform: 'none' }}>(opcional)</span></label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="onde nasceu"
                  style={fieldStyle}
                  onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
                  onBlur={e => (e.target.style.borderBottomColor = 'rgba(201,168,76,0.2)')}
                />
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div {...fade(0.9)} style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '32px' }}>
              <button
                type="submit"
                disabled={!isValid}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `1px solid ${isValid ? 'var(--gold)' : 'rgba(201,168,76,0.2)'}`,
                  fontFamily: 'var(--sans)',
                  fontSize: '10px',
                  fontWeight: 300,
                  letterSpacing: '0.32em',
                  color: isValid ? 'var(--gold)' : 'rgba(201,168,76,0.3)',
                  textTransform: 'uppercase',
                  padding: '0 0 6px',
                  transition: 'color 0.3s, border-color 0.3s, letter-spacing 0.3s',
                }}
                onMouseEnter={e => { if (isValid) { (e.target as HTMLElement).style.color = 'var(--white)'; (e.target as HTMLElement).style.letterSpacing = '0.42em'; } }}
                onMouseLeave={e => { if (isValid) { (e.target as HTMLElement).style.color = 'var(--gold)'; (e.target as HTMLElement).style.letterSpacing = '0.32em'; } }}
              >
                revelar mapa
              </button>

              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  style={{
                    background: 'transparent', border: 'none',
                    fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200,
                    letterSpacing: '0.25em', color: 'rgba(232,228,218,0.3)',
                    textTransform: 'uppercase', transition: 'color 0.3s',
                  }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--white-dim)')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(232,228,218,0.3)')}
                >
                  ← voltar
                </button>
              )}
            </motion.div>

          </div>
        </form>

        <motion.p
          {...fade(1.2)}
          style={{ marginTop: '48px', fontFamily: 'var(--sans)', fontSize: '9px', fontWeight: 200, letterSpacing: '0.2em', color: 'rgba(232,228,218,0.18)', textTransform: 'uppercase' }}
        >
          seus dados permanecem no seu navegador
        </motion.p>
      </div>
    </motion.div>
  );
}
