'use client';

import { useState, useRef } from 'react';
import { Mic, Square, Loader } from 'lucide-react';

type AudioRecorderProps = {
  onAnalysisComplete: (analysisData: any) => void;
};

const AudioRecorder = ({ onAnalysisComplete }: AudioRecorderProps) => {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setLoading(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        try {
          // Send to /api/transcribe (Deepgram)
          const res = await fetch('/api/transcribe', {
            method: 'POST',
            body: audioBlob,
          });

          const data = await res.json();

          if (data.transcript) {
            setTranscript(data.transcript);

            // Now send to Gemini API with the transcript
            const geminiRes = await fetch('/api/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ transcript: data.transcript }),
            });

            const geminiData = await geminiRes.json();

            if (geminiData.result) {
              // Parse the JSON string from Gemini response
              try {
                const parsedResult = JSON.parse(geminiData.result);
                // Pass the structured data back to the parent component
                onAnalysisComplete(parsedResult);
              } catch (parseError) {
                console.error('Failed to parse Gemini response:', parseError);
              }
            }
          }
        } catch (err) {
          console.error(err);
          setTranscript('❌ Error occurred during transcription');
        } finally {
          setLoading(false);
        }
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Failed to access microphone. Please ensure microphone permissions are granted.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      setRecording(false);
    }
  };

  return (
    <div className="mb-4 flex items-center gap-4">
      {!recording ? (
        <button
          onClick={startRecording}
          className="flex items-center gap-2 rounded-full bg-[#18B7CD] p-2 text-white hover:bg-[#149AAD]"
          disabled={loading}
          title="Start recording"
        >
          <Mic className="h-5 w-5" />
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="flex items-center gap-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
          title="Stop recording"
        >
          <Square className="h-5 w-5" />
        </button>
      )}
      
      {loading && (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader className="h-4 w-4 animate-spin" />
          <span>Processing...</span>
        </div>
      )}
      
      {transcript && !loading && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">Transcribed:</span> {transcript.length > 50 ? `${transcript.substring(0, 50)}...` : transcript}
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;