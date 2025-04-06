import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, Plus, Calendar, Download, Clock3 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/use-user";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Define the Meditation interface to match the database structure
interface Meditation {
  id: string;
  title: string;
  duration: number;
  style: string;
  focus: string;
  background_sound: string | null;
  created_at: string;
  user_id: string;
  voice: string;
  audio_url?: string | null;
}

const Dashboard = () => {
  const { user } = useUser();
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeditations = async () => {
      try {
        setLoading(true);
        
        if (!user) {
          setMeditations([]);
          return;
        }
        
        const { data, error } = await supabase
          .from("meditations")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching meditations:", error);
          return;
        }

        // Cast the data to the Meditation type
        setMeditations(data as Meditation[]);
      } catch (error) {
        console.error("Error in fetchMeditations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeditations();
  }, [user]);

  const renderMeditationList = () => {
    if (loading) {
      return <p>Loading meditations...</p>;
    }

    if (!user) {
      return <p>Please sign in to see your meditations.</p>;
    }

    if (meditations.length === 0) {
      return <p>No meditations created yet. Start creating!</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meditations.map((meditation) => (
          <div key={meditation.id} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">{meditation.title}</h3>
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <Clock3 className="mr-1" size={16} />
              <span>{formatDuration(meditation.duration)}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <Calendar className="mr-1" size={16} />
              <span>Created: {new Date(meditation.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={() => handlePlayMeditation(meditation)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Play className="mr-1" size={16} />
                Play
              </button>
              {meditation.audio_url && (
                <a
                  href={meditation.audio_url}
                  download={`${meditation.title}.mp3`}
                  className="flex items-center text-green-600 hover:text-green-800"
                >
                  <Download className="mr-1" size={16} />
                  Download
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayMeditation = (meditation: Meditation) => {
    // Implement your play meditation logic here
    console.log("Playing meditation:", meditation);
    alert(`Playing: ${meditation.title} (Duration: ${formatDuration(meditation.duration)})`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Meditations</h1>
          <Button asChild>
            <Link to="/create-meditation">
              <Plus className="mr-2" size={20} />
              Create New
            </Link>
          </Button>
        </div>
        
        <Separator className="mb-4" />
        
        {renderMeditationList()}
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
```

```typescript
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Play, ArrowRight, CheckCircle, ExternalLink, ChevronDown, ChevronUp, Star, Sparkles, BadgeDollarSign, BadgePercent, ToggleLeft, ToggleRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [isVisible, setIsVisible] = useState({
    howItWorks: false,
    features: false,
    pricing: false,
    testimonials: false,
  });

  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const annualDiscount = 40; // 40% discount for annual billing
  const lifetimeDiscount = 60; // 60% discount for lifetime plan compared to paying monthly for 3 years

  const howItWorksRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === howItWorksRef.current) {
          setIsVisible(prev => ({ ...prev, howItWorks: entry.isIntersecting }));
        } else if (entry.target === featuresRef.current) {
          setIsVisible(prev => ({ ...prev, features: entry.isIntersecting }));
        } else if (entry.target === pricingRef.current) {
          setIsVisible(prev => ({ ...prev, pricing: entry.isIntersecting }));
        } else if (entry.target === testimonialsRef.current) {
          setIsVisible(prev => ({ ...prev, testimonials: entry.isIntersecting }));
        }
      });
    }, { threshold: 0.1 });

    if (howItWorksRef.current) observer.observe(howItWorksRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (pricingRef.current) observer.observe(pricingRef.current);
    if (testimonialsRef.current) observer.observe(testimonialsRef.current);

    return () => {
      if (howItWorksRef.current) observer.unobserve(howItWorksRef.current);
      if (featuresRef.current) observer.unobserve(featuresRef.current);
      if (pricingRef.current) observer.unobserve(pricingRef.current);
      if (testimonialsRef.current) observer.unobserve(testimonialsRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar transparent />
      
      <section className="pt-32 pb-20 px-4 sm:pt-40 md:pb-32 hero-gradient relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
              Personalized AI Meditations for Your <span className="text-gradient animate-pulse-soft">Wellbeing</span> Journey
            </h1>
            <p className="text-xl text-foreground/80 mb-10 max-w-2xl mx-auto">
              Experience custom-crafted meditations generated by AI to match your unique needs, style preferences, and goals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Link to="/auth" className="btn-primary-gradient text-base px-8 py-3 h-auto">
                Start Your Journey
              </Link>
              <button className="btn-secondary flex items-center justify-center text-base px-8 py-3 h-auto gap-2">
                <Play size={18} />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 h-40 w-40 rounded-full bg-meditation-light-blue opacity-30 animate-float" style={{ animationDelay: "0s" }}></div>
          <div className="absolute top-1/2 left-2/3 h-60 w-60 rounded-full bg-meditation-soft-blue opacity-20 animate-float" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-3/4 left-1/3 h-32 w-32 rounded-full bg-meditation-calm-blue opacity-20 animate-float" style={{ animationDelay: "2s" }}></div>
          <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-meditation-deep-blue opacity-10 animate-float" style={{ animationDelay: "1.5s" }}></div>
          
          <div className="absolute top-1/3 right-1/3 h-24 w-24 rounded-full bg-pink-400 opacity-10 animate-breathe" style={{ animationDelay: "1s" }}></div>
          <div className="absolute bottom-1/3 left-1/5 h-36 w-36 rounded-full bg-blue-500 opacity-10 animate-breathe" style={{ animationDelay: "2s" }}></div>
          <div className="absolute top-1/2 right-1/4 h-20 w-20 rounded-full bg-purple-400 opacity-15 animate-breathe" style={{ animationDelay: "0.5s" }}></div>
          
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full max-w-6xl mx-auto">
              <div className="absolute top-1/4 left-1/5 w-2 h-2 rounded-full bg-white opacity-70 animate-ping" style={{ animationDelay: "0.5s" }}></div>
              <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-white opacity-70 animate-ping" style={{ animationDelay: "1.7s" }}></div>
              <div className="absolute bottom-1/2 left-1/3 w-2 h-2 rounded-full bg-white opacity-70 animate-ping" style={{ animationDelay: "2.1s" }}></div>
              <div className="absolute bottom-1/3 right-1/3 w-2 h-2 rounded-full bg-white opacity-70 animate-ping" style={{ animationDelay: "0.9s" }}></div>
              <div className="absolute top-2/3 right-1/5 w-2 h-2 rounded-full bg-white opacity-70 animate-ping" style={{ animationDelay: "1.3s" }}></div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" ref={howItWorksRef} className="py-20 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          <div className="absolute top-1/5 left-1/4 h-32 w-32 rounded-full bg-blue-300 animate-float" style={{ animationDelay: "0.5s" }}></div>
          <div className="absolute bottom-1/4 right-1/3 h-48 w-48 rounded-full bg-purple-200 animate-float" style={{ animationDelay: "1.2s" }}></div>
          <div className="absolute top-2/3 left-1/2 h-24 w-24 rounded-full bg-green-200 animate-breathe" style={{ animationDelay: "0.8s" }}></div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 relative inline-block">
              How It <span className="text-gradient animate-pulse-soft">Works</span>
              <Sparkles className="absolute -right-6 -top-6 text-yellow-400 animate-pulse-soft" size={24} />
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Create your perfect meditation in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                title: "Choose Your Preferences",
                description: "Select your meditation style, duration, and specific focus area or goal.",
                icon: (
                  <div className="mb-6 inline-flex items-center justify-center h-16 w-16 rounded-full bg-meditation-light-blue text-meditation-deep-blue animate-breathe">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                ),
                delay: 0
              },
              {
                title: "AI Generates Your Meditation",
                description: "Our AI creates a personalized meditation script based on your preferences.",
                icon: (
                  <div className="mb-6 inline-flex items-center justify-center h-16 w-16 rounded-full bg-meditation-light-blue text-meditation-deep-blue animate-breathe" style={{ animationDelay: "1s" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                ),
                delay: 100
              },
              {
                title: "Listen & Download",
                description: "Enjoy your custom meditation now or save it for later. Download to listen offline anytime.",
                icon: (
                  <div className="mb-6 inline-flex items-center justify-center h-16 w-16 rounded-full bg-meditation-light-blue text-meditation-deep-blue animate-breathe" style={{ animationDelay: "2s" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                ),
                delay: 200
              }
            ].map((step, index) => (
              <div 
                key={index} 
                className={`glass-card p-8 rounded-xl text-center transform transition-all duration-700 hover:scale-105 hover:shadow-lg ${isVisible.howItWorks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${step.delay}ms` }}
              >
                {step.icon}
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-foreground/70">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link to="/auth" className="inline-flex items-center text-meditation-deep-blue hover:text-meditation-deep-blue/80 font-medium transition-colors transform hover:translate-x-1">
              Get Started <ArrowRight size={18} className="ml-2 animate-bounce-slow" />
            </Link>
          </div>
        </div>
      </section>

      <section id="features" ref={featuresRef} className="py-20 px-4 bg-meditation-tranquil relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-60"></div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full bg-pink-400 opacity-60 animate-ping" style={{ animationDelay: "0.5s" }}></div>
          <div className="absolute bottom-1/3 left-1/5 w-2 h-2 rounded-full bg-blue-500 opacity-60 animate-ping" style={{ animationDelay: "1.7s" }}></div>
          <div className="absolute top-2/3 right-1/3 w-2 h-2 rounded-full bg-green-400 opacity-60 animate-ping" style={{ animationDelay: "0.9s" }}></div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 relative inline-block">
              Key <span className="text-gradient animate-pulse-soft">Features</span>
              <Sparkles className="absolute -right-6 -top-6 text-purple-400 animate-pulse-soft" size={24} />
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Discover what makes our AI meditation platform unique
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "AI-Powered Narration",
                description: "Choose from multiple natural-sounding voices with perfect pronunciation and emotional resonance.",
                icon: (
                  <div className="h-12 w-12 rounded-lg bg-meditation-calm-blue flex items-center justify-center shadow-lg shadow-blue-200/50 animate-pulse-soft">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-4m0 4a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                ),
                delay: 0
              },
              {
                title: "Full Customization",
                description: "Set duration, style, focus areas, and more to create the perfect meditation for your needs.",
                icon: (
                  <div className="h-12 w-12 rounded-lg bg-meditation-calm-blue flex items-center justify-center shadow-lg shadow-blue-200/50 animate-pulse-soft" style={{animationDelay: "0.3s"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                ),
                delay: 100
              },
              {
                title: "Background Audio",
                description: "Add ambient soundscapes like rain, ocean waves, or gentle music to enhance your practice.",
                icon: (
                  <div className="h-12 w-12 rounded-lg bg-meditation-calm-blue flex items-center justify-center shadow-lg shadow-blue-200/50 animate-pulse-soft" style={{animationDelay: "0.6s"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                ),
                delay: 200
              },
              {
                title: "Save & Download",
                description: "Build a personal library of meditations tailored to different moods and needs.",
                icon: (
                  <div className="h-12 w-12 rounded-lg bg-meditation-calm-blue flex items-center justify-center shadow-lg shadow-blue-200/50 animate-pulse-soft" style={{animationDelay: "0.9s"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                ),
                delay: 300
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className={`flex p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-500 hover:scale-102 transform ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${feature.delay}ms` }}
              >
                {feature.icon}
                <div className="ml-5">
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" ref={pricingRef} className="py-20 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/5 h-64 w-64 rounded-full bg-gradient-to-r from-blue-200 to-green-200 animate-float-slow"></div>
          <div className="absolute bottom-1/3 right-1/5 h-48 w-48 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 animate-float-slow" style={{animationDelay: "1s"}}></div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-6">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 relative inline-block">
              Pricing <span className="text-gradient animate-pulse-soft">Plans</span>
              <Sparkles className="absolute -right-6 -top-6 text-green-400 animate-pulse-soft" size={24} />
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
              Choose the perfect plan for your meditation journey
            </p>
            
            <div className="flex justify-center items-center mb-10">
              <div className="relative px-4 py-2 rounded-full bg-gray-100 flex items-center w-auto mx-auto">
                <span className={`text-sm font-medium transition-colors duration-200 px-4 py-1 ${billingPeriod === "monthly" ? "text-white bg-meditation-deep-blue rounded-full" : "text-gray-700"}`}>
                  Monthly
                </span>
                
                <button 
                  onClick={() => setBillingPeriod(prev => prev === "monthly" ? "annual" : "monthly")}
                  className="mx-2 p-1 text-gray-700 hover:text-meditation-deep-blue transition-colors"
                  aria-label="Toggle billing period"
                >
                  {billingPeriod === "monthly" ? 
                    <ToggleLeft className="w-10 h-10" /> : 
                    <ToggleRight className="w-10 h-10 text-meditation-deep-blue" />
                  }
                </button>
                
                <span className={`text-sm font-medium transition-colors duration-200 px-4 py-1 flex items-center ${billingPeriod === "annual" ? "text-white bg-meditation-deep-blue rounded-full" : "text-gray-700"}`}>
                  Annual
                  {billingPeriod === "annual" && (
                    <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800">
                      {annualDiscount}% off
                    </Badge>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                description: "Perfect for getting started with meditation",
                features: [
                  "Basic meditation generation",
                  "Standard voices",
                  "5-minute meditations",
                  "3 meditations per month",
                  "Basic background sounds"
                ],
                btnText: "Start Free Plan",
                popular: false,
                delay: 0
              },
              {
                name: "Premium",
                price: billingPeriod === "monthly" ? "$9" : `$${Math.ceil(9 * 12 * (1 - annualDiscount/100))}`,
                period: billingPeriod === "monthly" ? "per month" : "per year",
                description: "Our most popular choice for meditation enthusiasts",
                features: [
                  "Unlimited AI meditations",
                  "All voice options",
                  "Advanced meditation creation",
                  "All background sounds",
                  "Download meditations",
                  "New voices added monthly",
                  "Voice customization"
                ],
                btnText: `Start ${billingPeriod === "monthly" ? "Monthly" : "Annual"} Premium`,
                popular: true,
                badge: billingPeriod === "annual" ? `Save ${annualDiscount}%` : null,
                delay: 100
              },
              {
                name: "Lifetime",
                price: "$199",
                period: "one-time payment",
                description: "One-time payment for unlimited access forever",
                features: [
                  "All Premium features",
                  "Never pay again",
                  "Lifetime updates",
                  "VIP support",
                  "Personalized meditation journey",
                  "Early access to new features"
                ],
                btnText: "Get Lifetime Access",
                popular: false,
                badge: `Save ${lifetimeDiscount}%`,
                delay: 200
              }
            ].map((plan, index) => (
              <div 
                key={index}
                className={`rounded-xl overflow-hidden transition-all duration-700 hover:shadow-xl ${isVisible.pricing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${plan.popular ? 'border-2 border-meditation-deep-blue shadow-lg transform md:-translate-y-4 hover:scale-105' : 'border border-gray-200 hover:scale-102'}`}
                style={{ transitionDelay: `${plan.delay}ms` }}
              >
                {plan.popular && (
                  <div className="bg-meditation-deep-blue text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>
                  <div className="mb-4 flex items-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-foreground/70 ml-1">{plan.period}</span>}
                    {plan.badge && (
                      <Badge className="ml-3 bg-green-100 text-green-800 hover:bg-green-100">{plan.badge}</Badge>
                    )}
                  </div>
                  <p className="text-foreground/70 mb-6">{plan.description}</p>
                  <hr className="my-6" />
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle size={20} className="text-meditation-deep-blue flex-shrink-0 mr-2 animate-pulse-soft" style={{animationDelay: `${i * 0.2}s`}} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link 
                    to={plan.name === "Free" ? "/auth" : "/auth"} 
                    className={`w-full block text-center py-3 rounded-lg font-medium transition-all hover:scale-102 ${plan.popular ? 'bg-meditation-deep-blue text-white hover:bg-meditation-deep-blue/90' : plan.name === "Free" ? 'border border-meditation-
