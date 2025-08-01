
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Camera, AlertTriangle, Video, VideoOff, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoIntroductionProps {
  onRecordingComplete: () => void;
}

export function VideoIntroduction({ onRecordingComplete }: VideoIntroductionProps) {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Unsupported Browser",
          description: "Your browser does not support camera access.",
        });
        return;
      }
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please enable camera and microphone permissions in your browser settings.",
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [toast]);

  const handleStartRecording = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      setRecordedChunks([]);
      setVideoUrl(null);
      const stream = videoRef.current.srcObject as MediaStream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      onRecordingComplete(); // Mark task as complete
    }
  };

  useEffect(() => {
    if (recordedChunks.length > 0 && !isRecording) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    }
  }, [recordedChunks, isRecording]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Introduction</CardTitle>
        <CardDescription>
          Record a short (30-60 second) video to introduce yourself to the team.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
            {videoUrl ? (
                <video src={videoUrl} controls className="w-full h-full" />
            ) : (
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            )}
        </div>
        
        {hasCameraPermission === false && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Camera Access Required</AlertTitle>
            <AlertDescription>
              Please allow camera and microphone access to use this feature. You may need to refresh the page after changing permissions.
            </AlertDescription>
          </Alert>
        )}
        
        {videoUrl && (
            <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Recording Complete!</AlertTitle>
                <AlertDescription className="text-green-700">
                    Your video is ready. You can re-record if you'd like. The next step would be to upload it.
                </AlertDescription>
            </Alert>
        )}

        <div className="flex justify-center gap-4">
          <Button 
            onClick={handleStartRecording} 
            disabled={!hasCameraPermission || isRecording}
          >
            <Video className="mr-2 h-4 w-4" /> Start Recording
          </Button>
          <Button 
            onClick={handleStopRecording} 
            disabled={!isRecording} 
            variant="destructive"
          >
            <VideoOff className="mr-2 h-4 w-4" /> Stop Recording
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
