
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import PricingSection from "@/components/landing/PricingSection";

const Index = () => {
  const [isVisible, setIsVisible] = useState({
    howItWorks: false,
    features: false,
    pricing: false,
  });

  const howItWorksRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === howItWorksRef.current) {
          setIsVisible(prev => ({ ...prev, howItWorks: entry.isIntersecting }));
        } else if (entry.target === featuresRef.current) {
          setIsVisible(prev => ({ ...prev, features: entry.isIntersecting }));
        } else if (entry.target === pricingRef.current) {
          setIsVisible(prev => ({ ...prev, pricing: entry.isIntersecting }));
        }
      });
    }, { threshold: 0.1 });

    if (howItWorksRef.current) observer.observe(howItWorksRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (pricingRef.current) observer.observe(pricingRef.current);

    return () => {
      if (howItWorksRef.current) observer.unobserve(howItWorksRef.current);
      if (featuresRef.current) observer.unobserve(featuresRef.current);
      if (pricingRef.current) observer.unobserve(pricingRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar transparent />
      <HeroSection />
      <div ref={howItWorksRef}>
        <HowItWorks isVisible={isVisible.howItWorks} />
            </div>
      <div ref={featuresRef}>
        <Features isVisible={isVisible.features} />
          </div>
      <div ref={pricingRef}>
        <PricingSection isVisible={isVisible.pricing} />
        </div>
      <Footer />
    </div>
  );
};

export default Index;
