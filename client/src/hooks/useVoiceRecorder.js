import { useEffect, useRef, useState } from "react";

const useVoiceRecorder = () => {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);

  const [audioBlob, setAudioBlob] = useState(null);

  const [audioFile, setAudioFile] = useState(null);

  const [audioURL, setAudioURL] = useState("");

  const [duration, setDuration] = useState(0);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: "audio/webm",
        });

        const file = new File([blob], `voice-${Date.now()}.webm`, {
          type: "audio/webm",
        });

        const url = URL.createObjectURL(blob);

        setAudioBlob(blob);

        setAudioFile(file);

        setAudioURL(url);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();

      setIsRecording(true);

      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.log(error);

      alert("Microphone permission denied.");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();

    setIsRecording(false);

    clearInterval(timerRef.current);
  };

  const resetRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }

    setAudioBlob(null);

    setAudioFile(null);

    setAudioURL("");

    setDuration(0);
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);

      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  return {
    isRecording,

    audioBlob,

    audioFile,

    audioURL,

    duration,

    startRecording,

    stopRecording,

    resetRecording,
  };
};

export default useVoiceRecorder;
