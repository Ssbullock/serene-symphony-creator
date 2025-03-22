import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Play, Pause, Save, Download, Info, 
  Music, FileText, Mic, Wand2, ChevronDown, CheckCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

const meditationStyles = [
  {
    id: "mindfulness",
    name: "Mindfulness",
    description: "Present-moment awareness without judgment"
  },
  {
    id: "breathwork",
    name: "Breathwork",
    description: "Guided breathing techniques for calm and focus"
  },
  {
    id: "bodyscan",
    name: "Body Scan",
    description: "Progressive relaxation through body awareness"
  },
  {
    id: "visualization",
    name: "Nature Visualization",
    description: "Mental imagery for deep relaxation"
  }
];

const durationOptions = [
  { value: "2", label: "2 minutes" },
  { value: "5", label: "5 minutes" },
  { value: "10", label: "10 minutes" },
  { value: "15", label: "15 minutes" },
  { value: "20", label: "20 minutes" },
  { value: "30", label: "30 minutes" }
];

const voiceOptions = [
  { id: "alloy", name: "Emma", description: "Warm and soothing female voice" },
  { id: "echo", name: "James", description: "Deep and calming male voice" },
  { id: "nova", name: "Lily", description: "Soft and gentle female voice" },
  { id: "onyx", name: "David", description: "Clear and focused male voice" },
  { id: "shimmer", name: "Sophie", description: "Bright and optimistic female voice" },
  { id: "fable", name: "Felix", description: "Warm storyteller voice" },
  { id: "coral", name: "Claire", description: "Expressive and engaging female voice" },
  { id: "sage", name: "Sam", description: "Wise and thoughtful voice" },
  { id: "ash", name: "Alex", description: "Neutral and versatile voice" }
];

const backgroundOptions = [
  { id: "rain", name: "Gentle Rain", description: "Soft rainfall soundscape" },
  { id: "ocean", name: "Ocean Waves", description: "Rhythmic wave sounds" },
  { id: "forest", name: "Forest Ambience", description: "Birds and gentle breeze" },
  { id: "meditative", name: "Meditative", description: "Calming ambient tones for deep meditation" },
  { id: "none", name: "No Background", description: "Voice guidance only" }
];

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

const AdvancedCreateMeditation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("10");
  const [style, setStyle] = useState("");
  const [goals, setGoals] = useState("");
  const [generatedScript, setGeneratedScript] = useState("");
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [voice, setVoice] = useState("");
  const [vibe, setVibe] = useState("");
  const [editedVibe, setEditedVibe] = useState("");
  const [background, setBackground] = useState("");
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  const [playingBackground, setPlayingBackground] = useState<string | null>(null);

  const getRandomTitle = () => {
    const randomTitle = suggestedTitles[Math.floor(Math.random() * suggestedTitles.length)];
    setTitle(randomTitle);
  };

  const handleGenerateScript = async () => {
    if (!style || !duration) {
      toast({
        title: "Missing fields",
        description: "Please select a meditation style and duration.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingScript(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const styleName = meditationStyles.find(s => s.id === style)?.name || style;
      const mockScript = `Welcome to this ${duration}-minute ${styleName} meditation. 
      
Find a comfortable position, either sitting or lying down, where you can remain alert yet relaxed.
      
Begin by taking a few deep breaths. Inhale slowly through your nose, filling your lungs completely, and exhale through your mouth, letting go of any tension.
      
${goals ? `Today, we'll focus on ${goals}. ` : ''}
      
As we begin this journey together, allow yourself to be fully present in this moment. There's nowhere else you need to be, nothing else you need to do.
      
(Continues with detailed ${styleName} meditation guidance for ${duration} minutes...)
      
Now, slowly bring your awareness back to your surroundings. Wiggle your fingers and toes, and when you're ready, gently open your eyes.
      
Thank you for taking this time for yourself today.`;
      
      setGeneratedScript(mockScript);
    } catch (error) {
      console.error("Error generating script:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate meditation script. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleGenerateVibe = async () => {
    if (!vibe) {
      toast({
        title: "Missing vibe",
        description: "Please enter a vibe description.",
        variant: "destructive"
      });
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const expandedVibe = `The meditation should have a ${vibe} vibe. This means:
      
- The tone should be ${vibe.includes("calm") ? "soothing and gentle" : vibe.includes("energetic") ? "uplifting and invigorating" : "balanced and centered"}
- The pacing should be ${vibe.includes("slow") ? "unhurried with longer pauses" : vibe.includes("quick") ? "moderately paced with shorter pauses" : "natural with comfortable pauses"}
- The language should be ${vibe.includes("simple") ? "accessible and straightforward" : vibe.includes("poetic") ? "imagery-rich and flowing" : "clear and supportive"}
- The emotional quality should feel ${vibe.includes("happy") ? "optimistic and light" : vibe.includes("serious") ? "grounded and meaningful" : "authentic and reassuring"}

This vibe should be consistent throughout the meditation, helping the listener to feel ${vibe} from beginning to end.`;
      
      setEditedVibe(expandedVibe);
    } catch (error) {
      console.error("Error expanding vibe:", error);
      toast({
        title: "Generation failed",
        description: "Failed to expand vibe description. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleGenerateAudio = async () => {
    if (!generatedScript || !voice) {
      toast({
        title: "Missing requirements",
        description: "Please generate a script and select a voice first.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingAudio(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAudioUrl("/voice-previews/emma.mp3");
    } catch (error) {
      console.error("Error generating audio:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate meditation audio. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleTogglePlay = () => {
    if (!audioUrl) return;
    
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.error("Error playing audio:", err);
          toast({
            title: "Playback Error",
            description: "Could not play the audio. Please try again.",
            variant: "destructive"
          });
        });
      }
    }
  };

  const handlePreviewBackground = (audioId: string) => {
    if (playingBackground === audioId) {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current.currentTime = 0;
      }
      setPlayingBackground(null);
      return;
    }
    
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
      backgroundAudioRef.current.currentTime = 0;
    }
    
    if (audioId === "none") {
      setPlayingBackground(null);
      return;
    }
    
    const audioPath = `/music/${audioId}.mp3`;
    
    const audio = new Audio(audioPath);
    audio.volume = 0.5;
    audio.loop = true;
    audio.play().catch(error => {
      console.error("Error playing audio:", error);
      toast({
        title: "Playback Error",
        description: "Could not play the audio sample. Please try again.",
        variant: "destructive"
      });
    });
    
    backgroundAudioRef.current = audio;
    setPlayingBackground(audioId);
  };

  const handleSave = async () => {
    if (!title || !audioUrl) {
      toast({
        title: "Missing requirements",
        description: "Please generate audio and provide a title before saving.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Meditation saved",
        description: "Your meditation has been added to your library."
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving meditation:", error);
      toast({
        title: "Save failed",
        description: "Failed to save meditation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) {
      toast({
        title: "Nothing to download",
        description: "Please generate audio first before downloading.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Download started",
      description: "Your meditation is being downloaded."
    });
  };

  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.addEventListener("play", () => setIsPlaying(true));
      audio.addEventListener("pause", () => setIsPlaying(false));
      audio.addEventListener("ended", () => setIsPlaying(false));
      
      audio.addEventListener("timeupdate", () => {
        const progressValue = (audio.currentTime / audio.duration) * 100;
        setProgress(progressValue);
      });
      
      audioRef.current = audio;
      
      return () => {
        audio.pause();
        audio.removeEventListener("play", () => setIsPlaying(true));
        audio.removeEventListener("pause", () => setIsPlaying(false));
        audio.removeEventListener("ended", () => setIsPlaying(false));
        audio.removeEventListener("timeupdate", () => {});
      };
    }
  }, [audioUrl]);

  useEffect(() => {
    return () => {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-meditation-tranquil">
      <header className="bg-white py-4 px-6 shadow-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mr-4">
              <ArrowLeft size={18} />
            </Button>
            <h1 className="text-xl font-semibold">Advanced Meditation Creator</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="glass-card rounded-xl p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-6">1. Create Your Meditation</h2>
              
              <div className="mb-6">
                <Label htmlFor="title" className="mb-2 block">Meditation Title</Label>
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
                    Suggest
                  </Button>
                </div>
              </div>
              
              <div className="mb-6">
                <Label htmlFor="style" className="mb-2 block">Meditation Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger id="style" className="w-full">
                    <SelectValue placeholder="Select a style" />
                  </SelectTrigger>
                  <SelectContent>
                    {meditationStyles.map((styleOption) => (
                      <SelectItem key={styleOption.id} value={styleOption.id}>
                        <div className="flex flex-col">
                          <span>{styleOption.name}</span>
                          <span className="text-xs text-muted-foreground">{styleOption.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-6">
                <Label htmlFor="duration" className="mb-2 block">Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger id="duration" className="w-full">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-6">
                <Label htmlFor="goals" className="mb-2 block">Meditation Goals</Label>
                <Textarea
                  id="goals"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="e.g. Reduce stress, improve focus, find inner peace"
                  className="resize-none h-24"
                />
                <p className="text-xs text-foreground/70 mt-1">
                  Describe what you want to achieve with this meditation
                </p>
              </div>
              
              <Button 
                className="w-full mb-6" 
                onClick={handleGenerateScript}
                disabled={isGeneratingScript || !style || !duration}
              >
                {isGeneratingScript ? (
                  <>
                    <span className="mr-2">Generating...</span>
                    <span className="animate-spin">⟳</span>
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Meditation Script
                  </>
                )}
              </Button>
              
              <div className="mb-6">
                <Label htmlFor="script" className="mb-2 flex justify-between">
                  <span>Meditation Script</span>
                  {generatedScript && (
                    <span className="text-xs text-foreground/70">Editable</span>
                  )}
                </Label>
                <Textarea
                  id="script"
                  value={generatedScript}
                  onChange={(e) => setGeneratedScript(e.target.value)}
                  placeholder="Your generated script will appear here..."
                  className="resize-none h-64 font-light"
                  disabled={isGeneratingScript}
                />
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-6">2. Create Your Audio</h2>
              
              <div className="mb-6">
                <Label htmlFor="voice" className="mb-2 block">Select Voice</Label>
                <Select value={voice} onValueChange={setVoice}>
                  <SelectTrigger id="voice" className="w-full">
                    <SelectValue placeholder="Choose a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {voiceOptions.map((voiceOption) => (
                      <SelectItem key={voiceOption.id} value={voiceOption.id}>
                        <div className="flex flex-col">
                          <span>{voiceOption.name}</span>
                          <span className="text-xs text-muted-foreground">{voiceOption.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-6">
                <Label htmlFor="vibe" className="mb-2 block">Meditation Vibe</Label>
                <div className="flex">
                  <Input
                    id="vibe"
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value)}
                    placeholder="e.g. calm and uplifting"
                    className="rounded-r-none"
                  />
                  <Button 
                    type="button" 
                    onClick={handleGenerateVibe}
                    className="rounded-l-none" 
                    disabled={!vibe}
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    Expand
                  </Button>
                </div>
                <p className="text-xs text-foreground/70 mt-1">
                  Describe the mood and atmosphere for your meditation
                </p>
              </div>
              
              {editedVibe && (
                <div className="mb-6">
                  <Label htmlFor="expandedVibe" className="mb-2 flex justify-between">
                    <span>Expanded Vibe</span>
                    <span className="text-xs text-foreground/70">Editable</span>
                  </Label>
                  <Textarea
                    id="expandedVibe"
                    value={editedVibe}
                    onChange={(e) => setEditedVibe(e.target.value)}
                    className="resize-none h-40"
                  />
                </div>
              )}
              
              <div className="mb-6">
                <Label htmlFor="background" className="mb-2 block">Background Music</Label>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Select value={background} onValueChange={setBackground}>
                      <SelectTrigger id="background">
                        <SelectValue placeholder="Choose background" />
                      </SelectTrigger>
                      <SelectContent>
                        {backgroundOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            <div className="flex flex-col">
                              <span>{option.name}</span>
                              <span className="text-xs text-muted-foreground">{option.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {background && background !== "none" && (
                    <Button
                      variant="outline"
                      onClick={() => handlePreviewBackground(background)}
                    >
                      {playingBackground === background ? "Stop" : "Preview"}
                    </Button>
                  )}
                </div>
              </div>
              
              <Button 
                className="w-full mb-6" 
                onClick={handleGenerateAudio}
                disabled={isGeneratingAudio || !generatedScript || !voice}
              >
                {isGeneratingAudio ? (
                  <>
                    <span className="mr-2">Generating Audio...</span>
                    <span className="animate-spin">⟳</span>
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    Generate Meditation Audio
                  </>
                )}
              </Button>
              
              {audioUrl && (
                <div className="mb-8 bg-meditation-light-blue/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">
                      {title || "Your Meditation"}
                    </h3>
                    <span className="text-sm text-foreground/70">{duration} min</span>
                  </div>
                  
                  <div className="mb-4">
                    <Button
                      onClick={handleTogglePlay}
                      className="w-full flex items-center justify-center h-12 bg-meditation-calm-blue hover:bg-meditation-calm-blue/90"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="mr-2 h-5 w-5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-5 w-5" />
                          Play Meditation
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <Progress value={progress} className="h-2 mb-2" />
                  
                  <div className="flex justify-between text-xs text-foreground/70">
                    <span>0:00</span>
                    <span>{duration}:00</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-sm mt-4">
                    {style && <span className="bg-white px-2 py-1 rounded-full">{meditationStyles.find(s => s.id === style)?.name || style}</span>}
                    {voice && <span className="bg-white px-2 py-1 rounded-full">{voiceOptions.find(v => v.id === voice)?.name || voice}</span>}
                    {background && background !== "none" && <span className="bg-white px-2 py-1 rounded-full">{backgroundOptions.find(b => b.id === background)?.name || background}</span>}
                  </div>
                </div>
              )}
              
              {audioUrl && (
                <div className="flex flex-wrap gap-3">
                  <Button 
                    className="flex-1 min-w-[120px]" 
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving..." : "Save to Library"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 min-w-[120px]"
                    onClick={handleDownload}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex items-start p-4 bg-meditation-light-blue/50 rounded-lg max-w-3xl mx-auto">
          <Info size={20} className="text-meditation-deep-blue mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/70">
            The advanced creator gives you more control over your meditation. Start by creating a script, then customize the voice and vibe. 
            You can edit the generated script and vibe description to perfect your meditation experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCreateMeditation;
