import React, { useState, useEffect, forwardRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

interface VideoPlayerProps {
  videoSrc: string | null;
  onTimeUpdate: (currentTime: number) => void;
  seekTo: number | null;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ videoSrc, onTimeUpdate, seekTo }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    useEffect(() => {
      if (seekTo !== null && ref && "current" in ref && ref.current) {
        ref.current.currentTime = seekTo;
      }
    }, [seekTo, ref]);

    const togglePlayPause = () => {
      if (ref && "current" in ref && ref.current) {
        if (isPlaying) {
          ref.current.pause();
        } else {
          ref.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    const handleTimeUpdate = () => {
      if (ref && "current" in ref && ref.current) {
        const time = ref.current.currentTime;
        setCurrentTime(time);
        onTimeUpdate(time);
      }
    };

    const handleLoadedMetadata = () => {
      if (ref && "current" in ref && ref.current) {
        setDuration(ref.current.duration);
      }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = parseFloat(e.target.value);
      if (ref && "current" in ref && ref.current) {
        ref.current.currentTime = time;
        setCurrentTime(time);
      }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const vol = parseFloat(e.target.value);
      setVolume(vol);
      if (ref && "current" in ref && ref.current) {
        ref.current.volume = vol;
      }
    };

    const skipTime = (seconds: number) => {
      if (ref && "current" in ref && ref.current) {
        ref.current.currentTime = Math.max(
          0,
          Math.min(duration, currentTime + seconds)
        );
      }
    };

    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="relative aspect-video bg-black">
          {videoSrc ? (
            <video
              ref={ref}
              src={videoSrc}
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Upload a video to begin analysis</p>
            </div>
          )}
        </div>

        {videoSrc && (
          <div className="p-4 bg-gray-800">
            <div className="flex items-center space-x-4 mb-3">
              <button
                onClick={() => skipTime(-10)}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <SkipBack size={20} />
              </button>

              <button
                onClick={togglePlayPause}
                className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>

              <button
                onClick={() => skipTime(10)}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <SkipForward size={20} />
              </button>

              <div className="flex items-center space-x-2">
                <Volume2 size={16} />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-blue-600"
                />
              </div>

              <div className="text-sm text-gray-300">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="0"
                max={duration}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 accent-blue-600"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

VideoPlayer.displayName = "VideoPlayer";
