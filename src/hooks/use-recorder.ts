import { useState, useEffect, useCallback } from 'react';

export interface RecorderState {
  mediaRecorder: MediaRecorder | null;
  recordingStatus: 'inactive' | 'recording' | 'paused';
  recordingTime: number;
  audioUrl: string | null;
  chunks: Blob[];
  error: string | null;
  hasPermission: boolean;
}

export const useRecorder = () => {
  const [state, setState] = useState<RecorderState>({
    mediaRecorder: null,
    recordingStatus: 'inactive',
    recordingTime: 0,
    audioUrl: null,
    chunks: [],
    error: null,
    hasPermission: false,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state.recordingStatus === 'recording') {
      interval = setInterval(() => {
        setState((prev) => ({
          ...prev,
          recordingTime: prev.recordingTime + 1,
        }));
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.recordingStatus]);

  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const audioUrl = URL.createObjectURL(blob);
        setState((prev) => ({
          ...prev,
          audioUrl,
          chunks,
          recordingStatus: 'inactive',
        }));
      };

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
          // Create a temporary Blob for preview
          const blob = new Blob(chunks, { type: mimeType });
          const audioUrl = URL.createObjectURL(blob);
          setState((prev) => ({
            ...prev,
            audioUrl,
            chunks,
          }));
        }
      };

      setState((prev) => ({
        ...prev,
        mediaRecorder,
        hasPermission: true,
        chunks,
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: 'Microphone access denied. Please enable it in your browser settings.',
        hasPermission: false,
      }));
    }
  }, []);

  const startRecording = useCallback(() => {
    if (state.mediaRecorder) {
      state.mediaRecorder.start(500); // Record in 500ms chunks for preview
      setState((prev) => ({
        ...prev,
        recordingStatus: 'recording',
        recordingTime: 0,
        audioUrl: null,
        chunks: [],
      }));
    }
  }, [state.mediaRecorder]);

  const stopRecording = useCallback(() => {
    if (state.mediaRecorder && state.recordingStatus === 'recording') {
      state.mediaRecorder.stop();
      // Stop all tracks in the media stream
      state.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setState((prev) => ({
        ...prev,
        recordingStatus: 'inactive',
      }));
    }
  }, [state.mediaRecorder, state.recordingStatus]);

  const resetRecording = useCallback(() => {
    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl);
    }
    if (state.mediaRecorder) {
      state.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    setState((prev) => ({
      ...prev,
      recordingTime: 0,
      audioUrl: null,
      chunks: [],
      mediaRecorder: null,
      recordingStatus: 'inactive',
    }));
  }, [state.audioUrl, state.mediaRecorder]);

  return {
    ...state,
    requestPermission,
    startRecording,
    stopRecording,
    resetRecording,
  };
};
