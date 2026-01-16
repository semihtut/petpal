import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { useGameTick } from './hooks/useGameTick';
import { Onboarding } from './screens/Onboarding';
import { Home } from './screens/Home';
import { Tasks } from './screens/Tasks';
import { Shop } from './screens/Shop';
import { Wardrobe } from './screens/Wardrobe';
import { Achievements } from './screens/Achievements';
import { Settings } from './screens/Settings';
import { MiniGame } from './components/MiniGames';
import type { ActionType } from './utils/types';
import './App.css';

type Screen = 'home' | 'tasks' | 'shop' | 'wardrobe' | 'achievements' | 'settings';

function App() {
  const isOnboarded = useGameStore((state) => state.isOnboarded);
  const initializeGame = useGameStore((state) => state.initializeGame);

  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [miniGameAction, setMiniGameAction] = useState<ActionType | null>(null);

  // Initialize game tick (stat updates, task resets, etc.)
  useGameTick();

  const handleOnboardingComplete = (dogId: string, name: string) => {
    initializeGame({
      breedId: dogId,
      customName: name,
      createdAt: Date.now(),
    });
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const handlePlayMiniGame = (action: ActionType) => {
    setMiniGameAction(action);
  };

  const handleMiniGameComplete = () => {
    setMiniGameAction(null);
  };

  // Show onboarding if not completed
  if (!isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Show mini game if active
  if (miniGameAction) {
    return (
      <MiniGame
        action={miniGameAction}
        onComplete={handleMiniGameComplete}
        onCancel={handleMiniGameComplete}
      />
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentScreen}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        {currentScreen === 'home' && (
          <Home onNavigate={handleNavigate} onPlayMiniGame={handlePlayMiniGame} />
        )}
        {currentScreen === 'tasks' && (
          <Tasks onBack={() => setCurrentScreen('home')} />
        )}
        {currentScreen === 'shop' && (
          <Shop onBack={() => setCurrentScreen('home')} />
        )}
        {currentScreen === 'wardrobe' && (
          <Wardrobe onBack={() => setCurrentScreen('home')} />
        )}
        {currentScreen === 'achievements' && (
          <Achievements onBack={() => setCurrentScreen('home')} />
        )}
        {currentScreen === 'settings' && (
          <Settings onBack={() => setCurrentScreen('home')} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
