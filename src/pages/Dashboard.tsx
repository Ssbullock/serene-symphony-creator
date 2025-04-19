import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Meditation } from '@/types/meditation';
import {
  ChevronRight,
  Copy,
  Edit,
  Loader2,
  MoreVertical,
  Plus,
  Trash,
  Waves,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useUser } from '@/hooks/use-user';
import { cn } from '@/lib/utils';
import { generateMeditation } from '@/utils/openai';
import { Skeleton } from "@/components/ui/skeleton"

interface MeditationFormValues {
  title: string;
  duration: number;
  style: string;
  backgroundSound: string;
  voiceId: string;
  script: string;
}

const Dashboard = () => {
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState<MeditationFormValues>({
    title: '',
    duration: 5,
    style: 'Mindfulness',
    backgroundSound: 'Ocean Waves',
    voiceId: '1',
    script: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeditations = async () => {
      const { data, error } = await supabase
        .from('meditations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching meditations:', error);
        return;
      }

      setMeditations(data as Meditation[]);
    };

    fetchMeditations();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const generateScript = async () => {
    setIsGenerating(true);
    try {
      const script = await generateMeditation(formValues);
      setFormValues({
        ...formValues,
        script: script || '',
      });
    } catch (error) {
      console.error('Error generating script:', error);
      toast({
        title: 'Error generating script',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.from('meditations').insert([
        {
          ...formValues,
          userId: user.id,
        },
      ]);

      if (error) {
        throw new Error(error.message);
      }

      setMeditations((prevMeditations) => [
        {
          id: data![0].id,
          title: formValues.title,
          duration: formValues.duration,
          style: formValues.style,
          backgroundSound: formValues.backgroundSound,
          voiceId: formValues.voiceId,
          script: formValues.script,
          createdAt: new Date().toISOString(),
          userId: user.id,
        },
        ...prevMeditations,
      ]);

      toast({
        title: 'Success',
        description: 'Meditation saved successfully.',
      });

      setIsSidebarOpen(false);
      setFormValues({
        title: '',
        duration: 5,
        style: 'Mindfulness',
        backgroundSound: 'Ocean Waves',
        voiceId: '1',
        script: '',
      });
    } catch (error: any) {
      console.error('Error saving meditation:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to save meditation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsFetching(true);
    try {
      const { error } = await supabase.from('meditations').delete().eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      setMeditations((prevMeditations) => prevMeditations.filter((meditation) => meditation.id !== id));

      toast({
        title: 'Success',
        description: 'Meditation deleted successfully.',
      });
    } catch (error: any) {
      console.error('Error deleting meditation:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to delete meditation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/meditation/${id}`);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
    });
  };

  return (
    <div className="min-h-screen bg-background antialiased">
      <div className="flex">
        <div
          className={cn(
            'bg-secondary w-64 flex-shrink-0 border-r border-border h-screen py-4 px-2 transition-transform duration-300 transform md:translate-x-0',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="font-bold text-lg">
              Serene Symphony
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
              X
            </button>
          </div>

          <div className="mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Meditation
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Create Meditation</SheetTitle>
                  <SheetDescription>
                    Craft your personalized meditation script with ease.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      type="text"
                      id="title"
                      name="title"
                      value={formValues.title}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="duration" className="text-right">
                      Duration
                    </Label>
                    <Input
                      type="number"
                      id="duration"
                      name="duration"
                      value={formValues.duration}
                      onChange={handleInputChange}
                      className="col-span-3"
                      min="1"
                      max="60"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="style" className="text-right">
                      Style
                    </Label>
                    <select
                      id="style"
                      name="style"
                      value={formValues.style}
                      onChange={handleSelectChange}
                      className="col-span-3 bg-background border border-input rounded-md px-3 py-2 focus:outline-none focus:border-primary"
                    >
                      <option value="Mindfulness">Mindfulness</option>
                      <option value="Breathwork">Breathwork</option>
                      <option value="Body Scan">Body Scan</option>
                      <option value="Loving-Kindness">Loving-Kindness</option>
                      <option value="Visualization">Visualization</option>
                      <option value="Guided Imagery">Guided Imagery</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="backgroundSound" className="text-right">
                      Background Sound
                    </Label>
                    <select
                      id="backgroundSound"
                      name="backgroundSound"
                      value={formValues.backgroundSound}
                      onChange={handleSelectChange}
                      className="col-span-3 bg-background border border-input rounded-md px-3 py-2 focus:outline-none focus:border-primary"
                    >
                      <option value="Ocean Waves">Ocean Waves</option>
                      <option value="Rain">Rain</option>
                      <option value="Forest">Forest</option>
                      <option value="Birds">Birds</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="voiceId" className="text-right">
                      Voice
                    </Label>
                    <select
                      id="voiceId"
                      name="voiceId"
                      value={formValues.voiceId}
                      onChange={handleSelectChange}
                      className="col-span-3 bg-background border border-input rounded-md px-3 py-2 focus:outline-none focus:border-primary"
                    >
                      <option value="1">Voice 1</option>
                      <option value="2">Voice 2</option>
                      <option value="3">Voice 3</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="script" className="text-right">
                      Script
                    </Label>
                    <div className="col-span-3">
                      <Textarea
                        id="script"
                        name="script"
                        value={formValues.script}
                        onChange={handleInputChange}
                        className="resize-none"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={generateScript}
                        disabled={isGenerating}
                        className="mt-2 w-full"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          'Generate Script'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    'Save Meditation'
                  )}
                </Button>
              </SheetContent>
            </Sheet>
          </div>

          <nav>
            <ul className="space-y-2">
              <li>
                <Link to="/account" className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-accent hover:text-accent-foreground">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.image} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>Account</span>
                </Link>
              </li>
              <li>
                <Link to="/" className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-accent hover:text-accent-foreground">
                  <Waves className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex-1 p-4">
          <div className="md:hidden mb-4">
            <Button onClick={() => setIsSidebarOpen(true)}>Open Menu</Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {meditations.length === 0 && !isFetching ? (
              <p className="text-muted-foreground">No meditations found. Create one to get started.</p>
            ) : (
              meditations.map((meditation) => (
                <div key={meditation.id} className="bg-card rounded-lg shadow-sm overflow-hidden">
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{meditation.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {meditation.style} - {meditation.duration} minutes
                    </p>
                    <p className="text-muted-foreground text-sm line-clamp-3">{meditation.script}</p>
                  </div>
                  <div className="border-t border-border p-2 flex justify-between items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyToClipboard(meditation.script)}
                      className="space-x-1.5"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(meditation.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(meditation.id)} disabled={isFetching}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
             {isFetching && (
              <>
                <Skeleton className="h-40 w-full rounded-md" />
                <Skeleton className="h-40 w-full rounded-md" />
                <Skeleton className="h-40 w-full rounded-md" />
                <Skeleton className="h-40 w-full rounded-md" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
