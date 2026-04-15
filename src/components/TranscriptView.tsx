import React from 'react';
import { DiarizationSegment } from '@/lib/gemini';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion } from 'motion/react';
import { Download, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface TranscriptViewProps {
  segments: DiarizationSegment[];
  fileName?: string;
}

const speakerColors = {
  Arabic: "border-accent-arabic text-accent-arabic bg-accent-arabic/10",
  Translation: "border-accent-trans text-accent-trans bg-accent-trans/10",
  Tafseer: "border-accent-tafseer text-accent-tafseer bg-accent-tafseer/10",
};

const speakerDots = {
  Arabic: "bg-accent-arabic",
  Translation: "bg-accent-trans",
  Tafseer: "bg-accent-tafseer",
};

export function TranscriptView({ segments, fileName }: TranscriptViewProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (segments.length === 0) return null;

  const handleDownload = () => {
    const content = segments.map(s => `[${s.startTime} - ${s.endTime}] ${s.speaker}: ${s.text}`).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName || 'transcript'}_diarized.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 overflow-hidden shadow-2xl border border-border bg-card">
      <CardHeader className="border-b border-border bg-card/50 backdrop-blur-sm">
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-8 bg-accent-gold rounded-full" />
            <span className="font-serif italic text-accent-gold">Diarized Transcript</span>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Button variant="outline" size="sm" onClick={() => {
              const content = segments.map(s => `[${s.startTime}] ${s.speaker}: ${s.text}`).join('\n');
              navigator.clipboard.writeText(content);
              alert("Full transcript copied to clipboard!");
            }} className="border-border text-text-secondary hover:text-accent-gold hover:border-accent-gold/50 rounded-full">
              <Copy className="w-4 h-4 mr-2" />
              Copy All
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} className="border-border text-text-secondary hover:text-accent-gold hover:border-accent-gold/50 rounded-full">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px] p-6">
          <div className="space-y-8">
            {segments.map((segment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="group relative flex gap-6 p-4 rounded-xl hover:bg-white/5 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-24 text-xs font-mono text-text-secondary opacity-40 pt-1 border-r border-border/30 pr-4">
                  {segment.startTime}
                  <div className="text-[10px] opacity-50 mt-1">to {segment.endTime}</div>
                </div>
                <div className="flex-grow space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${speakerDots[segment.speaker as keyof typeof speakerDots]}`} />
                      <span className={`text-[10px] uppercase font-bold tracking-widest ${segment.speaker === 'Arabic' ? 'text-accent-arabic' : segment.speaker === 'Translation' ? 'text-accent-trans' : 'text-accent-tafseer'}`}>
                        {segment.speaker}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-text-secondary hover:text-accent-gold"
                      onClick={() => copyToClipboard(segment.text, index)}
                    >
                      {copiedIndex === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className={`leading-relaxed ${
                    segment.speaker === 'Arabic' 
                      ? 'font-serif text-3xl text-right leading-[1.8] text-white' 
                      : 'text-text-primary text-lg font-light'
                  }`}>
                    {segment.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
