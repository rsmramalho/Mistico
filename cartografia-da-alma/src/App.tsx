import { motion, AnimatePresence } from 'framer-motion';
import { useSoulMap } from './hooks/useSoulMap';
import { CosmosBackground } from './geometry/CosmosBackground';
import { Entry } from './screens/Entry';
import { PalmEntry } from './screens/PalmEntry';
import { Loading } from './screens/Loading';
import { Revelation } from './screens/Revelation';
import { SoulMateRevelation } from './screens/SoulMateRevelation';

function Gateway({ onBirth, onPalm }: { onBirth: () => void; onPalm: () => void }) {
  return (
    <motion.div
      key="gateway"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="w-full max-w-lg">
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
            Escolha seu caminho de entrada
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* Birth path */}
          <motion.button
            onClick={onBirth}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white/5 border border-[#c9a84c]/20 hover:border-[#c9a84c]/40 rounded-lg p-6 text-left transition-all cursor-pointer"
          >
            <p className="text-3xl mb-3">&#10022;</p>
            <p
              className="text-[#c9a84c] text-lg mb-2"
              style={{ fontFamily: "'Cinzel Decorative', serif" }}
            >
              Nascimento
            </p>
            <p
              className="text-[#e8dcc8]/50 text-sm"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Entre seus dados de nascimento
            </p>
          </motion.button>

          {/* Palm path */}
          <motion.button
            onClick={onPalm}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white/5 border border-[#c9a84c]/20 hover:border-[#c9a84c]/40 rounded-lg p-6 text-left transition-all cursor-pointer"
          >
            <p className="text-3xl mb-3">&#9995;</p>
            <p
              className="text-[#c9a84c] text-lg mb-2"
              style={{ fontFamily: "'Cinzel Decorative', serif" }}
            >
              Palma
            </p>
            <p
              className="text-[#e8dcc8]/50 text-sm"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Leia as linhas da sua m&atilde;o
            </p>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const { screen, soulMap, soulMateReading, shareUrl, isSharing, canShare, generate, generateFromPalm, share, meetAnotherSoul, goToEntry, goToPalmEntry, reset } = useSoulMap();

  return (
    <div className="relative min-h-screen bg-[#04040a] overflow-x-hidden">
      <CosmosBackground />

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {screen === 'gateway' && (
            <Gateway key="gateway" onBirth={goToEntry} onPalm={goToPalmEntry} />
          )}
          {screen === 'entry' && (
            <Entry key="entry" onSubmit={generate} onBack={reset} />
          )}
          {screen === 'palmEntry' && (
            <PalmEntry key="palmEntry" onSubmit={generateFromPalm} onBack={reset} />
          )}
          {screen === 'loading' && <Loading key="loading" />}
          {screen === 'revelation' && soulMap && (
            <Revelation
              key="revelation"
              soulMap={soulMap}
              onReset={reset}
              canShare={canShare}
              shareUrl={shareUrl}
              isSharing={isSharing}
              onShare={share}
              onMeet={meetAnotherSoul}
            />
          )}
          {screen === 'meetLoading' && <Loading key="meetLoading" />}
          {screen === 'soulMate' && soulMateReading && (
            <SoulMateRevelation key="soulMate" reading={soulMateReading} onReset={reset} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
