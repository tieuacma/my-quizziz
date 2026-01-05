import { useRef, useEffect, useCallback } from 'react';

export const useAudio = () => {
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  const effectAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize background music
  useEffect(() => {
    backgroundAudioRef.current = new Audio('/audio/loop.ogg');
    effectAudioRef.current = new Audio();

    // Set up background music properties
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.loop = true;
      backgroundAudioRef.current.volume = 0.3; // 30% volume for background
    }

    // Set up effect audio properties
    if (effectAudioRef.current) {
      effectAudioRef.current.volume = 0.7; // 70% volume for effects
    }

    return () => {
      // Cleanup
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current = null;
      }
      if (effectAudioRef.current) {
        effectAudioRef.current.pause();
        effectAudioRef.current = null;
      }
    };
  }, []);

  const playBackgroundMusic = useCallback(() => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.currentTime = 0;
      backgroundAudioRef.current.play().catch(console.error);
    }
  }, []);

  const stopBackgroundMusic = useCallback(() => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
    }
  }, []);

  const playCorrectSound = useCallback(() => {
    if (effectAudioRef.current) {
      effectAudioRef.current.src = '/audio/ac.mp3';
      effectAudioRef.current.currentTime = 0;
      effectAudioRef.current.play().catch(console.error);
    }
  }, []);

  const playWrongSound = useCallback(() => {
    if (effectAudioRef.current) {
      effectAudioRef.current.src = '/audio/wr.mp3';
      effectAudioRef.current.currentTime = 0;
      effectAudioRef.current.play().catch(console.error);
    }
  }, []);

  return {
    playBackgroundMusic,
    stopBackgroundMusic,
    playCorrectSound,
    playWrongSound,
  };
};
