
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, CheckCircle, CreditCard, User, Bell, Shield, HelpCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = useState("monthly"); // Assume default is monthly
  const isMobile = useIsMobile();

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
                <CardContent>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Current Plan</h3>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                        <div>
                          <p className="font-medium text-lg">Monthly Plan</p>
                          <p className="text-foreground/70">$12.99 per month</p>
                          <p className="text-sm text-foreground/50 mt-1">Next billing date: November 15, 2023</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center self-start md:self-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Active
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Upgrade Your Plan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border-2 border-meditation-deep-blue">
                        <CardHeader className="pb-2">
                          <CardTitle>Annual Plan</CardTitle>
                          <CardDescription>Save 42% compared to monthly</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">$74.99<span className="text-sm font-normal text-foreground/70">/year</span></p>
                          <ul className="mt-4 space-y-2">
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span>All Monthly features</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span>Priority support</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span>Early access to new features</span>
                            </li>
                          </ul>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            onClick={() => handleUpgrade("annual")} 
                            className="w-full bg-meditation-deep-blue hover:bg-meditation-deep-blue/90"
                          >
                            Upgrade to Annual
                          </Button>
                        </CardFooter>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle>Lifetime Access</CardTitle>
                          <CardDescription>One-time payment, forever access</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">$199.99<span className="text-sm font-normal text-foreground/70"> one-time</span></p>
                          <ul className="mt-4 space-y-2">
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span>All Annual features</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span>Never pay again</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span>VIP support</span>
                            </li>
                          </ul>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            onClick={() => handleUpgrade("lifetime")} 
                            variant="outline"
                            className="w-full border-meditation-deep-blue text-meditation-deep-blue hover:bg-meditation-light-blue/20"
                          >
                            Get Lifetime Access
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start">
                  <Button 
                    onClick={handleCancel}
                    variant="link" 
                    className="text-red-500 hover:text-red-600 px-0 h-auto font-normal"
                  >
                    Cancel subscription
                  </Button>
                  <p className="text-sm text-foreground/50 mt-1">
                    Your subscription will remain active until the end of your current billing period.
                  </p>
                </CardFooter>
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
