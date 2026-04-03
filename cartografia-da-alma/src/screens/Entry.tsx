import { useState } from 'react';
import { motion } from 'framer-motion';
import type { BirthData } from '../types/soul-map';

interface EntryProps {
  onSubmit: (data: BirthData) => void;
  onBack?: () => void;
}

export function Entry({ onSubmit, onBack }: EntryProps) {
  const [name, setName] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [time, setTime] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dateStr) return;

    const date = new Date(dateStr + 'T12:00:00');

    onSubmit({
      name: name.trim(),
      date,
      time: time || undefined,
      city: city.trim() || undefined,
    });
  };

  const isValid = name.trim().length > 0 && dateStr.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center mb-12"
        >
          <h1
            className="text-3xl md:text-4xl text-[#c9a84c] mb-3"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            Cartografia da Alma
          </h1>
          <p
            className="text-[#e8dcc8]/60 text-lg"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Entre seus dados de nascimento para revelar seu mapa interior
          </p>
        </motion.div>

        <motion.form
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Name */}
          <div>
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
              autoFocus
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-[#c9a84c]/70 text-sm mb-2 tracking-wider uppercase">
              Data de Nascimento
            </label>
            <input
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-lg px-4 py-3 text-[#e8dcc8] focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', colorScheme: 'dark' }}
            />
          </div>

          {/* Time (optional) */}
          <div>
            <label className="block text-[#c9a84c]/70 text-sm mb-2 tracking-wider uppercase">
              Hora de Nascimento
              <span className="text-[#c9a84c]/30 ml-2 normal-case">(opcional)</span>
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-lg px-4 py-3 text-[#e8dcc8] focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', colorScheme: 'dark' }}
            />
          </div>

          {/* City (optional) */}
          <div>
            <label className="block text-[#c9a84c]/70 text-sm mb-2 tracking-wider uppercase">
              Cidade de Nascimento
              <span className="text-[#c9a84c]/30 ml-2 normal-case">(opcional)</span>
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Cidade onde nasceu"
              className="w-full bg-white/5 border border-[#c9a84c]/20 rounded-lg px-4 py-3 text-[#e8dcc8] placeholder-[#e8dcc8]/20 focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}
            />
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={!isValid}
            whileHover={isValid ? { scale: 1.02 } : {}}
            whileTap={isValid ? { scale: 0.98 } : {}}
            className={`w-full py-4 rounded-lg text-lg tracking-wider uppercase transition-all duration-300 ${
              isValid
                ? 'bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c]/30 cursor-pointer'
                : 'bg-white/5 border border-white/10 text-white/20 cursor-not-allowed'
            }`}
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            Revelar Mapa
          </motion.button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-center text-[#e8dcc8]/20 text-xs mt-8"
        >
          Seus dados permanecem apenas no seu navegador
        </motion.p>

        {onBack && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            onClick={onBack}
            className="block mx-auto mt-4 text-[#c9a84c]/30 hover:text-[#c9a84c]/60 text-xs tracking-wider uppercase transition-colors cursor-pointer"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            &#8592; Voltar
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
