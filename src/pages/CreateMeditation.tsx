
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Clock, CheckCircle, Mic, Music, Play, Save, Download, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

const voiceOptions = [
  { id: "emma", name: "Emma", description: "Warm and soothing female voice", recommended: "mindfulness" },
  { id: "james", name: "James", description: "Deep and calming male voice", recommended: "breathwork" },
  { id: "lily", name: "Lily", description: "Soft and gentle female voice", recommended: "bodyscan" },
  { id: "david", name: "David", description: "Clear and focused male voice", recommended: "visualization" }
];

const backgroundOptions = [
  { id: "rain", name: "Gentle Rain", description: "Soft rainfall soundscape" },
  { id: "ocean", name: "Ocean Waves", description: "Rhythmic wave sounds" },
  { id: "forest", name: "Forest Ambience", description: "Birds and gentle breeze" },
  { id: "whitenoise", name: "White Noise", description: "Consistent ambient sound" },
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

  // Get random suggested titles
  const getRandomTitle = () => {
    const randomTitle = suggestedTitles[Math.floor(Math.random() * suggestedTitles.length)];
    setTitle(randomTitle);
  };

  // Handle generate meditation
  const handleGenerate = () => {
    if (!style || !voice || !background) {
      toast({
        title: "Please complete all fields",
        description: "All options need to be selected before generating.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsGenerating(false);
      setIsComplete(true);
    }, 3000);
  };

  // Handle saving meditation
  const handleSave = () => {
    toast({
      title: "Meditation saved",
      description: "Your meditation has been added to your library."
    });
    navigate("/dashboard");
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
              
              <div className="max-w-xl mx-auto">
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
                  <Button onClick={() => setStep(4)} className="btn-primary">
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
              
              <div className="max-w-xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {voiceOptions.map((item) => (
                    <div
                      key={item.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                        voice === item.id 
                          ? 'border-meditation-calm-blue bg-meditation-light-blue/30' 
                          : 'border-gray-200 hover:border-meditation-calm-blue/50'
                      }`}
                      onClick={() => setVoice(item.id)}
                    >
                      <div className="flex items-start">
                        <div className={`p-2 rounded-md mr-3 ${
                          voice === item.id 
                            ? 'bg-meditation-calm-blue text-white' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          <Mic size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{item.name}</h3>
                            {item.recommended === style && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-foreground/70 mt-1">{item.description}</p>
                          <button className="text-xs text-meditation-deep-blue mt-2 flex items-center">
                            <Play size={12} className="mr-1" /> 
                            Preview voice
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

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

          {/* Step 5: Background Audio */}
          {step === 5 && (
            <div className="p-8 animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6 text-center">Background Audio</h2>
              <p className="text-center text-foreground/70 mb-8">Select optional background sound to enhance your meditation.</p>
              
              <div className="max-w-xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {backgroundOptions.map((item) => (
                    <div
                      key={item.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                        background === item.id 
                          ? 'border-meditation-calm-blue bg-meditation-light-blue/30' 
                          : 'border-gray-200 hover:border-meditation-calm-blue/50'
                      }`}
                      onClick={() => setBackground(item.id)}
                    >
                      <div className="flex items-start">
                        <div className={`p-2 rounded-md mr-3 ${
                          background === item.id 
                            ? 'bg-meditation-calm-blue text-white' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          <Music size={20} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-foreground/70 mt-1">{item.description}</p>
                          {item.id !== "none" && (
                            <button className="text-xs text-meditation-deep-blue mt-2 flex items-center">
                              <Play size={12} className="mr-1" /> 
                              Preview audio
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setStep(4)}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleGenerate} 
                    className="btn-primary"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw size={18} className="mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Meditation"
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
                <div className="relative h-20 w-20 mx-auto mb-6">
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
          {isComplete && (
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
              {step === 1 ? "A title helps you identify your meditation later. You can always change it." : 
               step === 2 ? "Choose a duration that fits your schedule. Shorter sessions are great for beginners." :
               step === 3 ? "Different meditation styles offer unique benefits. Choose one that addresses your current needs." :
               step === 4 ? "The voice narrating your meditation can significantly impact your experience." :
               "Background audio can enhance your meditation experience, but it's completely optional."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions to get names based on IDs
function getStyleName(styleId: string) {
  const style = meditationStyles.find(s => s.id === styleId);
  return style ? style.name : styleId;
}

function getVoiceName(voiceId: string) {
  const voice = voiceOptions.find(v => v.id === voiceId);
  return voice ? voice.name : voiceId;
}

function getBackgroundName(backgroundId: string) {
  const background = backgroundOptions.find(b => b.id === backgroundId);
  return background ? background.name : backgroundId;
}

export default CreateMeditation;
