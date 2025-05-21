import { useState, useEffect, useRef } from 'react';

interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
}

// Always initialize the hook with default values, even when URL is null
export function useAudioPlayer(meditationUrl: string | null, backgroundMusicId?: string | null) {
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isLoading: true
  });

  const meditationAudioRef = useRef<HTMLAudioElement | null>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Only create audio elements if we have a valid URL
    if (!meditationUrl) {
      meditationAudioRef.current = null;
      return;
    }

    // If the current audio element already has the correct src, don't recreate it
    if (
      meditationAudioRef.current &&
      meditationAudioRef.current.src === meditationUrl
    ) {
      // No need to recreate
    } else {
      // Create meditation audio element
      const meditationAudio = new Audio(meditationUrl);
      meditationAudioRef.current = meditationAudio;

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

      // Cleanup function for previous audio
      return () => {
        meditationAudio.removeEventListener('timeupdate', handleTimeUpdate);
        meditationAudio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        meditationAudio.removeEventListener('ended', handleEnded);
        meditationAudio.pause();
      };
    }

    // Create background audio element if ID is provided
    if (backgroundMusicId && backgroundMusicId !== 'none') {
      if (
        backgroundAudioRef.current &&
        backgroundAudioRef.current.src === `/music/${backgroundMusicId}.mp3`
      ) {
        // No need to recreate
      } else {
        const backgroundAudio = new Audio(`/music/${backgroundMusicId}.mp3`);
        backgroundAudio.loop = true;
        backgroundAudio.volume = 0.3; // 30% volume for background music
        backgroundAudioRef.current = backgroundAudio;
      }
    } else {
      backgroundAudioRef.current = null;
    }
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
    
    try {
      // Explicitly pause the meditation audio
      meditationAudioRef.current.pause();
      
      // Pause background music if available
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
      }
      
      // Ensure we update the state to reflect the paused state
      setState(prev => ({ ...prev, isPlaying: false }));
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
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
