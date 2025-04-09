import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        
        if (!sessionId) {
          throw new Error('No session ID found');
        }

        // Wait a moment for webhook to process
        await new Promise(resolve => setTimeout(resolve, 2000));

        toast({
          title: "Welcome to Premium!",
          description: "Your account has been upgraded successfully.",
          variant: "default",
        });
        
        setIsVerifying(false);
      } catch (error) {
        console.error('Error verifying payment:', error);
        toast({
          title: "Verification Error",
          description: "There was an issue verifying your payment. Please contact support.",
          variant: "destructive",
        });
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, toast]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-meditation-light-blue/10">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-meditation-calm-blue mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-meditation-deep-blue mb-2">
            Finalizing your upgrade...
          </h2>
          <p className="text-gray-600">
            Please wait while we set up your premium features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-meditation-light-blue/10">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-meditation-deep-blue mb-4">
            Welcome to Premium!
          </h2>
          <p className="text-gray-600 mb-8">
            Your account has been upgraded. You now have access to all premium features.
          </p>
          <div className="space-y-4">
            <Button
              className="w-full bg-meditation-calm-blue hover:bg-meditation-calm-blue/90"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/create')}
            >
              Create Your First Premium Meditation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 