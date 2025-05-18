
import { useState, useEffect, useRef } from 'react';

interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
}

export function useAudioPlayer(meditationUrl: string, backgroundMusicId?: string | null) {
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isLoading: true
  });

  const meditationAudioRef = useRef<HTMLAudioElement | null>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create meditation audio element
    const meditationAudio = new Audio(meditationUrl);
    meditationAudioRef.current = meditationAudio;

    // Create background audio element if ID is provided
    if (backgroundMusicId && backgroundMusicId !== 'none') {
      const backgroundAudio = new Audio(`/music/${backgroundMusicId}.mp3`);
      backgroundAudio.loop = true;
      backgroundAudio.volume = 0.3; // 30% volume for background music
      backgroundAudioRef.current = backgroundAudio;
    }

    // Set up meditation audio event listeners
    const handleTimeUpdate = () => {
      setState(prev => ({
        ...prev,
        currentTime: meditationAudio.currentTime,
        duration: meditationAudio.duration
      }));
    };

    const handleLoadedMetadata = () => {
      setState(prev => ({
        ...prev,
        duration: meditationAudio.duration,
        isLoading: false
      }));
    };

    const handleEnded = () => {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current.currentTime = 0;
      }
      setState(prev => ({ ...prev, isPlaying: false }));
    };

    meditationAudio.addEventListener('timeupdate', handleTimeUpdate);
    meditationAudio.addEventListener('loadedmetadata', handleLoadedMetadata);
    meditationAudio.addEventListener('ended', handleEnded);

    // Cleanup function
    return () => {
      meditationAudio.removeEventListener('timeupdate', handleTimeUpdate);
      meditationAudio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      meditationAudio.removeEventListener('ended', handleEnded);
      
      meditationAudio.pause();
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
      }
    };
  }, [meditationUrl, backgroundMusicId]);

  const play = async () => {
    if (!meditationAudioRef.current) return;

    try {
      // Play meditation audio
      await meditationAudioRef.current.play();
      
      // Play background music if available
      if (backgroundAudioRef.current) {
        await backgroundAudioRef.current.play();
      }
      
      setState(prev => ({ ...prev, isPlaying: true }));
    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
    }
  };

  const pause = () => {
    if (!meditationAudioRef.current) return;

    meditationAudioRef.current.pause();
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
    }
    setState(prev => ({ ...prev, isPlaying: false }));
  };

  const seek = (time: number) => {
    if (!meditationAudioRef.current) return;

    meditationAudioRef.current.currentTime = time;
    setState(prev => ({ ...prev, currentTime: time }));
  };

  const setVolume = (volume: number) => {
    if (!meditationAudioRef.current) return;

    // Main meditation audio at full specified volume
    meditationAudioRef.current.volume = volume;
    
    // Background music at 30% of specified volume
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = volume * 0.3;
    }
  };

  return {
    ...state,
    play,
    pause,
    seek,
    setVolume
  };
}
