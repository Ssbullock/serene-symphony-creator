
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, Plus, Calendar, Download, Clock3 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/use-user";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Define the Meditation interface to match the database structure
interface Meditation {
  id: string;
  title: string;
  duration: number;
  style: string;
  focus: string;
  background_sound: string | null;
  created_at: string;
  user_id: string;
  voice: string;
  audio_url?: string | null;
}

const Dashboard = () => {
  const { user } = useUser();
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeditations = async () => {
      try {
        setLoading(true);
        
        if (!user) {
          setMeditations([]);
          return;
        }
        
        const { data, error } = await supabase
          .from("meditations")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching meditations:", error);
          return;
        }

        // Cast the data to the Meditation type
        setMeditations(data as Meditation[]);
      } catch (error) {
        console.error("Error in fetchMeditations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeditations();
  }, [user]);

  const renderMeditationList = () => {
    if (loading) {
      return <p>Loading meditations...</p>;
    }

    if (!user) {
      return <p>Please sign in to see your meditations.</p>;
    }

    if (meditations.length === 0) {
      return <p>No meditations created yet. Start creating!</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meditations.map((meditation) => (
          <div key={meditation.id} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">{meditation.title}</h3>
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <Clock3 className="mr-1" size={16} />
              <span>{formatDuration(meditation.duration)}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <Calendar className="mr-1" size={16} />
              <span>Created: {new Date(meditation.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={() => handlePlayMeditation(meditation)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Play className="mr-1" size={16} />
                Play
              </button>
              {meditation.audio_url && (
                <a
                  href={meditation.audio_url}
                  download={`${meditation.title}.mp3`}
                  className="flex items-center text-green-600 hover:text-green-800"
                >
                  <Download className="mr-1" size={16} />
                  Download
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayMeditation = (meditation: Meditation) => {
    // Implement your play meditation logic here
    console.log("Playing meditation:", meditation);
    alert(`Playing: ${meditation.title} (Duration: ${formatDuration(meditation.duration)})`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Meditations</h1>
          <Button asChild>
            <Link to="/create-meditation">
              <Plus className="mr-2" size={20} />
              Create New
            </Link>
          </Button>
        </div>
        
        <Separator className="mb-4" />
        
        {renderMeditationList()}
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
