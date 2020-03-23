import { useState, useEffect, useCallback } from 'react';
import videojs from 'video.js';

export function useVideo(videoRef, videoJSOptions) {
  const [duration, setDuration] = useState(2000);
  const [currentTime, setCurrentTime] = useState(0);
  const [clickedTime, setClickedTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false); // TODO: use this to sync both videos

  const handlePlayPauseButton = useCallback(() => {
    if (videoRef.current) {
      const player = videojs(videoRef.current);

      if (!isPlaying) player.play();
      else player.pause();

      return setIsPlaying(!isPlaying);
    }
  }, [isPlaying, videoRef]);

  const handleVolumeChange = useCallback(
    volume => {
      if (videoRef.current) {
        const player = videojs(videoRef.current);
        player.volume(volume);
      }
    },
    [videoRef]
  );

  useEffect(() => {
    if (videoRef.current) {
      const player = videojs(videoRef.current, videoJSOptions);

      player.one('loadedmetadata', () => {
        setDuration(player.duration());
      });

      player.one('loadeddata', () => {
        setIsReady(true);
        player.setInterval(() => {
          setCurrentTime(player.currentTime());
        }, 100);
      });
    }
  }, [videoJSOptions, videoRef]);

  useEffect(() => {
    if (videoRef.current) {
      const player = videojs(videoRef.current);
      player.currentTime(clickedTime);
    }
  }, [clickedTime, videoRef]);

  useEffect(() => {
    if (videoRef.current) {
      const player = videojs(videoRef.current);

      return () => {
        player.dispose();
      };
    }
  }, [videoRef]);

  return {
    duration,
    currentTime,
    setClickedTime,
    isPlaying,
    setIsPlaying,
    isReady,
    handlePlayPauseButton,
    handleVolumeChange
  };
}
