import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Plus, Play, Pause, Download, Trash, Clock, Settings, LogOut, User, Search, Menu, X, Info, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/use-user";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from "date-fns";

interface Meditation {
  id: string;
  title: string;
  duration: number;
  style: string;
  audio_url: string;
  created_at: string;
  background: string;
  voice: string;
}

const Dashboard = () => {
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const firstName = user?.user_metadata?.name?.split(' ')[0] || 'there';

  useEffect(() => {
    const fetchMeditations = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('meditations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setMeditations(data || []);
      } catch (error) {
        console.error('Error fetching meditations:', error);
        toast({
          title: "Error",
          description: "Failed to load your meditations",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMeditations();
  }, [user]);

  const filteredMeditations = meditations.filter(meditation => 
    meditation.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadAudio = async (url: string): Promise<HTMLAudioElement> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      
      const onCanPlay = () => {
        audio.removeEventListener('canplaythrough', onCanPlay);
        audio.removeEventListener('error', onError);
        resolve(audio);
      };
      
      const onError = (e: Event) => {
        audio.removeEventListener('canplaythrough', onCanPlay);
        audio.removeEventListener('error', onError);
        reject(new Error(`Failed to load audio: ${(e as ErrorEvent).message}`));
      };
      
      audio.addEventListener('canplaythrough', onCanPlay);
      audio.addEventListener('error', onError);
      
      const timeout = setTimeout(() => {
        audio.removeEventListener('canplaythrough', onCanPlay);
        audio.removeEventListener('error', onError);
        reject(new Error('Audio loading timed out'));
      }, 10000);
      
      audio.load();
      
      audio.addEventListener('canplaythrough', () => clearTimeout(timeout));
      audio.addEventListener('error', () => clearTimeout(timeout));
    });
  };

  const handlePlayPause = async (id: string, audioUrl: string) => {
    if (playingId === id) {
      if (audioRef.current) {
        audioRef.current.pause();
        setPlayingId(null);
        audioRef.current = null;
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      if (!audioUrl) {
        console.error("Audio URL is missing for meditation:", id);
        toast({
          title: "Playback Error",
          description: "Audio URL is missing for this meditation.",
          variant: "destructive"
        });
        return;
      }
      
      try {
        // Try playing with background audio first
        const withBgUrl = audioUrl.includes('supabase.co') 
          ? audioUrl.replace('.mp3', '_with_bg.mp3')
          : audioUrl;
        
        console.log(`Attempting to load audio: ${withBgUrl}`);
        
        try {
          const audio = await loadAudio(withBgUrl);
          audio.addEventListener('ended', () => {
            setPlayingId(null);
            audioRef.current = null;
          });
          
          audioRef.current = audio;
          await audio.play();
          setPlayingId(id);
        } catch (bgError) {
          // Fallback to original version if background version fails
          console.log('Background version failed, trying original:', audioUrl);
          const audio = await loadAudio(audioUrl);
          
          audio.addEventListener('ended', () => {
            setPlayingId(null);
            audioRef.current = null;
          });
          
          audioRef.current = audio;
          await audio.play();
          setPlayingId(id);
        }
      } catch (error) {
        console.error("Error playing audio:", error);
        toast({
          title: "Playback Error",
          description: error instanceof Error ? error.message : "Failed to play meditation audio",
          variant: "destructive"
        });
        setPlayingId(null);
        audioRef.current = null;
      }
    }
  };

  const handleDownload = async (meditation: Meditation) => {
    try {
      setLoading(true);
      
      const withBgUrl = meditation.audio_url.includes('supabase.co') 
        ? meditation.audio_url.replace('.mp3', '_with_bg.mp3')
        : meditation.audio_url;
      
      const downloadFile = async (url: string, fallbackUrl?: string) => {
        try {
          const checkResponse = await fetch(url, { method: 'HEAD' });
          
          if (checkResponse.ok) {
            const link = document.createElement('a');
            link.href = url;
            link.download = `${meditation.title || 'Meditation'}.mp3`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return true;
          } else if (fallbackUrl) {
            console.log(`File not found at ${url}, trying fallback...`);
            return downloadFile(fallbackUrl);
          }
          return false;
        } catch (error) {
          console.error(`Error downloading from ${url}:`, error);
          if (fallbackUrl) {
            console.log('Trying fallback URL...');
            return downloadFile(fallbackUrl);
          }
          return false;
        }
      };
      
      const downloaded = await downloadFile(withBgUrl, meditation.audio_url);
      
      if (downloaded) {
        toast({
          title: "Download Started",
          description: "Your meditation is being downloaded",
          variant: "default"
        });
      } else {
        throw new Error("Could not download meditation file");
      }
    } catch (error) {
      console.error('Error downloading meditation:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download meditation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (meditationId: string) => {
    try {
      setLoading(true);
      
      const { error: supabaseError } = await supabase
        .from('meditations')
        .delete()
        .eq('id', meditationId);
      
      if (supabaseError) {
        console.error('Error deleting from Supabase:', supabaseError);
        throw new Error('Failed to delete meditation from database');
      }
      
      const response = await fetch('http://localhost:3000/api/delete-meditation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meditationId
        }),
      });
      
      if (!response.ok) {
        console.warn(`Delete files request failed with status ${response.status}`);
      }
      
      setMeditations(meditations.filter(m => m.id !== meditationId));
      
      toast({
        title: "Meditation Deleted",
        description: "Your meditation has been permanently deleted.",
        variant: "default"
      });
      
    } catch (error) {
      console.error('Error deleting meditation:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete meditation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCreationDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "Recently";
    }
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
      <button 
        onClick={() => isMobile && setSidebarOpen(false)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md"
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } transition-transform duration-300 ease-in-out w-64 h-screen bg-white border-r border-gray-100 p-5 flex flex-col fixed left-0 top-0 z-40 md:translate-x-0`}
      >
        <div className="flex items-center mb-10 mt-4 md:mt-0">
          <div className="relative h-8 w-8 mr-2">
            <div className="absolute inset-0 bg-meditation-calm-blue rounded-full animate-breathe opacity-20"></div>
            <div className="absolute inset-1 bg-meditation-calm-blue rounded-full animate-breathe opacity-40" style={{ animationDelay: "0.5s" }}></div>
            <div className="absolute inset-2 bg-meditation-calm-blue rounded-full animate-breathe opacity-60" style={{ animationDelay: "1s" }}></div>
            <div className="absolute inset-3 bg-meditation-calm-blue rounded-full animate-breathe opacity-80" style={{ animationDelay: "1.5s" }}></div>
          </div>
          <span className="text-xl font-medium ml-2">Serene</span>
        </div>

        <div className="flex-1">
          <nav className="space-y-1">
            <Link 
              to="/dashboard" 
              className="flex items-center px-3 py-2 text-md font-medium rounded-md bg-meditation-light-blue text-foreground"
              onClick={() => isMobile && setSidebarOpen(false)}
            >
              <Clock className="mr-3 h-5 w-5" />
              My Meditations
            </Link>
            
            <Link 
              to="/create" 
              className="flex items-center px-3 py-2 text-md font-medium rounded-md text-foreground/70 hover:bg-meditation-light-blue/50 hover:text-foreground transition-colors"
              onClick={() => isMobile && setSidebarOpen(false)}
            >
              <Plus className="mr-3 h-5 w-5" />
              Create New
            </Link>

            <Link 
              to="/advanced-create" 
              className="flex items-center px-3 py-2 text-md font-medium rounded-md text-foreground/70 hover:bg-meditation-light-blue/50 hover:text-foreground transition-colors"
              onClick={() => isMobile && setSidebarOpen(false)}
            >
              <ChevronRight className="mr-3 h-5 w-5" />
              Advanced Create
            </Link>
            
            <Link 
              to="/settings" 
              className="flex items-center px-3 py-2 text-md font-medium rounded-md text-foreground/70 hover:bg-meditation-light-blue/50 hover:text-foreground transition-colors"
              onClick={() => isMobile && setSidebarOpen(false)}
            >
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

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden" 
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <main className={`flex-1 p-6 sm:p-8 transition-all duration-300 ${
        isMobile ? 'ml-0 mt-16' : 'md:ml-64'
      }`}>
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {firstName}</h1>
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
            <div className="flex items-center mb-6">
              <h2 className="text-xl font-semibold">Your Meditations</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="ml-2 text-gray-500 hover:text-gray-700 transition-colors">
                      <Info size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs bg-white p-3 rounded-lg shadow-lg">
                    <p className="text-sm">Your meditations become more helpful the more specific they are to your personal goals. Include details about what you want to achieve in your meditation script.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-48"></div>
                ))}
              </div>
            ) : filteredMeditations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMeditations.map((meditation) => (
                  <div 
                    key={meditation.id} 
                    className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className={`h-2 ${
                      meditation.style === 'mindfulness' ? 'bg-blue-400' :
                      meditation.style === 'breathwork' ? 'bg-green-400' :
                      meditation.style === 'bodyscan' ? 'bg-purple-400' :
                      meditation.style === 'visualization' ? 'bg-yellow-400' :
                      'bg-gray-400'
                    }`}></div>
                    <div className="p-5">
                      <h3 className="font-semibold text-lg mb-1">{meditation.title}</h3>
                      <div className="flex items-center text-sm text-foreground/70 mb-3">
                        <span>{meditation.duration} minutes</span>
                        <span className="mx-2">•</span>
                        <span>{meditation.style}</span>
                      </div>
                      <p className="text-xs text-foreground/50 mb-4">
                        Created {formatCreationDate(meditation.created_at)}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handlePlayPause(meditation.id, meditation.audio_url)}
                          className="flex items-center"
                        >
                          {playingId === meditation.id ? (
                            <>
                              <Pause size={16} className="mr-1" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play size={16} className="mr-1" />
                              Play
                            </>
                          )}
                        </Button>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDownload(meditation)}
                          >
                            <Download size={16} />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash size={16} className="text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Meditation</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{meditation.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(meditation.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="mx-auto w-16 h-16 bg-meditation-light-blue rounded-full flex items-center justify-center mb-4">
                  <Info size={24} className="text-meditation-deep-blue" />
                </div>
                <h3 className="text-lg font-medium mb-2">No meditations found</h3>
                <p className="text-foreground/70 mb-6">
                  {searchQuery ? 
                    "No meditations match your search query." : 
                    "You haven't created any meditations yet."}
                </p>
                <Link to="/create">
                  <Button>
                    <Plus size={18} className="mr-2" />
                    Create Your First Meditation
                  </Button>
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
