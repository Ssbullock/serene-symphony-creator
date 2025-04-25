import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface HowItWorksProps {
  isVisible: boolean;
}

const HowItWorks = ({ isVisible }: HowItWorksProps) => {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-white relative overflow-hidden">
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm-12-6l12-3" />
                  </svg>
                </div>
              ),
              delay: 200
            }
          ].map((step, index) => (
            <div 
              key={index} 
              className={`glass-card p-8 rounded-xl text-center transform transition-all duration-700 hover:scale-105 hover:shadow-lg ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${step.delay}ms` }}
            >
              {step.icon}
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-foreground/70">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 mb-16 text-center">
          <h3 className="text-2xl font-semibold mb-6">Watch How It Works</h3>
          <div className="aspect-video max-w-3xl mx-auto rounded-lg overflow-hidden shadow-lg">
            <iframe 
              src="https://www.loom.com/embed/7c72ce5c236149beb893f7d57b23af34?sid=fd55d113-5e4d-400b-8b7b-f042fbada946" 
              frameBorder="0" 
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="text-center mt-16">
          <Link to="/auth" className="inline-flex items-center text-meditation-deep-blue hover:text-meditation-deep-blue/80 font-medium transition-colors transform hover:translate-x-1">
            Get Started <ArrowRight size={18} className="ml-2 animate-bounce-slow" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
