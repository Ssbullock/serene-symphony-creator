import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Clock, CheckCircle, Mic, Music, Play, Save, Download, X, Info, ChevronLeft, ChevronRight } from "lucide-react";
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

const CreateMeditation = () => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("10");
  const [style, setStyle] = useState("");
  const [voice, setVoice] = useState("");
  const [background, setBackground] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [goals, setGoals] = useState("");
  const [generatedMeditation, setGeneratedMeditation] = useState(null);
  const [error, setError] = useState("");
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const isMobile = useIsMobile();
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);

  // Get random suggested titles
  const getRandomTitle = () => {
    const randomTitle = suggestedTitles[Math.floor(Math.random() * suggestedTitles.length)];
    setTitle(randomTitle);
  };

  // Handle generate meditation
  const handleCreateMeditation = async () => {
    setIsGenerating(true);
    
    try {
      // Prepare the data for the API
      const meditationData = {
        title: title || `${getStyleName(style)} Meditation`,
        duration: duration,
        goals: goals,
        style: style,
        voice: voice,
        backgroundMusic: background !== "none" ? `/music/${background}.mp3` : null
      };
      
      // Call the generate-meditation endpoint
      const response = await fetch('/api/generate-meditation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meditationData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate meditation');
      }
      
      const data = await response.json();
      
      // Update the meditation data with the response
      setGeneratedMeditation({
        id: data.id,
        title: data.title,
        audioUrl: data.audioUrl,
        duration: data.duration
      });
      
      setIsGenerating(false);
      setStep(7); // Move to success screen
      
    } catch (error) {
      console.error('Error generating meditation:', error);
      setIsGenerating(false);
      setError('Failed to generate your meditation. Please try again.');
    }
  };

  // Handle saving meditation
  const handleSave = () => {
    toast({
      title: "Meditation saved",
      description: "Your meditation has been added to your library."
    });
    navigate("/dashboard");
  };

  // Function to preview background audio
  const handlePreviewAudio = (audioId: string) => {
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
    
    // Create the correct path to the audio file
    const audioPath = `/music/${audioId}.mp3`;
    console.log("Attempting to play audio from:", audioPath);
    
    // Create and play the new audio
    const audio = new Audio(audioPath);
    audio.volume = 0.5; // Set volume to 50%
    audio.loop = true;  // Loop the audio
    audio.play().catch(error => {
      console.error("Error playing audio:", error);
      toast({
        title: "Playback Error",
        description: "Could not play the audio sample. Please try again.",
        variant: "destructive"
      });
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
      // Find the voice option to get the name
      const voiceOption = voiceOptions.find(v => v.id === voiceId);
      if (!voiceOption) {
        throw new Error("Voice option not found");
      }
      
      // Create safe filename from voice name
      const safeFileName = voiceOption.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const audioUrl = `http://localhost:3000/voice-previews/${safeFileName}.mp3`;
      
      console.log("Playing voice preview from:", audioUrl);
      
      // Create and play the audio
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

  // Add this function to generate the script
  const generateMeditationScript = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          duration,
          goals,
          style,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate meditation script');
      }

      const data = await response.json();
      console.log("Generated Meditation Script:", data.script);
      setGeneratedScript(data.script);
      
    } catch (error) {
      console.error('Error generating meditation script:', error);
      toast({
        title: "Script Generation Error",
        description: "Failed to generate meditation script. Please try again.",
        variant: "destructive"
      });
    }
  };

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
              <p className="text-center text-foreground/70 mb-8">Give your meditation a title, or use one of our suggestions.</p>
              
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <Label htmlFor="title" className="mb-2 block">Meditation Title (Optional)</Label>
                  <div className="flex">
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Morning Clarity"
                      className="rounded-r-none"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="rounded-l-none border-l-0"
                      onClick={getRandomTitle}
                    >
                      <RefreshCw size={16} className={title ? "mr-2" : ""} />
                      {title ? "New" : ""}
                    </Button>
                  </div>
                </div>

                {/* Add Goals Input Field */}
                <div className="mb-6">
                  <Label htmlFor="goals" className="mb-2 block">Meditation Goals</Label>
                  <Textarea
                    id="goals"
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    placeholder="e.g. Reduce stress, improve focus, find inner peace"
                    className="resize-none"
                    rows={3}
                  />
                  <p className="text-xs text-foreground/70 mt-1">
                    Describe what you want to achieve with this meditation
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                    Cancel
                  </Button>
                  <Button onClick={() => setStep(2)} className="btn-primary">
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
                      className={duration === min ? "bg-meditation-calm-blue hover:bg-meditation-calm-blue/90" : ""}
                      onClick={() => setDuration(min)}
                    >
                      <Clock size={16} className="mr-2" />
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
              <h2 className="text-2xl font-semibold mb-6 text-center">Choose Meditation Style</h2>
              <p className="text-center text-foreground/70 mb-8">Select the type of meditation experience you want.</p>
              
              <div className="max-w-2xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {meditationStyles.map((item) => (
                    <div
                      key={item.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                        style === item.id 
                          ? 'border-meditation-calm-blue bg-meditation-light-blue/30' 
                          : 'border-gray-200 hover:border-meditation-calm-blue/50'
                      }`}
                      onClick={() => setStyle(item.id)}
                    >
                      <div className="flex items-start">
                        <div className={`p-2 rounded-md mr-3 ${
                          style === item.id 
                            ? 'bg-meditation-calm-blue text-white' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-foreground/70 mt-1">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button 
                    onClick={async () => {
                      if (style) {
                        await generateMeditationScript();
                        setStep(4);
                      }
                    }} 
                    className="btn-primary"
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
                                    {option.recommended === style && option.recommended && (
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
                      <span className="font-medium">{title || `${getStyleName(style)} Meditation`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Duration:</span>
                      <span className="font-medium">{duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Style:</span>
                      <span className="font-medium">{getStyleName(style) || "Not selected"}</span>
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
                    disabled={!style || !voice || isGenerating}
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

          {/* Loading/Generating State */}
          {isGenerating && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in-slow">
              <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
                <div className="relative h-20 w-20 bg-meditation-calm-blue rounded-full mx-auto mb-6">
                  <div className="absolute inset-0 bg-meditation-calm-blue rounded-full animate-breathe opacity-20"></div>
                  <div className="absolute inset-2 bg-meditation-calm-blue rounded-full animate-breathe opacity-40" style={{ animationDelay: "0.5s" }}></div>
                  <div className="absolute inset-4 bg-meditation-calm-blue rounded-full animate-breathe opacity-60" style={{ animationDelay: "1s" }}></div>
                  <div className="absolute inset-6 bg-meditation-calm-blue rounded-full animate-breathe opacity-80" style={{ animationDelay: "1.5s" }}></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Creating Your Meditation</h3>
                <p className="text-foreground/70 mb-4">
                  We're crafting your perfect {duration}-minute {getStyleName(style)} meditation...
                </p>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-meditation-calm-blue animate-pulse-soft" style={{ width: '60%' }}></div>
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
                  Your {duration}-minute {getStyleName(style)} meditation has been created.
                </p>
              </div>

              <div className="max-w-xl mx-auto bg-meditation-light-blue/30 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">
                    {title || `${getStyleName(style)} Meditation`}
                  </h3>
                  <span className="text-sm text-foreground/70">{duration} min</span>
                </div>

                <div className="bg-white rounded-lg p-3 mb-4 flex items-center gap-3">
                  <div className="h-10 w-10 bg-meditation-calm-blue rounded-full flex items-center justify-center">
                    <Play className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="h-1.5 bg-gray-100 rounded-full">
                      <div className="h-full w-0 bg-meditation-calm-blue rounded-full"></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-foreground/70">0:00</span>
                      <span className="text-xs text-foreground/70">{duration}:00</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="bg-white px-2 py-1 rounded-full">{getStyleName(style)}</span>
                  <span className="bg-white px-2 py-1 rounded-full">{getVoiceName(voice)}</span>
                  <span className="bg-white px-2 py-1 rounded-full">{getBackgroundName(background)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="btn-primary" onClick={handleSave}>
                  <Save size={18} className="mr-2" />
                  Save to My Meditations
                </Button>
                <Button variant="outline">
                  <Download size={18} className="mr-2" />
                  Download
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={() => navigate("/dashboard")}>
                        <X size={18} className="mr-2" />
                        Discard
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your meditation will not be saved</p>
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

