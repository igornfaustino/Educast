import React, { useCallback, useRef, useEffect } from 'react';

import VideoContainerHeader from './VideoContainerHeader';
import VideoControl from './VideoControl';

import styles from './VideoContainer.module.scss';
import { useVideo } from '../hooks/useVideo';

const videoJSOptions = {
	controls: false,
	fluid: false,
	sources: [
		{
			src:
				'https://livestream01.fccn.pt/EducastVod2/_definst_/mp4:clips/0228xx/Clip_022864/ProducedClips/mpeg4_standard_V1_presenter_46.mp4/playlist.m3u8',
			type: 'application/x-mpegURL',
		},
	],
};

const videoJSOptionsApresentacao = {
	controls: false,
	fluid: false,
	sources: [
		{
			src:
				'https://livestream01.fccn.pt/EducastVod2/_definst_/mp4:clips/0228xx/Clip_022864/ProducedClips/mpeg4_standard_V1_screens_46.mp4/playlist.m3u8',
			type: 'application/x-mpegURL',
		},
	],
};

// TODO: handle fullscreen
function VideoContainer() {
	const video1Ref = useRef(null);
	const video2Ref = useRef(null);
	const {
		isPlaying,
		duration,
		currentTime,
		isSeeking: isPlayer1Seeking,
		play: playPlayer1,
		pause: pausePlayer1,
		isWaiting: isPlayer1Waiting,
		setClickedTime: setClickedTimeVideo1,
		handlePlayPauseButton: handlePlayPauseButtonVideo1,
		handleVolumeChange: handleVolumeChangeVideo1,
	} = useVideo(video1Ref, videoJSOptions);
	const {
		play: playPlayer2,
		pause: pausePlayer2,
		isSeeking: isPlayer2Seeking,
		isWaiting: isPlayer2Waiting,
		setClickedTime: setClickedTimeVideo2,
		handlePlayPauseButton: handlePlayPauseButtonVideo2,
		handleVolumeChange: handleVolumeChangeVideo2,
	} = useVideo(video2Ref, videoJSOptionsApresentacao);

	const handleTimelineClick = useCallback(
		(time) => {
			setClickedTimeVideo1(time);
			setClickedTimeVideo2(time);
		},
		[setClickedTimeVideo1, setClickedTimeVideo2]
	);

	const handlePlayPauseButton = useCallback(() => {
		handlePlayPauseButtonVideo1();
		handlePlayPauseButtonVideo2();
	}, [handlePlayPauseButtonVideo1, handlePlayPauseButtonVideo2]);

	const handleVolumeChange = useCallback(
		(volume) => {
			handleVolumeChangeVideo1(volume);
			handleVolumeChangeVideo2(volume);
		},
		[handleVolumeChangeVideo1, handleVolumeChangeVideo2]
	);

	const handleSeeking = useCallback(() => {
		if (isPlaying) {
			if (isPlayer1Seeking && !isPlayer2Seeking) {
				pausePlayer2();
			} else if (!isPlayer1Seeking && isPlayer2Seeking) {
				pausePlayer1();
			}
		}
	}, [
		isPlayer1Seeking,
		isPlayer2Seeking,
		isPlaying,
		pausePlayer1,
		pausePlayer2,
	]);

	const handleWaiting = useCallback(() => {
		if (isPlayer1Waiting && !isPlayer2Waiting) {
			pausePlayer2();
		} else if (!isPlayer1Waiting && isPlayer2Waiting) {
			pausePlayer1();
		}
	}, [isPlayer1Waiting, isPlayer2Waiting, pausePlayer1, pausePlayer2]);

	useEffect(() => {
		if (isPlayer1Seeking || isPlayer2Seeking) {
			handleSeeking();
		} else if (isPlayer1Waiting || isPlayer2Waiting) {
			handleWaiting();
		} else if (isPlaying) {
			playPlayer1();
			playPlayer2();
		}
	}, [
		handleSeeking,
		handleWaiting,
		isPlayer1Seeking,
		isPlayer1Waiting,
		isPlayer2Seeking,
		isPlayer2Waiting,
		isPlaying,
		pausePlayer1,
		pausePlayer2,
		playPlayer1,
		playPlayer2,
	]);

	return (
		<>
			<VideoContainerHeader
				title="Titulo de video teste 1"
				date="19 de abril de 2018"
			/>
			<div className={styles.wrapper}>
				<div
					data-vjs-player
					style={{ height: '100%' }} // i dunno why.. but with a class this doesn't work...
				>
					<video ref={video1Ref} className="video-js"></video>
				</div>
				<div className={styles.space} />
				<div
					data-vjs-player
					style={{ height: '100%' }} // i dunno why.. but with a class this doesn't work...
				>
					<video ref={video2Ref} className="video-js"></video>
				</div>
			</div>
			<VideoControl
				duration={duration}
				currentTime={currentTime}
				setCurrentTime={handleTimelineClick}
				isPlaying={isPlaying}
				handlePlayPauseButton={handlePlayPauseButton}
				handleVolumeChange={handleVolumeChange}
			/>
		</>
	);
}

export default VideoContainer;
