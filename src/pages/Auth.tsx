
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
  const [sceneState, setSceneState] = useState<"day" | "night">("day");
  
  // Switch between day and night scenes
  useEffect(() => {
    const interval = setInterval(() => {
      setSceneState(prev => prev === "day" ? "night" : "day");
    }, 20000); // Change scene every 20 seconds
    
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Enhanced animated background with better contrast and visibility */}
      <div className={`absolute inset-0 overflow-hidden -z-10 transition-colors duration-10000 ${
        sceneState === "night" 
          ? "bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-950" 
          : "bg-gradient-to-b from-sky-300 via-blue-300 to-indigo-300"
      }`}>
        {/* Sun/Moon with improved visibility */}
        <div className={`absolute transition-all duration-10000 ${
          sceneState === "night" 
            ? "top-10 right-10 text-yellow-100 opacity-80" 
            : "top-10 left-10 text-yellow-400 opacity-90"
        }`}>
          {sceneState === "night" ? (
            <Moon className="h-20 w-20 animate-float-slow" />
          ) : (
            <Sun className="h-24 w-24 animate-pulse-soft" />
          )}
        </div>
        
        {/* Clouds with better visibility */}
        <div className="absolute top-1/4 left-1/4 text-white opacity-70 animate-float" style={{ animationDelay: "0s" }}>
          <Cloud className="h-16 w-16 " />
        </div>
        <div className="absolute top-1/2 left-2/3 text-white opacity-50 animate-float" style={{ animationDelay: "1s" }}>
          <Cloud className="h-20 w-20" />
        </div>
        <div className="absolute bottom-1/3 right-1/4 text-white opacity-60 animate-float" style={{ animationDelay: "2s" }}>
          <Cloud className="h-16 w-16" />
        </div>
        
        {/* Wind currents */}
        <div className="absolute bottom-20 left-10 text-white opacity-40 animate-bounce-slow">
          <Wind className="h-12 w-12" />
        </div>
        <div className="absolute top-32 right-20 text-white opacity-30 animate-bounce-slow" style={{ animationDelay: "1.5s" }}>
          <Wind className="h-10 w-10" />
        </div>
      </div>

      <div className="w-full max-w-md mx-auto">
        {/* Breathing circle animation with better colors */}
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

        {/* Enhanced glass card with better contrast */}
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
