import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DogSelect } from './DogSelect';
import { NameInput } from './NameInput';
import { Tutorial } from './Tutorial';

type OnboardingStep = 'select' | 'name' | 'tutorial';

interface OnboardingProps {
  onComplete: (dogId: string, name: string) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<OnboardingStep>('select');
  const [selectedDogId, setSelectedDogId] = useState<string>('');
  const [petName, setPetName] = useState<string>('');

  const handleDogSelect = (dogId: string) => {
    setSelectedDogId(dogId);
    setStep('name');
  };

  const handleNameSubmit = (name: string) => {
    setPetName(name);
    setStep('tutorial');
  };

  const handleTutorialComplete = () => {
    onComplete(selectedDogId, petName);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {step === 'select' && <DogSelect onSelect={handleDogSelect} />}
        {step === 'name' && (
          <NameInput
            selectedDogId={selectedDogId}
            onSubmit={handleNameSubmit}
            onBack={() => setStep('select')}
          />
        )}
        {step === 'tutorial' && (
          <Tutorial petName={petName} onComplete={handleTutorialComplete} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
