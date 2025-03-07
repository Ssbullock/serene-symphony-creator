import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FcGoogle } from "react-icons/fc";
import { Wind, Sun, Moon, Cloud } from "lucide-react";

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
    const intervalDuration = 80;
    const totalTransitionTime = 20000;
    const steps = totalTransitionTime / intervalDuration;
    const stepValue = 1 / steps;
    
    const interval = setInterval(() => {
      setDayNightProgress(prev => {
        if (prev >= 1) return 0;
        if (prev <= 0) return stepValue;
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
          redirectTo: `${window.location.origin}/auth`
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

  const getSkyGradient = () => {
    if (dayNightProgress < 0.5) {
      const normalizedProgress = dayNightProgress * 2;
      return `bg-gradient-to-b from-sky-${Math.round(300 - normalizedProgress * 100)} via-blue-${Math.round(300 - normalizedProgress * 100)} to-indigo-${Math.round(300 - normalizedProgress * 200)}`;
    } else {
      const normalizedProgress = (dayNightProgress - 0.5) * 2;
      return `bg-gradient-to-b from-indigo-${Math.round(700 + normalizedProgress * 200)} via-purple-${Math.round(600 + normalizedProgress * 300)} to-blue-${Math.round(800 + normalizedProgress * 150)}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden -z-10 transition-colors duration-10000">
        <div className={`absolute inset-0 transition-all duration-10000 ${
          dayNightProgress < 0.5 
            ? "bg-gradient-to-b from-sky-300 via-blue-300 to-indigo-300" 
            : "bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-950"
        }`} style={{
          opacity: 1,
        }}></div>
        
        <div className="absolute transition-all duration-10000" style={{
          left: dayNightProgress < 0.5 
            ? `${(1 - dayNightProgress * 2) * 10 + (dayNightProgress * 2) * 85}%` 
            : `${((dayNightProgress - 0.5) * 2) * 10 + (1 - (dayNightProgress - 0.5) * 2) * 85}%`,
          top: `${Math.sin(dayNightProgress * Math.PI) * 60 + 10}%`,
          transform: 'translate(-50%, -50%)',
          opacity: dayNightProgress < 0.5 ? 1 - dayNightProgress : dayNightProgress,
        }}>
          {dayNightProgress < 0.5 ? (
            <Sun className={`h-24 w-24 animate-pulse-soft text-yellow-${Math.round(400 + dayNightProgress * 100)}`} />
          ) : (
            <Moon className={`h-20 w-20 animate-float-slow text-yellow-${Math.round(100 + (1-dayNightProgress) * 200)}`} />
          )}
        </div>
        
        <div className="absolute text-white opacity-70 animate-float" 
             style={{ 
               animationDelay: "0s", 
               top: '25%',
               left: `${(dayNightProgress < 0.5 ? 25 : 70 - dayNightProgress * 90)}%`, 
               transition: 'left 20000ms linear'
             }}>
          <Cloud className="h-16 w-16" />
        </div>
        <div className="absolute text-white opacity-50 animate-float" 
             style={{ 
               animationDelay: "1s", 
               top: '50%',
               left: `${(dayNightProgress < 0.5 ? 70 - dayNightProgress * 20 : 30 + dayNightProgress * 40)}%`,
               transition: 'left 15000ms linear'
             }}>
          <Cloud className="h-20 w-20" />
        </div>
        <div className="absolute text-white opacity-60 animate-float" 
             style={{ 
               animationDelay: "2s", 
               bottom: '33%',
               left: `${(dayNightProgress < 0.5 ? 75 : 25 + dayNightProgress * 50)}%`,
               transition: 'left 18000ms linear'
             }}>
          <Cloud className="h-16 w-16" />
        </div>
        
        <div className="absolute text-white animate-bounce-slow" 
             style={{ 
               opacity: 0.3 + Math.sin(dayNightProgress * Math.PI) * 0.3,
               bottom: '20%',
               left: `${(dayNightProgress < 0.5 ? 10 + dayNightProgress * 80 : 90 - (dayNightProgress - 0.5) * 80)}%`,
               transition: 'left 25000ms linear'
             }}>
          <Wind className="h-12 w-12" />
        </div>
        <div className="absolute text-white animate-bounce-slow" 
             style={{ 
               opacity: 0.2 + Math.sin(dayNightProgress * Math.PI) * 0.3,
               top: '32%',
               right: `${(dayNightProgress < 0.5 ? 20 + dayNightProgress * 60 : 80 - (dayNightProgress - 0.5) * 60)}%`,
               transition: 'right 22000ms linear',
               animationDelay: "1.5s" 
             }}>
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
            
            <button
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
            </button>
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

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
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
          </button>
          
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
