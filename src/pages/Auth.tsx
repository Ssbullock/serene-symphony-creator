
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-meditation-light-blue to-white">
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="h-20 w-20 mb-4 flex items-center justify-center rounded-full bg-primary text-white text-2xl font-semibold animate-float">
            S
          </div>
          <h1 className="text-3xl font-semibold tracking-wide text-gray-900 mb-2">Serene</h1>
          <p className="text-xl text-gray-600">Breathe in. Breathe out. Begin.</p>
        </div>

        <div className="bg-white/90 rounded-lg shadow-lg p-8 border border-gray-100 backdrop-blur-sm glass-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {isSignUp ? "Create an account" : "Welcome back"}
            </h2>
            <Badge variant="secondary" className="bg-meditation-calm-blue/10 text-meditation-deep-blue">
              {isSignUp ? "New User" : "Login"}
            </Badge>
          </div>
          
          <form onSubmit={handleSignUp} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-800 font-medium">Full Name</Label>
                <Input 
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="transition-all duration-300 focus:ring-primary bg-white text-gray-800 placeholder:text-gray-500 border-gray-200"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-800 font-medium">Email</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                className="transition-all duration-300 focus:ring-primary bg-white text-gray-800 placeholder:text-gray-500 border-gray-200"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-800 font-medium">Password</Label>
              <Input 
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="transition-all duration-300 focus:ring-primary bg-white text-gray-800 placeholder:text-gray-500 border-gray-200"
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 btn-primary-gradient"
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
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-800 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300"
          >
            {isGoogleLoading ? (
              <svg className="animate-spin h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <FcGoogle className="h-5 w-5" />
                <span>Sign in with Google</span>
              </>
            )}
          </Button>
          
          <div className="mt-6 text-center">
            <button 
              onClick={handleToggleMode} 
              className="text-primary hover:text-primary/80 hover:underline focus:outline-none transition-colors font-medium"
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
