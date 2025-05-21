import React, { useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface AudioPlayerBarProps {
  title: string;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onClose: () => void;
}

const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  title,
  duration,
  currentTime,
  isPlaying,
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  onClose,
}) => {
  const [volume, setVolume] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  // Format time display (e.g., 1:30)
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Toggle mute state
  const handleMuteToggle = () => {
    if (isMuted) {
      setIsMuted(false);
      onVolumeChange(volume);
    } else {
      setIsMuted(true);
      onVolumeChange(0);
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (!isMuted) {
      onVolumeChange(newVolume);
    }
  };
  
  // Handle seek
  const handleSeek = (value: number[]) => {
    onSeek(value[0]);
  };
  
  // Handle play/pause directly through props
  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex flex-col px-4 py-2 md:py-3 md:px-6 max-w-screen-2xl mx-auto">
        {/* Top Row: Down caret, Title, Time */}
        <div className="flex justify-between items-center w-full mb-1 sm:mb-2">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
              <ChevronDown size={22} />
            </Button>
            <p className="text-sm font-medium truncate max-w-[140px] md:max-w-[200px]">{title}</p>
          </div>
          <div className="flex text-xs text-gray-500 space-x-1">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Controls and Progress Bar */}
        <div className="flex items-center justify-between w-full">
          {/* Play/Pause Button */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handlePlayPause} 
            className="mr-2"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </Button>
          
          {/* Progress Bar */}
          <div className="flex-1 px-2">
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 1}
              step={0.1}
              onValueChange={handleSeek}
              className="w-full"
            />
          </div>
          
          {/* Volume Control - Visible on all screens */}
          <div className="flex items-center space-x-2 ml-4">
            <Button variant="ghost" size="icon" onClick={handleMuteToggle} className="text-gray-700">
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </Button>
            <Slider
              value={[volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayerBar;
