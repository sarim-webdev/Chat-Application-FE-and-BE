import { useEffect, useRef, useState } from "react";

function AudioVisualizer({ stream }) {
  const [bars, setBars] = useState(
    new Array(20).fill(5)
  );

  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!stream) return;

    const audioContext = new AudioContext();

    const analyser =
      audioContext.createAnalyser();

    analyser.fftSize = 256;

    const source =
      audioContext.createMediaStreamSource(
        stream
      );

    source.connect(analyser);

    analyserRef.current = analyser;

    const dataArray = new Uint8Array(
      analyser.frequencyBinCount
    );

    const updateBars = () => {
      analyser.getByteFrequencyData(
        dataArray
      );

      const visualBars = [];

      for (let i = 0; i < 20; i++) {
        const value =
          dataArray[i] || 0;

        visualBars.push(
          Math.max(6, value / 4)
        );
      }

      setBars(visualBars);

      animationRef.current =
        requestAnimationFrame(updateBars);
    };

    updateBars();

    return () => {
      cancelAnimationFrame(
        animationRef.current
      );

      source.disconnect();

      analyser.disconnect();

      audioContext.close();
    };
  }, [stream]);

  return (
    <div className="flex items-end justify-center gap-[3px] h-16">
      {bars.map((height, index) => (
        <div
          key={index}
          style={{
            height: `${height}px`,
          }}
          className="w-[4px] rounded-full bg-green-500 transition-all duration-75"
        />
      ))}
    </div>
  );
}

export default AudioVisualizer;