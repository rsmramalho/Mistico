import { AnimatePresence } from 'framer-motion';
import { useSoulMap } from './hooks/useSoulMap';
import { CosmosBackground } from './geometry/CosmosBackground';
import { Entry } from './screens/Entry';
import { Loading } from './screens/Loading';
import { Revelation } from './screens/Revelation';

export default function App() {
  const { screen, soulMap, generate, reset } = useSoulMap();

  return (
    <div className="relative min-h-screen bg-[#04040a] overflow-x-hidden">
      <CosmosBackground />

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {screen === 'entry' && <Entry key="entry" onSubmit={generate} />}
          {screen === 'loading' && <Loading key="loading" />}
          {screen === 'revelation' && soulMap && (
            <Revelation key="revelation" soulMap={soulMap} onReset={reset} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
