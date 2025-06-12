import { useState } from 'react';
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { CheckCircle } from "lucide-react";
import { useUser } from '@/hooks/use-user';

const PAYMENT_LINKS = {
  premium_monthly: 'https://buy.stripe.com/cNi3cv1Z08CW8Ng3xS8g001',
  premium_annual: 'https://buy.stripe.com/6oU00j9rs7yS1kO7O88g002',
  lifetime: 'https://buy.stripe.com/eVqeVdbzA6uOfbEfgA8g000',
} as const;

type PlanType = keyof typeof PAYMENT_LINKS;

interface PricingSectionProps {
  isVisible: boolean;
}

const PricingSection = ({ isVisible }: PricingSectionProps) => {
  const { user } = useUser();
  const [billingType, setBillingType] = useState<'monthly' | 'annual'>('monthly');

  const handleSubscribe = async (plan: PlanType) => {
    try {
      const userId = user?.id;
      localStorage.setItem('selectedPlan', plan);
      const paymentLink = PAYMENT_LINKS[plan];
      const redirectUrl = `/auth?redirect=${encodeURIComponent(paymentLink)}&client_reference_id=${userId}`;
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Error handling subscription:', error);
    }
  };

  return (
    <section id="pricing" className="py-20 px-4 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/5 h-64 w-64 rounded-full bg-gradient-to-r from-blue-200 to-green-200 animate-float-slow"></div>
        <div className="absolute bottom-1/3 right-1/5 h-48 w-48 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 animate-float-slow" style={{animationDelay: "1s"}}></div>
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 relative inline-block">
            Pricing <span className="text-gradient animate-pulse-soft">Plans</span>
            <Sparkles className="absolute -right-6 -top-6 text-green-400 animate-pulse-soft" size={24} />
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-10">
            Choose the perfect plan for your meditation journey
          </p>
          
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${billingType === 'monthly' ? 'font-semibold text-meditation-deep-blue' : 'text-foreground/70'}`}>Monthly</span>
            <Switch
              checked={billingType === 'annual'}
              onCheckedChange={() => setBillingType(billingType === 'monthly' ? 'annual' : 'monthly')}
              className="mx-2"
            />
            <span className={`ml-3 ${billingType === 'annual' ? 'font-semibold text-meditation-deep-blue' : 'text-foreground/70'}`}>
              Annual <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full ml-1">20% off</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Free",
              price: "$0",
              description: "Start your meditation journey",
              features: [
                "5 AI meditations per month",
                "Basic voice options",
                "Basic backgrounds",
                "10-minute maximum duration",
                "Community support"
              ],
              btnText: "Get Started Free",
              popular: false,
              delay: 0,
              type: null
            },
            {
              name: "Premium",
              price: billingType === 'monthly' ? "$9.99" : "$7.99",
              period: "per month",
              totalPrice: billingType === 'annual' ? "$95.88" : undefined,
              description: "Perfect for those just starting their meditation journey",
              features: [
                "Unlimited AI meditations",
                "Advanced custom voices",
                "All background sounds",
                "Download meditations",
                "Personalized meditation journey"
              ],
              btnText: billingType === 'monthly' ? "Get Premium Monthly" : "Get Premium Annual",
              popular: true,
              delay: 100,
              type: (billingType === 'monthly' ? 'premium_monthly' : 'premium_annual') as PlanType
            },
            {
              name: "Lifetime",
              price: "$57.00",
              description: "One-time payment for unlimited access forever",
              features: [
                "All Premium features",
                "Never pay again",
                "Lifetime updates",
                "VIP support",
                "Personalized meditation journey"
              ],
              btnText: "Get Lifetime Access",
              popular: false,
              delay: 200,
              type: 'lifetime' as PlanType,
              badge: "Great Deal"
            }
          ].map((plan, index) => (
            <div 
              key={index}
              className={`rounded-xl overflow-hidden transition-all duration-700 hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${
                plan.popular 
                  ? 'border-2 border-meditation-deep-blue shadow-lg transform md:-translate-y-4 hover:scale-105 bg-gradient-to-br from-meditation-deep-blue/5 to-meditation-calm-blue/5' 
                  : 'border border-gray-200 hover:scale-102'
              }`}
              style={{ transitionDelay: `${plan.delay}ms` }}
            >
              {plan.popular && (
                <div className="bg-gradient-to-r from-meditation-deep-blue to-meditation-calm-blue text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-4">
                  {plan.name}
                  {plan.badge && (
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full ml-2">
                      {plan.badge}
                    </span>
                  )}
                </h3>
                <div className="mb-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-foreground/70 ml-1 text-sm">{plan.period}</span>}
                </div>
                <p className="text-foreground/70 mb-6 text-sm">{plan.description}</p>
                <hr className="my-6" />
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <CheckCircle size={18} className="text-meditation-deep-blue flex-shrink-0 mr-2 animate-pulse-soft" style={{animationDelay: `${i * 0.2}s`}} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.type ? (
                  <button 
                    onClick={() => handleSubscribe(plan.type!)}
                    className={`w-full block text-center py-3 rounded-lg font-medium transition-all hover:scale-102 ${plan.popular ? 'bg-meditation-deep-blue text-white hover:bg-meditation-deep-blue/90' : 'bg-meditation-light-blue text-foreground hover:bg-meditation-light-blue/90'}`}
                  >
                    {plan.btnText}
                  </button>
                ) : (
                  <Link 
                    to="/auth" 
                    className={`w-full block text-center py-3 rounded-lg font-medium transition-all hover:scale-102 bg-meditation-light-blue text-foreground hover:bg-meditation-light-blue/90`}
                  >
                    {plan.btnText}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-foreground/60">
            All paid plans include a 7-day money-back guarantee. No questions asked.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
