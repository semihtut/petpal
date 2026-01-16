import { useCallback, useRef, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

type SoundEffect =
  | 'click'
  | 'purchase'
  | 'reward'
  | 'levelup'
  | 'bark_happy'
  | 'bark_alert'
  | 'eat'
  | 'drink'
  | 'snore'
  | 'play'
  | 'ball'
  | 'splash'
  | 'bubble';

// Placeholder for actual audio files
// In production, these would be actual audio file imports
const soundEffects: Record<SoundEffect, string | null> = {
  click: null,
  purchase: null,
  reward: null,
  levelup: null,
  bark_happy: null,
  bark_alert: null,
  eat: null,
  drink: null,
  snore: null,
  play: null,
  ball: null,
  splash: null,
  bubble: null,
};

export function useAudio() {
  const settings = useGameStore((state) => state.settings);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const musicRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio elements
  useEffect(() => {
    Object.entries(soundEffects).forEach(([key, src]) => {
      if (src) {
        const audio = new Audio(src);
        audio.preload = 'auto';
        audioRefs.current[key] = audio;
      }
    });

    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  const playSfx = useCallback(
    (sound: SoundEffect) => {
      if (!settings.sfxEnabled) return;

      const audio = audioRefs.current[sound];
      if (audio) {
        audio.volume = settings.sfxVolume;
        audio.currentTime = 0;
        audio.play().catch(() => {
          // Ignore autoplay errors
        });
      }
    },
    [settings.sfxEnabled, settings.sfxVolume]
  );

  const playPetSound = useCallback(
    (sound: 'bark_happy' | 'bark_alert' | 'eat' | 'drink' | 'snore' | 'play') => {
      if (!settings.sfxEnabled) return;

      const audio = audioRefs.current[sound];
      if (audio) {
        audio.volume = settings.petSoundVolume;
        audio.currentTime = 0;
        audio.play().catch(() => {
          // Ignore autoplay errors
        });
      }
    },
    [settings.sfxEnabled, settings.petSoundVolume]
  );

  const playMusic = useCallback(
    (src: string | null) => {
      if (!src) return;

      if (musicRef.current) {
        musicRef.current.pause();
      }

      const music = new Audio(src);
      music.loop = true;
      music.volume = settings.musicVolume;
      musicRef.current = music;

      if (settings.musicEnabled) {
        music.play().catch(() => {
          // Ignore autoplay errors
        });
      }
    },
    [settings.musicEnabled, settings.musicVolume]
  );

  const stopMusic = useCallback(() => {
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current = null;
    }
  }, []);

  const setMusicVolume = useCallback((volume: number) => {
    if (musicRef.current) {
      musicRef.current.volume = volume;
    }
  }, []);

  const toggleMusic = useCallback(
    (enabled: boolean) => {
      if (musicRef.current) {
        if (enabled) {
          musicRef.current.play().catch(() => {});
        } else {
          musicRef.current.pause();
        }
      }
    },
    []
  );

  // Update music volume when settings change
  useEffect(() => {
    setMusicVolume(settings.musicVolume);
  }, [settings.musicVolume, setMusicVolume]);

  useEffect(() => {
    toggleMusic(settings.musicEnabled);
  }, [settings.musicEnabled, toggleMusic]);

  return {
    playSfx,
    playPetSound,
    playMusic,
    stopMusic,
  };
}
