/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AudioUploader } from './components/AudioUploader';
import { TranscriptView } from './components/TranscriptView';
import { diarizeAudio, DiarizationSegment } from './lib/gemini';
import { Music, History, Trash2, Info, FileAudio } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { motion } from 'motion/react';

interface SavedTranscript {
  id: string;
  name: string;
  date: string;
  segments: DiarizationSegment[];
}

export default function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSegments, setCurrentSegments] = useState<DiarizationSegment[]>([]);
  const [history, setHistory] = useState<SavedTranscript[]>([]);
  const [activeTab, setActiveTab] = useState("upload");
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('diarization_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (name: string, segments: DiarizationSegment[]) => {
    const newEntry: SavedTranscript = {
      id: Date.now().toString(),
      name,
      date: new Date().toLocaleString(),
      segments,
    };
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('diarization_history', JSON.stringify(updatedHistory));
  };

  const deleteFromHistory = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('diarization_history', JSON.stringify(updatedHistory));
  };

  const clearAllHistory = () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      setHistory([]);
      localStorage.removeItem('diarization_history');
    }
  };

  const handleUpload = async (file: File) => {
    setIsProcessing(true);
    setProgress(10);
    setCurrentFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        setProgress(30);
        
        try {
          const segments = await diarizeAudio(base64, file.type);
          setProgress(100);
          setCurrentSegments(segments);
          saveToHistory(file.name, segments);
          setIsProcessing(false);
        } catch (error) {
          console.error(error);
          alert("Failed to process audio. Please try a smaller file or check your connection.");
          setIsProcessing(false);
        }
      };
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary font-sans">
      {/* Header */}
      <header className="glass-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl">
              <Music className="w-5 h-5 text-accent-gold" />
            </div>
            <h1 className="text-xl font-serif italic tracking-wider text-accent-gold">
              TafseerStudio AI
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("history")} className="text-text-secondary hover:text-accent-gold">
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
          <div className="flex justify-center">
            <TabsList className="grid w-[400px] grid-cols-2 p-1 bg-card border border-border rounded-full">
              <TabsTrigger value="upload" className="rounded-full data-[state=active]:bg-accent-gold data-[state=active]:text-black transition-all duration-300 text-text-secondary">
                New Diarization
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-full data-[state=active]:bg-accent-gold data-[state=active]:text-black transition-all duration-300 text-text-secondary">
                History
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="upload" className="space-y-12 focus-visible:outline-none">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-serif italic tracking-tight sm:text-6xl text-text-primary"
              >
                Quran Tafseer <span className="text-accent-gold">Diarization</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-text-secondary leading-relaxed font-light"
              >
                Upload your Tafseer audio and let AI distinguish between Arabic recitation, 
                translation, and explanation with precise timestamps.
              </motion.p>
            </div>

            <div className="space-y-8">
              <AudioUploader 
                onUpload={handleUpload} 
                isProcessing={isProcessing} 
                progress={progress} 
              />

              {audioUrl && (
                <Card className="max-w-2xl mx-auto border border-border shadow-2xl overflow-hidden bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-widest text-text-secondary">Now Playing: {currentFile?.name}</span>
                      </div>
                      <audio controls className="w-full h-10 invert brightness-200" src={audioUrl} />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {currentSegments.length > 0 && (
              <TranscriptView segments={currentSegments} fileName={currentFile?.name} />
            )}

            <Card className="max-w-2xl mx-auto bg-card border border-border shadow-sm">
              <CardContent className="p-6 flex gap-4">
                <div className="bg-accent-gold/10 p-2 rounded-lg h-fit">
                  <Info className="w-5 h-5 text-accent-gold" />
                </div>
                <div className="text-sm space-y-2">
                  <p className="font-bold text-accent-gold uppercase tracking-widest text-xs">How it works</p>
                  <p className="text-text-secondary leading-relaxed">
                    Our AI model (Gemini 1.5 Pro) analyzes the audio frequencies and linguistic patterns to identify the three speakers. 
                    It specifically looks for the rhythmic patterns of Quranic recitation, the direct tone of translation, and the conversational style of Tafseer.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-8 focus-visible:outline-none">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <h3 className="text-2xl font-serif italic text-accent-gold">Your History</h3>
              {history.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearAllHistory} className="rounded-full border-border text-text-secondary hover:text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
            
            <div className="grid gap-4 max-w-4xl mx-auto">
              {history.length === 0 ? (
                <div className="text-center py-32 bg-card rounded-3xl border border-border border-dashed">
                  <div className="bg-bg w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-border">
                    <History className="w-10 h-10 text-text-secondary opacity-40" />
                  </div>
                  <p className="text-xl font-medium text-text-secondary">No history yet.</p>
                  <p className="text-text-secondary mt-2 opacity-60">Start by uploading an audio file in the New Diarization tab.</p>
                </div>
              ) : (
                history.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card 
                      className="group hover:border-accent-gold/50 transition-all duration-300 cursor-pointer shadow-sm border border-border bg-card/80" 
                      onClick={() => {
                        setCurrentSegments(item.segments);
                        setCurrentFile({ name: item.name } as File);
                        setActiveTab("upload");
                      }}
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-bg p-3 rounded-2xl border border-border group-hover:border-accent-gold/30 transition-colors">
                            <FileAudio className="w-6 h-6 text-accent-gold" />
                          </div>
                          <div className="space-y-1">
                            <CardTitle className="text-lg font-bold text-text-primary">{item.name}</CardTitle>
                            <p className="text-sm text-text-secondary">{item.date}</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFromHistory(item.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="py-12 border-t mt-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 Al-Mufassir Audio Diarization Service. Powered by Gemini 1.5 Pro.</p>
        </div>
      </footer>
    </div>
  );
}

