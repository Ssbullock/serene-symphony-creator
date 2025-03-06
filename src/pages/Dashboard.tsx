import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Play, Download, Trash, Clock, Settings, LogOut, User, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const savedMeditations = [
  {
    id: 1,
    title: "Morning Mindfulness",
    duration: "10 minutes",
    style: "Mindfulness",
    created: "2 days ago",
    thumbnail: "meditation-calm-blue"
  },
  {
    id: 2,
    title: "Deep Sleep Relaxation",
    duration: "20 minutes",
    style: "Body Scan",
    created: "1 week ago",
    thumbnail: "meditation-deep-blue"
  },
  {
    id: 3,
    title: "Anxiety Relief",
    duration: "15 minutes",
    style: "Breathwork",
    created: "3 days ago",
    thumbnail: "meditation-soft-blue"
  },
  {
    id: 4,
    title: "Focus & Clarity",
    duration: "8 minutes",
    style: "Visualization",
    created: "Yesterday",
    thumbnail: "meditation-light-blue"
  }
];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  const filteredMeditations = savedMeditations.filter(meditation => 
    meditation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meditation.style.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    toast({
      title: "Meditation deleted",
      description: "The meditation has been removed from your library."
    });
  };

  const handlePlay = (id: number) => {
    toast({
      title: "Now playing",
      description: "Your meditation is starting..."
    });
  };

  const handleDownload = (id: number) => {
    toast({
      title: "Download started",
      description: "Your meditation is being downloaded."
    });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account."
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was a problem logging you out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-meditation-tranquil">
      <aside className="w-64 h-screen bg-white border-r border-gray-100 p-5 flex flex-col fixed left-0 top-0">
        <div className="flex items-center mb-10">
          <div className="h-8 w-8 rounded-full bg-meditation-calm-blue"></div>
          <span className="text-xl font-medium ml-2">Serene</span>
        </div>

        <div className="flex-1">
          <nav className="space-y-1">
            <Link to="/dashboard" className="flex items-center px-3 py-2 text-md font-medium rounded-md bg-meditation-light-blue text-foreground">
              <Clock className="mr-3 h-5 w-5" />
              My Meditations
            </Link>
            
            <Link to="/create" className="flex items-center px-3 py-2 text-md font-medium rounded-md text-foreground/70 hover:bg-meditation-light-blue/50 hover:text-foreground transition-colors">
              <Plus className="mr-3 h-5 w-5" />
              Create New
            </Link>

            <Link to="/settings" className="flex items-center px-3 py-2 text-md font-medium rounded-md text-foreground/70 hover:bg-meditation-light-blue/50 hover:text-foreground transition-colors">
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Link>
          </nav>
        </div>

        <div className="mt-auto">
          <div className="flex items-center px-3 py-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-meditation-calm-blue flex items-center justify-center text-white">
              <User size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                {user?.user_metadata?.name || 'User'}
              </p>
              <p className="text-xs text-foreground/60">Premium Plan</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex w-full items-center px-3 py-2 text-sm font-medium rounded-md text-foreground/70 hover:bg-meditation-light-blue/50 hover:text-foreground transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Welcome back, Alex</h1>
                <p className="text-foreground/70 mt-1">Your meditation journey continues</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link to="/create" className="btn-primary flex items-center animate-pulse-soft">
                  <Plus size={18} className="mr-2" />
                  Create Meditation
                </Link>
              </div>
            </div>
          </header>

          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" size={18} />
              <Input 
                type="text" 
                placeholder="Search your meditations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-gray-200"
              />
            </div>
          </div>

          <section>
            <h2 className="text-xl font-semibold mb-6">Your Meditations</h2>
            
            {filteredMeditations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-foreground/70 mb-4">No meditations found.</p>
                <Link to="/create" className="btn-primary">
                  Create Your First Meditation
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMeditations.map((meditation) => (
                  <Card key={meditation.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                    <div className={`h-3 bg-${meditation.thumbnail}`}></div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg mb-2">{meditation.title}</h3>
                      <div className="flex items-center text-sm text-foreground/70 mb-4">
                        <span className="mr-3">{meditation.duration}</span>
                        <span className="mr-3">•</span>
                        <span>{meditation.style}</span>
                      </div>
                      <div className="text-xs text-foreground/60 mb-4">
                        Created {meditation.created}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-meditation-calm-blue hover:bg-meditation-calm-blue/90 text-white"
                          onClick={() => handlePlay(meditation.id)}
                        >
                          <Play size={16} className="mr-1" />
                          Play
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownload(meditation.id)}
                        >
                          <Download size={16} className="mr-1" />
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                          onClick={() => handleDelete(meditation.id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
