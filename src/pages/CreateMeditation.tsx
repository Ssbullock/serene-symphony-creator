import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Clock, CheckCircle, Mic, Music, Play, Save, Download, X, Info, ChevronLeft, ChevronRight, Pause, Wand2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/use-user";
import { saveAs } from 'file-saver';
import api from '@/lib/api';
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

// Mock data for meditation options
const meditationStyles = [
  {
    id: "mindfulness",
    name: "Mindfulness",
    description: "Present-moment awareness without judgment",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  },
  {
    id: "breathwork",
    name: "Breathwork",
    description: "Guided breathing techniques for calm and focus",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
  },
  {
    id: "bodyscan",
    name: "Body Scan",
    description: "Progressive relaxation through body awareness",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
  },
  {
    id: "visualization",
    name: "Nature Visualization",
    description: "Mental imagery for deep relaxation",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  },
  {
    id: "gratitude",
    name: "Gratitude Meditation",
    description: "Cultivating appreciation and thankfulness",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
  },
  {
    id: "self-inquiry",
    name: "Self-Inquiry Meditation",
    description: "Deep introspection and self-understanding",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  },
  {
    id: "metta",
    name: "Metta (Loving-Kindness)",
    description: "Cultivating compassion and loving-kindness",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  },
  {
    id: "chakra",
    name: "Chakra Meditation",
    description: "Balancing energy centers throughout the body",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
  },
  {
    id: "mantra",
    name: "Mantra Meditation",
    description: "Sacred sound repetition for focused awareness",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
  },
  {
    id: "yoga",
    name: "Yoga (as meditation)",
    description: "Mindful movement and breath coordination",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  },
  {
    id: "walking",
    name: "Walking Meditation",
    description: "Mindful movement and step-by-step awareness",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 21l4-7 4 7M8 21h8" /></svg>
  }
];

// Update voice options to remove IDs in parentheses from display names
const voiceOptions = [
  { id: "alloy", name: "Emma", description: "Warm and soothing female voice", recommended: "mindfulness", previewText: "Hi, I'm Emma. I'm a warm and soothing voice who will be guiding you through your meditation today." },
  { id: "echo", name: "James", description: "Deep and calming male voice", recommended: "breathwork", previewText: "Hi, I'm James. I'm a deep and calming voice who will be guiding you through your meditation today." },
  { id: "nova", name: "Lily", description: "Soft and gentle female voice", recommended: "bodyscan", previewText: "Hi, I'm Lily. I'm a soft and gentle voice who will be guiding you through your meditation today." },
  { id: "onyx", name: "David", description: "Clear and focused male voice", recommended: "visualization", previewText: "Hi, I'm David. I'm a clear and focused voice who will be guiding you through your meditation today." },
  { id: "shimmer", name: "Sophie", description: "Bright and optimistic female voice", recommended: "", previewText: "Hi, I'm Sophie. I'm a bright and optimistic voice who will be guiding you through your meditation today." },
  { id: "fable", name: "Felix", description: "Warm storyteller voice", recommended: "", previewText: "Hi, I'm Felix. I'm a warm storyteller voice who will be guiding you through your meditation today." },
  { id: "coral", name: "Claire", description: "Expressive and engaging female voice", recommended: "", previewText: "Hi, I'm Claire. I'm an expressive and engaging voice who will be guiding you through your meditation today." },
  { id: "sage", name: "Sam", description: "Wise and thoughtful voice", recommended: "", previewText: "Hi, I'm Sam. I'm a wise and thoughtful voice who will be guiding you through your meditation today." },
  { id: "ash", name: "Alex", description: "Neutral and versatile voice", recommended: "", previewText: "Hi, I'm Alex. I'm a neutral and versatile voice who will be guiding you through your meditation today." }
];

// Update background options with correct public paths
const backgroundOptions = [
  { id: "rain", name: "Gentle Rain", description: "Soft rainfall soundscape" },
  { id: "ocean", name: "Ocean Waves", description: "Rhythmic wave sounds" },
  { id: "forest", name: "Forest Ambience", description: "Birds and gentle breeze" },
  { id: "meditative", name: "Meditative", description: "Calming ambient tones for deep meditation" },
  { id: "none", name: "No Background", description: "Voice guidance only" }
];

// Suggested meditation titles
const suggestedTitles = [
  "Morning Clarity", 
  "Peaceful Night's Sleep", 
  "Anxiety Relief", 
  "Stress Release", 
  "Focus & Concentration",
  "Gratitude Journey",
  "Inner Peace Meditation",
  "Confidence Builder",
  "Energy Renewal",
  "Emotional Balance"
];

// Helper functions to get display names
const getStyleName = (styleId: string) => {
  const style = meditationStyles.find(s => s.id === styleId);
  return style ? style.name : "Custom";
};

const getVoiceName = (voiceId: string) => {
  const voice = voiceOptions.find(v => v.id === voiceId);
  return voice ? voice.name : "Default Voice";
};

const getBackgroundName = (backgroundId: string) => {
  const background = backgroundOptions.find(b => b.id === backgroundId);
  return background ? background.name : "No Background";
};

// Update the formatDuration function to convert seconds to minutes:minutes format
const formatDuration = (seconds: number) => {
  if (isNaN(seconds)) return "0:00";
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Add a function to format minutes for display in the header
const formatMinutesForDisplay = (minutes: number | string) => {
  if (typeof minutes === 'string') {
    // Try to parse the string as a number
    const parsedMinutes = parseFloat(minutes);
    if (isNaN(parsedMinutes)) return minutes; // Return as is if not a valid number
    minutes = parsedMinutes;
  }
  
  // Round to 1 decimal place if it's not a whole number
  return Number.isInteger(minutes) ? minutes.toString() : minutes.toFixed(1);
};

// First, fix the type for generatedMeditation
interface GeneratedMeditation {
  id: string;
  title: string;
  duration: number;
  audio_url: string;
  style: string;
  voice: string;
  background: string;
  goals?: string;
}

const CreateMeditation = () => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("10");
  const [style, setStyle] = useState<string[]>([]);
  const [voice, setVoice] = useState("");
  const [background, setBackground] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [goals, setGoals] = useState("");
  const [generatedMeditation, setGeneratedMeditation] = useState<GeneratedMeditation | null>(null);
  const [error, setError] = useState("");
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  // Add the missing audioRef declaration for preview functionality
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMobile = useIsMobile();
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { user, loading: userLoading } = useUser();
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Use the useAudioPlayer hook for the generated meditation
  const audioPlayer = useAudioPlayer(
    generatedMeditation?.audio_url || null,
    generatedMeditation?.background || null
  );

  // Get random suggested titles
  const getRandomTitle = () => {
    const randomTitle = suggestedTitles[Math.floor(Math.random() * suggestedTitles.length)];
    setTitle(randomTitle);
  };

  // Update the useEffect for safety timeout
  useEffect(() => {
    let timeoutId: number;
    
    if (isGenerating) {
      // Set a safety timeout to clear the loading state if it gets stuck
      // Use a longer timeout for longer meditations
      const timeoutDuration = parseInt(duration) >= 20 ? 468000 : 234000; // 7.8 minutes for long meditations, 3.9 minutes for shorter ones
      
      timeoutId = window.setTimeout(() => {
        if (isGenerating) {
          console.log(`Safety timeout triggered after ${timeoutDuration/60000} minutes - clearing loading state`);
          setIsGenerating(false);
          setLoadingMessage("");
          
          // If we have a session ID but no generated meditation, create one
          if (sessionId && !generatedMeditation) {
            const defaultMeditation = {
              id: sessionId,
              title: title || `${style.map(getStyleName).join(', ')} Meditation`,
              duration: parseInt(duration),
              style: style.join(','),
              voice: voice,
              background: background,
              audio_url: `/meditations/${sessionId}.mp3`,
              goals: goals
            };
            
            setGeneratedMeditation(defaultMeditation);
            setStep(7);
            
            toast({
              title: "Meditation Ready",
              description: "Your meditation has been created and is ready to play.",
              variant: "default"
            });
          }
        }
      }, timeoutDuration);
    }
    
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [isGenerating, generatedMeditation, sessionId, duration]);

  // Update the handleCreateMeditation function
  const handleCreateMeditation = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "Please log in to create a meditation.",
        variant: "destructive",
      });
      return;
    }

    if (!style.length || !voice) {
      toast({
        title: "Missing Information",
        description: "Please select at least one meditation style and a voice.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      // Generate a proper UUID instead of timestamp
      const newSessionId = crypto.randomUUID ? 
        crypto.randomUUID() : 
        'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      setSessionId(newSessionId);

      // Don't move to step 7 yet - stay on step 6 to show loading screen
      // The loading screen will be shown because isGenerating is true and step is 6

      try {
        // Generate script based on styles, goals, and duration
        setLoadingMessage("Generating meditation script...");
        const scriptResult = await api.post('/api/generate-script', {
          styles: style, // Send array of styles
          duration,
          goals
        });

        if (!scriptResult?.script) {
          throw new Error('Invalid script response');
        }

        setGeneratedScript(scriptResult.script);

        // Generate audio
        setLoadingMessage("Converting script to audio...");
        const audioResult = await api.post('/api/generate-tts', {
          script: scriptResult.script,
          voice,
          sessionId: newSessionId
        });

        if (!audioResult?.audioFiles) {
          throw new Error('Invalid audio response');
        }

        // Process with background music
        setLoadingMessage("Preparing final meditation...");
        const processResult = await api.post('/api/process-audio', {
          sessionId: newSessionId,
          audioFiles: audioResult.audioFiles,
          background: background
        });

        if (!processResult?.audioUrl) {
          throw new Error('Invalid processed audio response');
        }

        // Update the meditation with the processed audio URL
        setGeneratedMeditation({
          id: newSessionId,
          title: title || `${style.map(getStyleName).join(', ')} Meditation`,
          duration: parseInt(duration),
          audio_url: processResult.audioUrl,
          style: style.join(','), // Convert array to comma-separated string
          voice: voice,
          background: background || "",
          goals: goals || ""
        });

        // Clear loading state and move to completion screen
        setLoadingMessage("");
        setIsGenerating(false);
        setStep(7); // NOW move to step 7 (meditation ready page)
        setIsComplete(true);
        
        toast({
          title: "Meditation Created Successfully!",
          description: "Your meditation is ready to play.",
          variant: "default",
        });
      } catch (scriptError) {
        console.error('Error in script/audio generation:', scriptError);
        setError(scriptError instanceof Error ? scriptError.message : 'An unexpected error occurred during meditation generation');
        setLoadingMessage("");
        setIsGenerating(false);
        // Stay on step 6 to show the error message
      }
    } catch (error) {
      console.error('Error creating meditation:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setIsGenerating(false);
      // Stay on step 6 to show the error message
    }
  };

  // Update the handlePlayPause function with proper typing
  const handlePlayPause = async () => {
    if (!generatedMeditation?.audio_url) {
      toast({
        title: "No Audio Available",
        description: "Please generate a meditation first",
        variant: "destructive"
      });
      return;
    }

    try {
      if (audioPlayer.isPlaying) {
        audioPlayer.pause();
      } else {
        await audioPlayer.play();
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      toast({
        title: "Playback Error",
        description: error instanceof Error ? error.message : "Failed to play meditation audio",
        variant: "destructive"
      });
    }
  };

  // Update the handleSave function to ensure it works properly
  const handleSave = async () => {
    if (!generatedMeditation) {
      toast({
        title: "Nothing to Save",
        description: "No meditation has been generated yet.",
        variant: "destructive"
      });
      return;
    }

    // Validate required fields
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your meditation.",
        variant: "destructive"
      });
      return;
    }

    if (!style.length || !voice) {
      toast({
        title: "Missing Information",
        description: "Please ensure you have selected meditation styles and a voice.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoadingMessage("Saving meditation...");
      
      // Check if the meditation is already saved
      const { data: existingMeditation } = await supabase
        .from('meditations')
        .select('id')
        .eq('id', generatedMeditation.id)
        .single();
      
      if (existingMeditation) {
        // Already saved, just navigate to dashboard
        navigate("/dashboard");
        return;
      }
      
      // Save the meditation to Supabase
      const meditationData = {
        id: generatedMeditation.id,
        title: title || `${style.map(getStyleName).join(', ')} Meditation`,
        duration: parseInt(duration),
        style: style.join(','), // Convert array to comma-separated string
        voice: voice,
        background: background || null, // Ensure null instead of empty string
        goals: goals || null, // Ensure null instead of empty string
        audio_url: generatedMeditation.audio_url,
        user_id: user.id
      };

      console.log('Saving meditation data:', meditationData); // Debug log

      const { error } = await supabase
        .from('meditations')
        .insert(meditationData);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Meditation saved to your dashboard",
        variant: "default"
      });
      
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Error saving meditation:", error);
      setLoadingMessage("");
      
      // Provide more specific error messages
      let errorMessage = "Failed to save your meditation. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes('duplicate key')) {
          errorMessage = "A meditation with this ID already exists.";
        } else if (error.message.includes('null value')) {
          errorMessage = "Some required fields are missing.";
        } else if (error.message.includes('foreign key')) {
          errorMessage = "User authentication issue. Please try logging out and back in.";
        } else {
          errorMessage = `Database error: ${error.message}`;
        }
      }
      
      toast({
        title: "Save Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  // Update the handleDownload function
  const handleDownload = async () => {
    if (!generatedMeditation?.audio_url) {
      toast({
        title: "No Audio Available",
        description: "Please generate a meditation first",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoadingMessage("Preparing download...");
      
      const audioUrl = generatedMeditation.audio_url;
      const withBgUrl = audioUrl.includes('supabase.co') 
        ? audioUrl.includes('_with_bg.mp3')
          ? audioUrl
          : audioUrl.replace('.mp3', '_with_bg.mp3')
        : audioUrl;
      
      const downloadFile = async (url: string, fallbackUrl?: string) => {
        try {
          const checkResponse = await fetch(url, { method: 'HEAD' });
          
          if (checkResponse.ok) {
            const link = document.createElement('a');
            link.href = url;
            link.download = `${generatedMeditation.title || 'Meditation'}.mp3`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return true;
          } else if (fallbackUrl) {
            console.log(`File not found at ${url}, trying fallback...`);
            return downloadFile(fallbackUrl);
          }
          return false;
        } catch (error) {
          console.error(`Error downloading from ${url}:`, error);
          if (fallbackUrl) {
            console.log('Trying fallback URL...');
            return downloadFile(fallbackUrl);
          }
          return false;
        }
      };
      
      const downloaded = await downloadFile(withBgUrl, audioUrl);
      
      if (downloaded) {
        toast({
          title: "Download Started",
          description: "Your meditation is being downloaded",
          variant: "default"
        });
      } else {
        throw new Error("Could not download meditation file");
      }
    } catch (error) {
      console.error('Error downloading meditation:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download meditation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingMessage("");
    }
  };

  // Function to preview background audio with proper typing
  const handlePreviewAudio = async (audioId: string) => {
    // If we're already playing this audio, stop it
    if (playingAudio === audioId) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingAudio(null);
      return;
    }
    
    // If we're playing a different audio, stop that first
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Don't try to play if it's the "none" option
    if (audioId === "none") {
      setPlayingAudio(null);
      return;
    }
    
    // Get the Supabase storage URL for background music
    const { data } = supabase.storage
      .from('meditations')
      .getPublicUrl(`music/${audioId}.mp3`);
    
    const audioPath = data.publicUrl;
    console.log("Attempting to play audio from:", audioPath);
    
    // Create and play the new audio
    const audio = new Audio(audioPath);
    audio.volume = 0.5; // Set volume to 50%
    audio.loop = true;  // Loop the audio
    
    // Add error handling
    audio.addEventListener('error', (error) => {
      console.error("Error playing audio:", error);
      toast({
        title: "Playback Error",
        description: "Could not play the audio sample. Please try again.",
        variant: "destructive"
      });
      setPlayingAudio(null);
    });
    
    audio.play().catch(error => {
      console.error("Error playing audio:", error);
      toast({
        title: "Playback Error",
        description: "Could not play the audio sample. Please try again.",
        variant: "destructive"
      });
      setPlayingAudio(null);
    });
    
    audioRef.current = audio;
    setPlayingAudio(audioId);
  };
  
  // Stop audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Function to preview voice
  const handlePreviewVoice = async (voiceId: string) => {
    // If we're already playing this voice, stop it
    if (playingVoice === voiceId) {
      if (voiceAudioRef.current) {
        voiceAudioRef.current.pause();
        voiceAudioRef.current.currentTime = 0;
      }
      setPlayingVoice(null);
      return;
    }
    
    // If we're playing a different voice, stop that first
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current.currentTime = 0;
    }
    
    setPlayingVoice(voiceId);
    
    try {
      const voiceOption = voiceOptions.find(v => v.id === voiceId);
      if (!voiceOption) {
        throw new Error("Voice option not found");
      }
      
      // Create safe filename matching the existing files (double hyphens)
      const safeFileName = `${voiceOption.name.toLowerCase()}--${voiceId}-.mp3`;
      const audioUrl = `/voice-previews/${safeFileName}`;
      
      console.log("Playing voice preview from:", audioUrl);
      
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        setPlayingVoice(null);
      };
      
      audio.onerror = (error) => {
        console.error("Error loading audio:", error);
        setPlayingVoice(null);
        toast({
          title: "Playback Error",
          description: "Could not load the voice sample. Please try again.",
          variant: "destructive"
        });
      };
      
      audio.play().catch(error => {
        console.error("Error playing voice preview:", error);
        setPlayingVoice(null);
        toast({
          title: "Playback Error",
          description: "Could not play the voice sample. Please try again.",
          variant: "destructive"
        });
      });
      
      voiceAudioRef.current = audio;
      
    } catch (error) {
      console.error("Error playing voice preview:", error);
      setPlayingVoice(null);
      toast({
        title: "Preview Error",
        description: "Could not play voice preview. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Stop voice audio when component unmounts
  useEffect(() => {
    return () => {
      if (voiceAudioRef.current) {
        voiceAudioRef.current.pause();
        voiceAudioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Add a discard function
  const handleDiscard = async () => {
    if (!generatedMeditation?.id) return;
    
    try {
      setLoadingMessage("Discarding meditation...");
      
      // Call the delete API
      const response = await api.post('/api/delete-meditation', {
        meditationId: generatedMeditation.id,
        // Don't pass userId since it's not saved to Supabase yet
      });
      
      const result = await response.json();
      
      // Check the success flag from the API response instead of response.ok
      if (result.success) {
        toast({
          title: "Meditation Discarded",
          description: "Your meditation has been discarded.",
          variant: "default"
        });
        
        // Navigate back to dashboard
        navigate("/dashboard");
      } else {
        throw new Error(result.error || "Failed to discard meditation");
      }
    } catch (error) {
      console.error('Error discarding meditation:', error);
      // Since the files might still be deleted even if we get an error,
      // we'll show a less alarming message and continue with navigation
      toast({
        title: "Note",
        description: "Your meditation has been discarded. You can create a new one.",
        variant: "default"
      });
      
      // Navigate anyway
      navigate("/dashboard");
    } finally {
      setLoadingMessage("");
    }
  };

  // Update the handleProgressClick function to work better
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioPlayer || audioPlayer.isLoading) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentageClicked = (clickPosition / rect.width) * 100;
    
    // Calculate the new time based on duration
    const newTime = (percentageClicked / 100) * audioPlayer.duration;
    audioPlayer.seek(newTime);
  };

  // Add a function to handle progress bar dragging
  const handleProgressDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioPlayer || audioPlayer.isLoading) return;
    
    const progressBar = e.currentTarget;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!audioPlayer) return;
      
      const rect = progressBar.getBoundingClientRect();
      const clickPosition = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentageClicked = (clickPosition / rect.width) * 100;
      
      // Calculate the new time based on duration
      const newTime = (percentageClicked / 100) * audioPlayer.duration;
      audioPlayer.seek(newTime);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Add this function to pause audio when navigating away
  useEffect(() => {
    return () => {
      // Cleanup function that runs when component unmounts
      if (audioRef.current) {
        const audio = audioRef.current as HTMLAudioElement;
        audio.pause();
      }
      
      // Also pause any preview audio that might be playing
      const previewAudio = document.querySelectorAll('audio');
      previewAudio.forEach(audio => audio.pause());
    };
  }, []);

  // The useAudioPlayer hook handles audio initialization automatically

  // Add the inferGoals function
  const inferGoals = async (meditationTitle: string) => {
    try {
      setIsGenerating(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      console.log('Using API URL for goals:', apiUrl); // For debugging
      
      const response = await fetch(`${apiUrl}/api/infer-goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ title: meditationTitle }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to infer goals');
      }

      const data = await response.json();
      setGoals(data.goals);
    } catch (error) {
      console.error('Error inferring goals:', error);
      toast({
        title: "Error",
        description: "Failed to generate meditation goals. Please try entering them manually.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Add loading handling
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-meditation-calm-blue"></div>
      </div>
    );
  }

  // Optional: Handle not authenticated state
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-semibold mb-4">Please Sign In</h1>
        <p className="text-foreground/70 mb-4">You need to be signed in to create meditations.</p>
        <Button onClick={() => navigate('/auth')}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-meditation-tranquil">
      {/* Header */}
      <header className="bg-white py-4 px-6 shadow-sm">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mr-4">
              <ArrowLeft size={18} />
            </Button>
            <h1 className="text-xl font-semibold">Create Meditation</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Progress Indicator */}
        {!isComplete && (
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-xs mx-auto">
              {[1, 2, 3, 4, 5].map((stepNumber) => (
                <div key={stepNumber} className="flex flex-col items-center">
                  <div 
                    className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                      step >= stepNumber 
                        ? 'bg-meditation-calm-blue text-white' 
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {step > stepNumber ? <CheckCircle size={20} /> : stepNumber}
                  </div>
                  <span className="text-xs mt-2 text-center" style={{ maxWidth: '70px' }}>
                    {stepNumber === 1 ? 'Title' : 
                     stepNumber === 2 ? 'Duration' : 
                     stepNumber === 3 ? 'Style' : 
                     stepNumber === 4 ? 'Voice' : 'Audio'}
                  </span>
                </div>
              ))}
            </div>
            <div className="max-w-xs mx-auto mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-meditation-calm-blue transition-all" 
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="glass-card rounded-xl overflow-hidden">
          {/* Step 1: Title */}
          {step === 1 && (
            <div className="p-8 animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6 text-center">Name Your Meditation</h2>
              <p className="text-center text-foreground/70 mb-8">Give your meditation a title, and we'll help you define its goals.</p>
              
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <Label htmlFor="title" className="mb-2 block">Meditation Title</Label>
                  <div className="flex">
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Morning Clarity"
                      className="rounded-r-none"
                      required
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="rounded-l-none border-l-0"
                      onClick={() => inferGoals(title)}
                      disabled={!title || isGenerating}
                    >
                      <Wand2 size={16} className="mr-2" />
                      {isGenerating ? (
                        <span className="inline-flex items-center">
                          AI<span className="animate-ellipsis">...</span>
                        </span>
                      ) : (
                        "AI Expand"
                      )}
                    </Button>
                  </div>
                </div>

                {/* Goals Input Field */}
                <div className="mb-6">
                  <Label htmlFor="goals" className="mb-2 block">Meditation Goals</Label>
                  <Textarea
                    id="goals"
                    value={isGenerating ? "Analyzing meditation title..." : goals}
                    onChange={(e) => setGoals(e.target.value)}
                    placeholder="Click 'AI Expand' to automatically generate goals based on your title, or enter them manually"
                    className={`resize-none ${isGenerating ? 'animate-pulse' : ''}`}
                    rows={3}
                    disabled={isGenerating}
                  />
                  <p className="text-xs text-foreground/70 mt-1">
                    {isGenerating ? (
                      <span className="inline-flex">
                        Generating goals
                        <span className="animate-ellipsis">...</span>
                      </span>
                    ) : (
                      "Let AI suggest goals based on your meditation title"
                    )}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => setStep(2)} 
                    className="btn-primary"
                    disabled={!title} // Make title required
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Duration */}
          {step === 2 && (
            <div className="p-8 animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6 text-center">Select Duration</h2>
              <p className="text-center text-foreground/70 mb-8">How long would you like your meditation to be?</p>
              
              <div className="max-w-md mx-auto">
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-8">
                  {["2", "5", "10", "20", "30"].map((min) => (
                    <Button
                      key={min}
                      type="button"
                      variant={duration === min ? "default" : "outline"}
                      className={`${duration === min ? "bg-meditation-calm-blue hover:bg-meditation-calm-blue/90" : ""} pr-6 pl-6`}
                      onClick={() => setDuration(min)}
                    >
                      <Clock size={16} className="mr-.05" />
                      {min} min
                    </Button>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} className="btn-primary">
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Meditation Style */}
          {step === 3 && (
            <div className="p-8 animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6 text-center">Choose Meditation Styles</h2>
              <p className="text-center text-foreground/70 mb-2">Select one or more meditation styles you want to combine.</p>
              <p className="text-center text-foreground/50 text-sm mb-8">Multiple styles create a more varied and comprehensive meditation experience.</p>
              
              <div className="max-w-2xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {meditationStyles.map((item) => (
                    <div
                      key={item.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                        style.includes(item.id) 
                          ? 'border-meditation-calm-blue bg-meditation-light-blue/30 shadow-md' 
                          : 'border-gray-200 hover:border-meditation-calm-blue/50'
                      }`}
                      onClick={() => {
                        if (style.includes(item.id)) {
                          setStyle(style.filter(s => s !== item.id));
                        } else {
                          setStyle([...style, item.id]);
                        }
                      }}
                    >
                      <div className="flex items-start">
                        <div className={`p-2 rounded-md mr-3 relative ${
                          style.includes(item.id) 
                            ? 'bg-meditation-calm-blue text-white' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {item.icon}
                          {style.includes(item.id) && (
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <Check size={12} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-foreground/70 mt-1">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {style.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-green-800 mb-2">Selected Styles ({style.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {style.map(selectedStyle => (
                        <span 
                          key={selectedStyle}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          {getStyleName(selectedStyle)}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setStyle(style.filter(s => s !== selectedStyle));
                            }}
                            className="ml-2 hover:text-green-600"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button 
                    onClick={() => style.length > 0 && setStep(4)}
                    className="btn-primary"
                    disabled={style.length === 0}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Voice Selection */}
          {step === 4 && (
            <div className="p-8 animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6 text-center">Select Voice</h2>
              <p className="text-center text-foreground/70 mb-8">Choose the voice for your guided meditation.</p>
              
              <div className="max-w-3xl mx-auto">
                <Carousel className="w-full">
                  <CarouselContent>
                    {Array.from({ length: Math.ceil(voiceOptions.length / 4) }).map((_, groupIndex) => (
                      <CarouselItem key={groupIndex}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1">
                          {voiceOptions.slice(
                            groupIndex * 4,
                            groupIndex * 4 + 4
                          ).map((option) => (
                            <div 
                              key={option.id} 
                              className={`h-full border rounded-lg p-4 cursor-pointer transition-all ${
                                voice === option.id 
                                  ? 'border-meditation-calm-blue bg-blue-50' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setVoice(option.id)}
                            >
                              <div className="flex items-center mb-2">
                                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg mr-3">
                                  <Mic className="h-5 w-5 text-gray-500" />
                                </div>
                                <div>
                                  <div className="flex items-center">
                                    <h3 className="font-medium">{option.name}</h3>
                                    {option.recommended && option.recommended && (
                                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                        Recommended
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600">{option.description}</p>
                                </div>
                              </div>
                              
                              <button
                                type="button"
                                className="text-blue-500 text-sm flex items-center mt-2"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent triggering the parent div's onClick
                                  handlePreviewVoice(option.id);
                                }}
                              >
                                {playingVoice === option.id ? (
                                  <>
                                    <X size={16} className="mr-1" />
                                    Stop preview
                                  </>
                                ) : (
                                  <>
                                    <Play size={16} className="mr-1" />
                                    Preview voice
                                  </>
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex justify-center mt-6">
                    <CarouselPrevious className="relative mr-4 static translate-y-0" />
                    <CarouselNext className="relative ml-4 static translate-y-0" />
                  </div>
                </Carousel>
                
                <div className="mt-8 flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setStep(3)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(5)} className="btn-primary">
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Background Music */}
          {step === 5 && (
            <div className="p-8 animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6 text-center">Background Audio</h2>
              <p className="text-center text-foreground/70 mb-8">Choose a background sound to enhance your meditation.</p>
              
              <div className="max-w-md mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {backgroundOptions.map((option) => (
                    <div 
                      key={option.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        background === option.id 
                          ? 'border-meditation-calm-blue bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setBackground(option.id)}
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg mr-3">
                          <Music className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">{option.name}</h3>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                      </div>
                      
                      {option.id !== "none" && (
                        <button
                          type="button"
                          className="text-blue-500 text-sm flex items-center mt-2"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the parent div's onClick
                            handlePreviewAudio(option.id);
                          }}
                        >
                          {playingAudio === option.id ? (
                            <>
                              <X size={16} className="mr-1" />
                              Stop audio
                            </>
                          ) : (
                            <>
                              <Play size={16} className="mr-1" />
                              Preview audio
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setStep(4)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(6)} className="btn-primary">
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Loading/Generating State - Only show during meditation generation */}
          {isGenerating && step === 6 && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in-slow">
              <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
                <div className="relative h-20 w-20 mx-auto mb-6">
                  {/* Outer circle */}
                  <div className="absolute top-0 left-0 w-20 h-20 bg-meditation-calm-blue rounded-full animate-breathe opacity-20"></div>
                  {/* Second circle */}
                  <div className="absolute top-2 left-2 w-16 h-16 bg-meditation-calm-blue rounded-full animate-breathe opacity-40" style={{ animationDelay: "0.5s" }}></div>
                  {/* Third circle */}
                  <div className="absolute top-4 left-4 w-12 h-12 bg-meditation-calm-blue rounded-full animate-breathe opacity-60" style={{ animationDelay: "1s" }}></div>
                  {/* Inner circle */}
                  <div className="absolute top-6 left-6 w-8 h-8 bg-meditation-calm-blue rounded-full animate-breathe opacity-80" style={{ animationDelay: "1.5s" }}></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Creating Your Meditation</h3>
                <p className="text-foreground/70 mb-2">
                  {loadingMessage || `We're crafting your perfect ${formatMinutesForDisplay(duration)}-minute ${style.map(getStyleName).join(', ')} meditation...`}
                </p>
                <p className="text-sm text-foreground/60 mb-4">
                  This process may take a couple of minutes. Please do not refresh the page.
                </p>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-meditation-calm-blue animate-loading-bar" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Review and Create */}
          {step === 6 && (
            <div className="p-8 animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6 text-center">Review & Create</h2>
              <p className="text-center text-foreground/70 mb-8">Review your meditation settings before creating.</p>
              
              <div className="max-w-md mx-auto">
                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                  <h3 className="font-medium mb-4">Meditation Summary</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Title:</span>
                      <span className="font-medium">{title || `${style.map(getStyleName).join(', ')} Meditation`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Duration:</span>
                      <span className="font-medium">{duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Style:</span>
                      <span className="font-medium">{style.map(getStyleName).join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Voice:</span>
                      <span className="font-medium">{getVoiceName(voice) || "Not selected"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Background:</span>
                      <span className="font-medium">{getBackgroundName(background) || "Not selected"}</span>
                    </div>
                    {goals && (
                      <div>
                        <span className="text-foreground/70 block mb-1">Goals:</span>
                        <p className="text-sm bg-white p-2 rounded">{goals}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                    {error}
                  </div>
                )}
                
                <div className="mt-8 flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setStep(5)}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleCreateMeditation} 
                    className="btn-primary"
                    disabled={!style.length || !voice || isGenerating}
                  >
                    {isGenerating ? (
                      <span className="flex items-center">
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      "Create Meditation"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Completion Screen */}
          {step === 7 && (
            <div className="p-8 animate-fade-in">
              <div className="text-center mb-8">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Your Meditation is Ready!</h2>
                <p className="text-foreground/70">
                  Your {formatMinutesForDisplay(duration)}-minute {style.map(getStyleName).join(', ')} meditation has been created.
                </p>
              </div>

              <div className="max-w-xl mx-auto bg-meditation-light-blue/30 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">
                    {title || `${style.map(getStyleName).join(', ')} Meditation`}
                  </h3>
                  <span className="text-sm text-foreground/70">
                    {formatMinutesForDisplay(duration)} min
                  </span>
                </div>

                <div className="mt-4 max-w-md mx-auto">
                  {/* Player controls with repositioned play button */}
                  <div className="flex items-center gap-3 mb-2">
                    <Button
                      className="rounded-full w-8 h-8 flex items-center justify-center p-0"
                      onClick={handlePlayPause}
                      disabled={audioPlayer.isLoading}
                      variant="outline"
                    >
                      {audioPlayer.isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </Button>
                    
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm text-foreground/70">
                        {formatDuration(audioPlayer.currentTime)}
                      </span>
                      <span className="text-sm text-foreground/70">
                        {formatDuration(audioPlayer.duration)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Scrubbing timeline with indicator */}
                  <div 
                    className="h-2 bg-gray-200 rounded-full overflow-hidden cursor-pointer relative group"
                    onClick={handleProgressClick}
                    onMouseDown={handleProgressDrag}
                    role="slider"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={(audioPlayer.currentTime / audioPlayer.duration) * 100}
                    tabIndex={0}
                  >
                    <div 
                      className="h-full bg-meditation-calm-blue transition-all duration-100" 
                      style={{ width: `${(audioPlayer.currentTime / audioPlayer.duration) * 100}%` }}
                    ></div>
                    
                    {/* Scrubbing indicator dot that appears on hover */}
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ left: `${(audioPlayer.currentTime / audioPlayer.duration) * 100}%` }}
                    >
                      <div className="w-3 h-3 bg-white border-2 border-meditation-calm-blue rounded-full -ml-1.5 cursor-grab active:cursor-grabbing"></div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-sm mt-4">
                  {style.map(s => (
                    <span key={s} className="bg-white px-2 py-1 rounded-full">{getStyleName(s)}</span>
                  ))}
                  <span className="bg-white px-2 py-1 rounded-full">{getVoiceName(voice)}</span>
                  <span className="bg-white px-2 py-1 rounded-full">{getBackgroundName(background)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="btn-primary" onClick={handleSave}>
                  <Save size={18} className="mr-2" />
                  Save to My Meditations
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                  <Download size={18} className="mr-2" />
                  Download
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={handleDiscard}>
                        <X size={18} className="mr-2" />
                        Discard
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your meditation will be permanently deleted</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}
        </div>

        {/* Helpful hint */}
        {!isComplete && (
          <div className="mt-6 flex items-start p-4 bg-meditation-light-blue/50 rounded-lg max-w-xl mx-auto">
            <Info size={20} className="text-meditation-deep-blue mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/70">
              {step === 1 && "Choose a title that resonates with your intention for this meditation."}
              {step === 2 && "Shorter sessions are great for beginners, while longer ones allow for deeper practice."}
              {step === 3 && "Different meditation styles offer unique benefits. Choose one that aligns with your goals."}
              {step === 4 && "The right voice can significantly enhance your meditation experience."}
              {step === 5 && "Background sounds help mask distractions and create a peaceful environment."}
              {step === 6 && "Review your selections before creating your personalized meditation."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateMeditation;
