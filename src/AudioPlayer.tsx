import React, { useRef, useState, useEffect } from 'react';
import { useScrollPosition } from './hooks/useScrollPosition';
import { useIsInView } from './hooks/useIsInView';

type Props = {
  src: string;
};

const AudioPlayer: React.FC<Props> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const scrollPosition = useScrollPosition();
  const isInView = useIsInView<HTMLAudioElement>(audioRef);

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
    <div className="player w-full max-w-xl p-4 rounded-2xl shadow-xl bg-black flex items-center gap-4">
      <button
        onClick={togglePlay}
        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
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
