import { BallCatch } from './BallCatch';
import { BubblePop } from './BubblePop';
import { BoneSearch } from './BoneSearch';
import { PortionSelect } from './PortionSelect';
import { DreamCatch } from './DreamCatch';
import type { ActionType, Stats } from '../../utils/types';
import { useGameStore } from '../../store/gameStore';
import { MINI_GAME_BONUS, ACTION_EFFECTS } from '../../utils/constants';

interface MiniGameProps {
  action: ActionType;
  onComplete: () => void;
  onCancel: () => void;
}

export function MiniGame({ action, onComplete, onCancel }: MiniGameProps) {
  const performAction = useGameStore((state) => state.performAction);
  const completeMiniGame = useGameStore((state) => state.completeMiniGame);

  const handleBallCatchComplete = (score: number, maxScore: number) => {
    const bonus = MINI_GAME_BONUS.ballCatch;
    const happinessGain = score * bonus.perCatch;
    const bonusCoins = score === maxScore ? bonus.bonusCoins : 0;

    // Perform the play action
    performAction('play');

    // Add mini game bonus
    completeMiniGame(bonusCoins, { happiness: happinessGain - ACTION_EFFECTS.play.stats.happiness });

    onComplete();
  };

  const handleBubblePopComplete = (score: number, maxScore: number) => {
    const bonus = MINI_GAME_BONUS.bubblePop;
    const percentage = (score / maxScore) * 100;
    const hygieneGain = Math.round((percentage / 100) * ACTION_EFFECTS.bath.stats.hygiene);
    const bonusCoins = percentage === 100 ? bonus.bonusCoins : 0;

    // Perform the bath action
    performAction('bath');

    // Add mini game bonus
    completeMiniGame(bonusCoins, { hygiene: hygieneGain - ACTION_EFFECTS.bath.stats.hygiene });

    onComplete();
  };

  const handleBoneSearchComplete = (score: number, _maxScore: number) => {
    const bonus = MINI_GAME_BONUS.boneSearch;
    const bonusCoins = score * bonus.bonusCoins;
    const happinessGain = score * bonus.perBone;

    // Perform the walk action
    performAction('walk');

    // Add mini game bonus
    completeMiniGame(bonusCoins, { happiness: happinessGain });

    onComplete();
  };

  const handlePortionComplete = (portion: number) => {
    const portions = MINI_GAME_BONUS.portionSelect.portions;
    const selected = portions[portion - 1];

    // Custom feed based on portion
    const bonusStats: Partial<Stats> = {
      hunger: selected.hunger - ACTION_EFFECTS.feed.stats.hunger,
      happiness: selected.happiness,
    };

    performAction('feed');
    completeMiniGame(0, bonusStats);

    onComplete();
  };

  const handleDreamCatchComplete = (score: number, maxScore: number) => {
    const bonus = MINI_GAME_BONUS.dreamCatch;
    const energyGain = score * bonus.perCatch;
    const bonusCoins = score >= maxScore ? bonus.bonusCoins : 0;

    // Perform the sleep action
    performAction('sleep');

    // Add mini game bonus
    completeMiniGame(bonusCoins, { energy: energyGain - ACTION_EFFECTS.sleep.stats.energy });

    onComplete();
  };

  const handleSkip = () => {
    // Just perform the regular action without bonus
    performAction(action);
    onCancel();
  };

  switch (action) {
    case 'play':
      return <BallCatch onComplete={handleBallCatchComplete} onSkip={handleSkip} />;
    case 'bath':
      return <BubblePop onComplete={handleBubblePopComplete} onSkip={handleSkip} />;
    case 'walk':
      return <BoneSearch onComplete={handleBoneSearchComplete} onSkip={handleSkip} />;
    case 'feed':
      return <PortionSelect onComplete={handlePortionComplete} onSkip={handleSkip} />;
    case 'sleep':
      return <DreamCatch onComplete={handleDreamCatchComplete} onSkip={handleSkip} />;
    default:
      return null;
  }
}

export { BallCatch, BubblePop, BoneSearch, PortionSelect, DreamCatch };
