import React, { useRef, useState, useEffect } from 'react';

type Props = {
  src: string;
  containerRef:React.RefObject<HTMLDivElement | null>;
  isSticky?: boolean;
};

const AudioPlayer: React.FC<Props> = ({ src, containerRef, isSticky }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    setCurrentTime(time);
  };

  const formatTime = (time: number) =>
    new Date(time * 1000).toISOString().substring(14, 19);

  return (
    <div
      className={
        `player w-full max-w-xl p-4 rounded-2xl shadow-xl bg-black flex items-center gap-4 transition-all duration-300` +
        (isSticky ? ' fixed bottom-4 right-4 z-50 mini-player' : '')
      }
      ref={containerRef}
    >
      <button
        onClick={togglePlay}
        className="play-btn p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
      >
        {isPlaying ? '⏸️' : '▶️'}
      </button>

      <input
        type="range"
        min={0}
        max={duration}
        step="0.1"
        value={currentTime}
        onChange={handleSeek}
        className="flex-grow accent-blue-600"
      />

      <span className="text-sm text-gray-600">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>

      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
};

export default AudioPlayer;
