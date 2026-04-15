import React, { useState, useRef } from 'react';
import { Upload, FileAudio, X, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface AudioUploaderProps {
  onUpload: (file: File) => void;
  isProcessing: boolean;
  progress: number;
}

export function AudioUploader({ onUpload, isProcessing, progress }: AudioUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith('audio/')) {
        setFile(selectedFile);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('audio/')) {
        setFile(droppedFile);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-dashed border-2 border-border bg-card/30 backdrop-blur-sm">
      <CardContent className="p-8">
        {!file ? (
          <div
            className={`flex flex-col items-center justify-center space-y-4 py-12 transition-all duration-300 rounded-2xl cursor-pointer ${
              isDragging ? 'bg-accent-gold/5 border-accent-gold' : 'bg-transparent border-transparent'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="p-4 bg-accent-gold/10 rounded-full border border-accent-gold/20">
              <Upload className="w-8 h-8 text-accent-gold" />
            </div>
            <div className="text-center">
              <p className="text-lg font-serif italic text-text-primary">Click or drag audio file to upload</p>
              <p className="text-xs uppercase tracking-widest text-text-secondary mt-2">MP3, WAV, or M4A (Max 20MB)</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="audio/*"
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-bg border border-border rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-accent-gold/10 rounded-md border border-accent-gold/20">
                  <FileAudio className="w-6 h-6 text-accent-gold" />
                </div>
                <div>
                  <p className="font-medium truncate max-w-[200px] text-text-primary">{file.name}</p>
                  <p className="text-xs text-text-secondary uppercase tracking-tighter">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!isProcessing && (
                <Button variant="ghost" size="icon" onClick={clearFile} className="text-text-secondary hover:text-destructive">
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>

            {isProcessing ? (
              <div className="space-y-3">
                <div className="flex justify-between text-xs uppercase tracking-widest text-text-secondary">
                  <span>Diarizing audio...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-1 bg-border" />
              </div>
            ) : (
              <Button 
                className="gold-button w-full h-14 text-lg rounded-full" 
                onClick={() => onUpload(file)}
              >
                Start Diarization
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
