import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FcGoogle } from "react-icons/fc";
import { Wind, Sun, Moon, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  
  const [dayNightProgress, setDayNightProgress] = useState(0);

  useEffect(() => {
    // Create a smoother transition with smaller interval and more gradual changes
    const intervalDuration = 50; // Smaller intervals for smoother animation
    const totalTransitionTime = 20000; // Total cycle time in ms
    const steps = totalTransitionTime / intervalDuration;
    const stepValue = 1 / steps;
    
    const interval = setInterval(() => {
      setDayNightProgress(prev => {
        if (prev >= 1) return 0;
        return prev + stepValue;
      });
    }, intervalDuration);
    
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Google authentication failed");
      console.error("Google auth error:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || (isSignUp && !formData.name)) {
      toast.error("Please fill out all fields");
      return;
    }

    try {
      setIsLoading(true);
      
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
            },
          },
        });
        
        if (error) throw error;
        
        toast.success("Account created! Please check your email for verification.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) throw error;
        
        toast.success("Logged in successfully!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get sky color based on time of day - smoothly transition between colors
  const getSkyGradientStyle = () => {
    // Smoothly interpolate colors based on dayNightProgress
    if (dayNightProgress < 0.5) {
      // Day to sunset transition (0.0 - 0.5)
      const normalizedProgress = dayNightProgress * 2; // 0 to 1 during first half
      
      // Interpolate between day colors (blues) and sunset colors (oranges/purples)
      return {
        background: `linear-gradient(to bottom, 
          rgba(135, 206, 235, ${1 - normalizedProgress}) 0%, 
          rgba(135, 206, 250, ${1 - normalizedProgress}) 40%,
          rgba(255, 183, 107, ${normalizedProgress}) 60%, 
          rgba(133, 92, 248, ${normalizedProgress}) 100%)`,
      };
    } else {
      // Sunset to night transition (0.5 - 1.0)
      const normalizedProgress = (dayNightProgress - 0.5) * 2; // 0 to 1 during second half
      
      // Interpolate between sunset colors (oranges/purples) and night colors (dark blues)
      return {
        background: `linear-gradient(to bottom, 
          rgba(255, 183, 107, ${1 - normalizedProgress}) 0%, 
          rgba(133, 92, 248, ${1 - normalizedProgress}) 40%,
          rgba(25, 25, 112, ${normalizedProgress}) 60%, 
          rgba(9, 9, 44, ${normalizedProgress}) 100%)`,
      };
    }
  };

  // Get sun/moon position for rising/setting animation
  const getCelestialPosition = () => {
    // Create a semi-circular path for sun/moon
    const angle = dayNightProgress * Math.PI; // 0 to π radians
    const horizontalPosition = 50 + Math.cos(angle) * 40; // 10% to 90% across screen
    const verticalPosition = 50 - Math.sin(angle) * 40; // Higher or lower based on time
    
    return {
      left: `${horizontalPosition}%`,
      top: `${verticalPosition}%`,
      opacity: Math.sin(dayNightProgress * Math.PI), // Fade in/out at horizon
      transform: 'translate(-50%, -50%)',
      transition: 'all 1000ms linear',
    };
  };

  // Determine if we're showing sun or moon
  const showSun = dayNightProgress < 0.5;
  
  // Calculate cloud positions that move with time
  const getCloudPositions = (index: number) => {
    // Each cloud has different base position and movement pattern
    const basePositions = [
      { top: '25%', left: '20%' },
      { top: '50%', left: '70%' },
      { top: '35%', left: '40%' }
    ];
    
    // Calculate cloud movement paths
    const movement = Math.sin(dayNightProgress * Math.PI * 2 + index) * 20;
    
    return {
      ...basePositions[index],
      transform: `translateX(${movement}%)`,
      opacity: 0.6 + Math.sin(dayNightProgress * Math.PI) * 0.4, // Clouds more visible during day
      transition: 'all 5000ms ease-in-out',
    };
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Sky background with smooth color transition */}
      <div className="absolute inset-0 overflow-hidden -z-10" style={getSkyGradientStyle()}>
        {/* Sun or Moon */}
        <div className="absolute transition-all duration-5000" style={getCelestialPosition()}>
          {showSun ? (
            <Sun className="h-24 w-24 text-yellow-400 animate-pulse-soft" />
          ) : (
            <Moon className="h-20 w-20 text-yellow-100 animate-float-slow" />
          )}
        </div>
        
        {/* Clouds that move across the sky */}
        {[0, 1, 2].map((index) => (
          <div 
            key={`cloud-${index}`}
            className="absolute text-white animate-float" 
            style={{
              ...getCloudPositions(index),
              animationDelay: `${index * 2}s`,
            }}
          >
            <Cloud className={`h-${16 + index * 2} w-${16 + index * 2}`} />
          </div>
        ))}
        
        {/* Wind effect that becomes more visible during transitions */}
        <div 
          className="absolute text-white animate-bounce-slow" 
          style={{
            opacity: 0.3 + Math.sin(dayNightProgress * Math.PI * 2) * 0.3,
            bottom: '20%',
            left: `${30 + Math.sin(dayNightProgress * Math.PI * 4) * 20}%`,
            transition: 'all 3000ms ease-in-out',
          }}
        >
          <Wind className="h-12 w-12" />
        </div>
        
        <div 
          className="absolute text-white animate-bounce-slow" 
          style={{
            opacity: 0.2 + Math.sin(dayNightProgress * Math.PI * 2 + 1) * 0.3,
            top: '30%',
            right: `${20 + Math.sin(dayNightProgress * Math.PI * 3) * 25}%`,
            transition: 'all 4000ms ease-in-out',
            animationDelay: "1.5s",
          }}
        >
          <Wind className="h-10 w-10" />
        </div>
      </div>

      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="relative h-20 w-20 mb-4">
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-breathe opacity-20"></div>
            <div className="absolute inset-2 bg-blue-500 rounded-full animate-breathe opacity-40" style={{ animationDelay: "0.5s" }}></div>
            <div className="absolute inset-4 bg-blue-500 rounded-full animate-breathe opacity-60" style={{ animationDelay: "1s" }}></div>
            <div className="absolute inset-6 bg-blue-500 rounded-full animate-breathe opacity-80" style={{ animationDelay: "1.5s" }}></div>
          </div>
          <h1 className="text-3xl font-light tracking-wide text-white mb-2 text-shadow">Serene</h1>
          <p className="text-xl text-white/90 animate-fade-in text-shadow">Breathe in. Breathe out. Begin.</p>
        </div>

        <div className="bg-white/30 backdrop-blur-md rounded-lg shadow-lg p-8 animate-scale-in border border-white/40">
          <h2 className="text-2xl font-medium mb-6 text-center text-white text-shadow">
            {isSignUp ? "Create an account" : "Welcome back"}
          </h2>
          
          <form onSubmit={handleSignUp} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white font-medium text-shadow">Full Name</Label>
                <Input 
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="transition-all duration-300 focus:ring-blue-500 bg-white/50 text-gray-800 placeholder:text-gray-600 border-white/50"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium text-shadow">Email</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                className="transition-all duration-300 focus:ring-blue-500 bg-white/50 text-gray-800 placeholder:text-gray-600 border-white/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium text-shadow">Password</Label>
              <Input 
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="transition-all duration-300 focus:ring-blue-500 bg-white/50 text-gray-800 placeholder:text-gray-600 border-white/50"
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-all border border-blue-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : isSignUp ? "Sign Up" : "Log In"}
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/40"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/20 backdrop-blur-sm text-white font-medium">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white/50 hover:bg-white/60 border border-white/50 rounded-md shadow-sm text-sm font-medium text-gray-800 backdrop-blur-sm hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-white/40 transition-all duration-300"
          >
            {isGoogleLoading ? (
              <svg className="animate-spin h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <FcGoogle className="h-5 w-5 bg-white rounded-full" />
                <span>Sign in with Google</span>
              </>
            )}
          </Button>
          
          <div className="mt-6 text-center">
            <button 
              onClick={handleToggleMode} 
              className="text-white hover:text-white/90 hover:underline focus:outline-none transition-colors text-shadow font-medium"
            >
              {isSignUp ? "Already have an account? Log in" : "Need an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
