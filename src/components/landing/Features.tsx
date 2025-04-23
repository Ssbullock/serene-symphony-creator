import React from 'react';
import { Sparkles, Mic } from "lucide-react";

interface FeaturesProps {
  isVisible: boolean;
}

const Features = ({ isVisible }: FeaturesProps) => {
  return (
    <section id="features" className="py-20 px-4 bg-meditation-tranquil relative overflow-hidden">
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
                  <Mic className="h-6 w-6 text-white" />
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm-12-6l12-3" />
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
              ),
              delay: 300
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className={`flex p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-500 hover:scale-102 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
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
  );
};

export default Features;
