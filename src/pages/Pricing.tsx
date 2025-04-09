import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';
import { Check } from 'lucide-react';

const PAYMENT_LINKS = {
  premium: 'https://buy.stripe.com/test_bIYg0X9EG9pTgZqfYY',
  pro: 'https://buy.stripe.com/test_4gwaGD18a31v24w6op',
} as const;

type PlanType = keyof typeof PAYMENT_LINKS;

const plans = [
  {
    name: 'Premium Meditation',
    price: '$9.99',
    interval: 'month',
    type: 'premium' as PlanType,
    features: [
      'Create unlimited meditations',
      'Access to all voices',
      'Background music library',
      'Download meditations',
      'Basic analytics',
    ],
  },
  {
    name: 'Pro Meditation',
    price: '$19.99',
    interval: 'month',
    type: 'pro' as PlanType,
    features: [
      'Everything in Premium',
      'Advanced customization',
      'Priority support',
      'Early access to new features',
      'Detailed analytics',
      'Custom branding',
    ],
    popular: true,
  }
];

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState<PlanType | null>(null);

  const handlePlanSelect = async (plan: PlanType) => {
    try {
      setIsLoading(plan);

      if (!user) {
        // Store selected plan in localStorage and redirect to auth
        localStorage.setItem('selectedPlan', plan);
        navigate('/auth');
        return;
      }

      const paymentLink = PAYMENT_LINKS[plan];
      
      if (!paymentLink) {
        throw new Error('Invalid plan selected');
      }

      // Redirect to Stripe Payment Link
      window.location.href = paymentLink;
    } catch (error) {
      console.error('Error redirecting to payment:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-meditation-light-blue/10 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-meditation-deep-blue mb-4">
            Choose Your Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the plan that best fits your meditation practice and creative needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.type}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-meditation-calm-blue' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-meditation-calm-blue text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-meditation-deep-blue mb-4">
                  {plan.name}
                </h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-meditation-deep-blue">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 ml-2">/{plan.interval}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-meditation-calm-blue hover:bg-meditation-calm-blue/90'
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => handlePlanSelect(plan.type)}
                  disabled={isLoading !== null}
                >
                  {isLoading === plan.type ? 'Processing...' : 'Get Started'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600">
            All plans include a 30-day money-back guarantee.
            <br />
            Questions? Contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 