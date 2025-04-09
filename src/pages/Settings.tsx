import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, CheckCircle, CreditCard, User, Bell, Shield, HelpCircle, ExternalLink } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = useState("monthly"); // Assume default is monthly
  const isMobile = useIsMobile();

  const getPortalUrl = () => {
    const baseUrl = 'https://billing.stripe.com/p/login/test_14k3cWagG6zz1S8fYY';
    const email = user?.email;
    if (!email) return baseUrl;
    return `${baseUrl}?prefilled_email=${encodeURIComponent(email)}`;
  };

  const handleUpgrade = (plan: string) => {
    // In a real app, this would trigger a payment flow
    toast({
      title: "Upgrading subscription",
      description: `Processing upgrade to ${plan} plan...`,
    });
  };

  const handleCancel = () => {
    // In a real app, this would cancel the subscription
    toast({
      title: "Subscription cancelled",
      description: "Your subscription will remain active until the end of the billing period.",
    });
  };

  return (
    <div className="min-h-screen flex bg-meditation-tranquil">
      {/* Main content */}
      <main className={`flex-1 ${isMobile ? 'ml-0 p-4' : 'ml-64 p-8'}`}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center">
              <Link to="/dashboard" className="mr-4">
                <ArrowLeft className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-foreground/70 mt-1">Manage your account and preferences</p>
              </div>
            </div>
          </header>

          {/* Settings Tabs */}
          <Tabs defaultValue="subscription" className="w-full">
            {/* Fixed the mobile TabsList layout to use flex-wrap and smaller tabs for better mobile display */}
            <TabsList className={`${isMobile ? 'flex flex-wrap gap-2 justify-start mb-4' : 'grid grid-cols-5 gap-2'} w-full max-w-3xl mb-8`}>
              <TabsTrigger value="subscription" className={isMobile ? 'text-sm px-3 py-1.5' : ''}>Subscription</TabsTrigger>
              <TabsTrigger value="account" className={isMobile ? 'text-sm px-3 py-1.5' : ''}>Account</TabsTrigger>
              <TabsTrigger value="notifications" className={isMobile ? 'text-sm px-3 py-1.5' : ''}>Notifications</TabsTrigger>
              <TabsTrigger value="privacy" className={isMobile ? 'text-sm px-3 py-1.5' : ''}>Privacy</TabsTrigger>
              <TabsTrigger value="help" className={isMobile ? 'text-sm px-3 py-1.5' : ''}>Help</TabsTrigger>
            </TabsList>

            <TabsContent value="subscription" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Management</CardTitle>
                  <CardDescription>
                    Manage your subscription plan and billing information
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-8">
                  <Button 
                    onClick={() => window.location.href = getPortalUrl()}
                    className="flex items-center gap-2 bg-meditation-deep-blue hover:bg-meditation-deep-blue/90 text-white px-6 py-3"
                  >
                    <ExternalLink size={18} />
                    Manage Subscription
                  </Button>
                  <p className="text-sm text-foreground/60 mt-4 text-center max-w-md">
                    Click above to access the customer portal where you can manage your subscription, view billing history, and update payment methods.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your profile and account details</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Account settings content will go here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Notification settings content will go here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy & Security</CardTitle>
                  <CardDescription>Manage your privacy and security settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Privacy and security content will go here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="help">
              <Card>
                <CardHeader>
                  <CardTitle>Help & Support</CardTitle>
                  <CardDescription>Get help with your account and meditation journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Help and support content will go here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Settings;
