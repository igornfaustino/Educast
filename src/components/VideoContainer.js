import React, { useState, useCallback, useEffect, useRef } from 'react';

import videojs from 'video.js';

import VideoContainerHeader from './VideoContainerHeader';
import VideoControl from './VideoControl';

import styles from './VideoContainer.module.scss';

// TODO: discover where to put this
const videoJSOptions = {
  controls: false,
  fluid: false,
  sources: [
    {
      src:
        'https://cdn.videvo.net/videvo_files/video/premium/video0061/large_watermarked/4k0154_preview.mp4',
      type: 'video/mp4'
    }
  ]
};

// TODO: handle 2 video
// TODO: handle fullscreen
function VideoContainer() {
  const [duration, setDuration] = useState(2000);
  const [currentTime, setCurrentTime] = useState(0);
  const [clickedTime, setClickedTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false); // TODO: use this to sync both videos

  const videoRef = useRef(null);

  const handlePlayPauseButton = useCallback(() => {
    const player = videojs(videoRef.current);

    if (!isPlaying) player.play();
    else player.pause();

    return setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleVolumeChange = useCallback(volume => {
    const player = videojs(videoRef.current);
    player.volume(volume);
  }, []);

  // TODO: Separate thin into a hook?
  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const player = videojs(videoRef.current);
    player.currentTime(clickedTime);
  }, [clickedTime]);

  useEffect(() => {
    const player = videojs(videoRef.current);

    return () => {
      player.dispose();
    };
  }, []);

  return (
    <>
      <VideoContainerHeader
        title="Titulo de video teste 1"
        date="19 de abril de 2018"
      />
      <div className={styles.wrapper}>
        <div
          data-vjs-player
          style={{ height: '100%', width: '100%' }} // i dunno why.. but with a class this doesn't work...
        >
          <video ref={videoRef} className="video-js"></video>
        </div>
      </div>
      <VideoControl
        duration={duration}
        currentTime={currentTime}
        setCurrentTime={setClickedTime}
        isPlaying={isPlaying}
        handlePlayPauseButton={handlePlayPauseButton}
        handleVolumeChange={handleVolumeChange}
      />
    </>
  );
}

export default VideoContainer;
