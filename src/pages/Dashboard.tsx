import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Plus, Play, Pause, Download, Trash, Clock, Settings, LogOut, User, Search, Menu, X, Info, Mic, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
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
import api from '@/lib/api';
import { UpgradePremiumModal } from "@/components/UpgradePremiumModal";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import AudioPlayerBar from "@/components/AudioPlayerBar";
import { Meditation } from "@/types/meditation";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface MeditationWithAudio extends Meditation {
  audio_url: string;
  created_at: string;
  background: string;
  voice: string;
  feedback?: string;
}

const Dashboard = () => {
  const [meditations, setMeditations] = useState<MeditationWithAudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentMeditation, setCurrentMeditation] = useState<MeditationWithAudio | null>(null);
  const [lastPlayedId, setLastPlayedId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('free');
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackMeditationId, setFeedbackMeditationId] = useState<string | null>(null);
  const [savingFeedback, setSavingFeedback] = useState(false);
  const FEEDBACK_DELIMITER = '\n---\n';

  // Use the original audio URL without background music by default
  const audioPlayer = useAudioPlayer(
    currentMeditation?.audio_url || null,
    currentMeditation?.background || null
  );

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
        if (Array.isArray(data)) {
          setMeditations(
            data.map((row) => ({
              ...(row as unknown as MeditationWithAudio)
            }))
          );
        } else {
          setMeditations([]);
        }
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

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;
      try {
        const { data, error } = await supabase
          .from('users')
          .select('subscription_status')
          .eq('id', user.id)
          .single();
        if (error) throw error;
        if (data?.subscription_status) {
          setSubscriptionStatus(data.subscription_status as string);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, [user?.id]);

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

  const handlePlayPause = async (meditation: MeditationWithAudio) => {
    const id = meditation.id;
    
    if (playingId === id) {
      // Currently playing this meditation, so toggle play/pause
      if (audioPlayer?.isPlaying) {
        audioPlayer.pause();
      } else {
        audioPlayer.play().catch(error => {
          console.error("Error playing audio:", error);
          toast({
            title: "Playback Error",
            description: "Failed to play meditation audio",
            variant: "destructive"
          });
        });
      }
    } else {
      // New meditation or switching meditation
      if (audioPlayer) {
        audioPlayer.pause();
      }
      
      try {
        // Set the current meditation before attempting to play
        setCurrentMeditation(meditation);
        setPlayingId(id);
        
        // The useAudioPlayer hook will initialize with the new meditation URL
        // We'll let the effect in this component handle the play action
      } catch (error) {
        console.error("Error preparing audio:", error);
        toast({
          title: "Playback Error",
          description: error instanceof Error ? error.message : "Failed to play meditation audio",
          variant: "destructive"
        });
        setPlayingId(null);
        setCurrentMeditation(null);
      }
    }
  };

  // Start playing when currentMeditation changes and audioPlayer is available
  useEffect(() => {
    if (
      currentMeditation &&
      audioPlayer &&
      playingId &&
      playingId !== lastPlayedId
    ) {
      audioPlayer.play().catch(error => {
        console.error("Error playing audio:", error);
        toast({
          title: "Playback Error",
          description: "Failed to play meditation audio",
          variant: "destructive"
        });
        setPlayingId(null);
        setCurrentMeditation(null);
      });
      setLastPlayedId(playingId);
    }
  }, [currentMeditation, audioPlayer, playingId, lastPlayedId, toast]);

  const handleDownload = async (meditation: MeditationWithAudio) => {
    try {
      setLoading(true);
      
      const withBgUrl = meditation.audio_url.includes('supabase.co') 
        ? meditation.audio_url.includes('_with_bg.mp3')
          ? meditation.audio_url
          : meditation.audio_url.replace('.mp3', '_with_bg.mp3')
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
      const { error: supabaseError } = await supabase
        .from('meditations')
        .delete()
        .eq('id', meditationId);
      
      if (supabaseError) {
        console.error('Error deleting from Supabase:', supabaseError);
        throw new Error('Failed to delete meditation from database');
      }
      
      const response = await api.post('/api/delete-meditation', {
        meditationId
      });
      
      if (!response.ok) {
        console.warn(`Delete files request failed with status ${response.status}`);
      }
      
      setMeditations(meditations.filter(m => m.id !== meditationId));
      
      // If we're deleting the currently playing meditation
      if (meditationId === playingId) {
        if (audioPlayer) {
          audioPlayer.pause();
        }
        setPlayingId(null);
        setCurrentMeditation(null);
      }
      
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

  // Calculate bottom padding when audio player is active
  const mainContentStyles = playingId ? 
    { paddingBottom: 'calc(8rem + env(safe-area-inset-bottom, 0))' } : {};

  // Function to open modal and load feedback
  const openFeedbackModal = async (meditation: MeditationWithAudio) => {
    setFeedbackMeditationId(meditation.id);
    setFeedback("");
  };

  // Function to save feedback
  const handleSaveFeedback = async () => {
    if (!feedbackMeditationId) return;
    setSavingFeedback(true);
    const { error } = await supabase
      .from('meditations')
      .update({ feedback })
      .eq('id', feedbackMeditationId);
    setSavingFeedback(false);
    if (error) {
      toast({ title: "Error", description: "Failed to save feedback", variant: "destructive" });
    } else {
      toast({ title: "Feedback Saved", description: "Your feedback has been saved.", variant: "default" });
      // Optionally update local state
      setMeditations(meditations => meditations.map(m => m.id === feedbackMeditationId ? { ...m, feedback } : m));
    }
  };

  return (
    <div className="min-h-screen flex bg-meditation-tranquil">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
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
              className="flex items-center px-3 py-2 text-md font-medium rounded-xl relative group bg-white transition-all hover:bg-gray-50 hover:scale-[1.02] hover:text-foreground"
              style={{
                border: '2px solid transparent',
                backgroundImage: 'linear-gradient(white, white), linear-gradient(90deg, #3B82F6, #2DD4BF)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                boxShadow: '0 1px 10px rgba(59, 130, 246, .08)'
              }}
              onClick={() => isMobile && setSidebarOpen(false)}
            >
              <Mic className="mr-3 h-5 w-5 text-foreground/70" />
              <span className="text-foreground/70">Advanced Create</span>
              <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold rounded bg-gradient-to-r from-[#3B82F6] to-[#2DD4BF] bg-clip-text text-transparent">
                Premium
              </span>
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

        <div className="mb-3 flex flex-col gap-2">
          <Button
            className="w-full py-2 font-semibold rounded-xl border-0 bg-white transition hover:bg-gray-100"
            style={{
              fontSize: "1rem",
              marginBottom: '0.5rem',
            }}
            onClick={() => setPremiumModalOpen(true)}
          >
            <span
              className="bg-gradient-to-r from-[#3B82F6] to-[#2DD4BF] bg-clip-text text-transparent font-bold"
              style={{
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Upgrade to Premium
            </span>
          </Button>
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
              <p className="text-xs text-foreground/60 capitalize">
                {subscriptionStatus === 'free' ? 'Free Plan' :
                 subscriptionStatus === 'premium' ? 'Premium Plan' :
                 subscriptionStatus === 'lifetime' ? 'Lifetime Plan' :
                 'Free Plan'}
              </p>
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

      <main 
        className={`flex-1 p-4 sm:p-8 transition-all duration-300 ${
          isMobile ? 'ml-0 mt-16' : 'md:ml-64'
        }`}
        style={mainContentStyles}
      >
        <div className="w-full mx-auto">
          <header className="mb-8 w-full px-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {firstName}</h1>
                <p className="text-foreground/70 mt-1">Your meditation journey continues</p>
              </div>
              <div className="mt-4 md:mt-0 w-full md:w-auto flex-shrink-0">
                <Link to="/create" className="btn-primary-gradient flex items-center w-full md:w-auto justify-center">
                  <Plus size={18} className="mr-2" />
                  Create Meditation
                </Link>
              </div>
            </div>
          </header>

          <div className="mb-8 w-full px-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" size={18} />
              <Input
                type="text"
                placeholder="Search your meditations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-gray-200 w-full"
              />
            </div>
          </div>
          
          <section>
            <div className="flex items-center mb-6 px-2">
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
              <div className="flex flex-col gap-3 w-full">
                {filteredMeditations.map((meditation) => {
                  const isPlaying = playingId === meditation.id && audioPlayer?.isPlaying;
                  const styleColor =
                    meditation.style === 'mindfulness' ? 'border-blue-400' :
                    meditation.style === 'breathwork' ? 'border-green-400' :
                    meditation.style === 'bodyscan' ? 'border-purple-400' :
                    meditation.style === 'visualization' ? 'border-yellow-400' :
                    'border-gray-400';
                  return (
                    <div
                      key={meditation.id}
                      className={`flex items-center bg-white rounded-lg shadow-sm border border-gray-100 px-2 py-2 transition hover:shadow-md w-full ${styleColor} border-l-4 gap-x-1`}
                    >
                      {/* Play/Pause Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePlayPause(meditation)}
                        className="flex-shrink-0"
                      >
                        {isPlaying ? <Pause size={22} /> : <Play size={22} />}
                      </Button>
                      {/* Title and Details */}
                      <div className="flex-1 min-w-0 w-0">
                        <div className="truncate font-semibold text-base text-foreground mb-0.5 w-full">{meditation.title}</div>
                        <div className="flex items-center gap-2 text-xs text-foreground/60 w-full flex-wrap">
                          <span className="capitalize">{meditation.style}</span>
                          <span>•</span>
                          <span>{meditation.duration} min</span>
                        </div>
                      </div>
                      {/* Three Dots Button and Modal */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => openFeedbackModal(meditation)}>
                            <MoreHorizontal size={22} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent
                          className="p-6 transition-all duration-300 fixed bottom-0 left-0 right-0 w-full !w-full !max-w-none rounded-t-2xl animate-slide-up max-h-[75vh] overflow-y-auto"
                        >
                          <div className="mt-6">
                            <h4 className="font-semibold mb-2">Feedback</h4>
                            <textarea
                              className="w-full border rounded-md p-2 mb-2"
                              rows={4}
                              placeholder="Share your thoughts, questions, or insights from this meditation..."
                              value={feedbackMeditationId === meditation.id ? feedback : (meditation.feedback || "")}
                              onChange={e => setFeedback(e.target.value)}
                              disabled={savingFeedback}
                            />
                            <Button
                              className="w-full mb-4"
                              size="sm"
                              onClick={async () => {
                                setSavingFeedback(true);
                                // Prepend new feedback to existing feedback, separated by delimiter
                                const previousFeedback = meditation.feedback || '';
                                const newFeedbackBlock = feedback.trim();
                                let updatedFeedback = newFeedbackBlock;
                                if (previousFeedback) {
                                  updatedFeedback = `${newFeedbackBlock}${FEEDBACK_DELIMITER}${previousFeedback}`;
                                }
                                const { error } = await supabase
                                  .from('meditations')
                                  .update({ feedback: updatedFeedback })
                                  .eq('id', meditation.id);
                                setSavingFeedback(false);
                                if (error) {
                                  toast({ title: "Error", description: "Failed to save feedback", variant: "destructive" });
                                } else {
                                  toast({ title: "Feedback Saved", description: "Your feedback has been saved.", variant: "default" });
                                  setMeditations(prevMeditations => prevMeditations.map(m => m.id === meditation.id ? { ...m, feedback: updatedFeedback } : m));
                                  setFeedback(""); // Clear textarea after save
                                }
                              }}
                              disabled={savingFeedback || !feedbackMeditationId}
                            >
                              {savingFeedback ? "Saving..." : "Save Feedback"}
                            </Button>
                            
                            {/* Moved download and delete buttons here, away from the X */}
                            <div className="flex gap-2 mb-4">
                              <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleDownload(meditation)}
                              >
                                <Download size={16} className="mr-2" />
                                Download
                              </Button>
                              <Button
                                variant="destructive"
                                className="flex-1"
                                onClick={() => handleDelete(meditation.id)}
                              >
                                <Trash size={16} className="mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                          {meditation.feedback && meditation.feedback.split(FEEDBACK_DELIMITER).map((entry, idx) => (
                            <div key={idx} className="mt-4 bg-gray-50 rounded-md p-2 text-xs text-gray-700">
                              <div className="font-semibold mb-1">Feedback</div>
                              <div className="mb-1 whitespace-pre-line">{entry}</div>
                            </div>
                          ))}
                        </DialogContent>
                      </Dialog>
                    </div>
                  );
                })}
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

      {/* Audio Player Bar */}
      {playingId && audioPlayer && (
        <AudioPlayerBar
          title={currentMeditation?.title || ""}
          duration={audioPlayer.duration}
          currentTime={audioPlayer.currentTime}
          isPlaying={audioPlayer.isPlaying}
          onPlay={audioPlayer.play}
          onPause={audioPlayer.pause}
          onSeek={audioPlayer.seek}
          onVolumeChange={audioPlayer.setVolume}
          onClose={() => {
            setPlayingId(null);
            setCurrentMeditation(null);
          }}
        />
      )}

      <UpgradePremiumModal
        open={premiumModalOpen}
        onOpenChange={setPremiumModalOpen}
      />
    </div>
  );
};

export default Dashboard;
