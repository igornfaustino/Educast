import React, {
	useCallback,
	useRef,
	useEffect,
	useState,
	useMemo,
} from 'react';

import VideoContainerHeader from './VideoContainerHeader';
import VideoControl from './VideoControl';

import styles from './VideoContainer.module.scss';

import { useVideo } from '../hooks/useVideo';
import { useWindowSize } from '../hooks/useWindowSize';
import { useVideoHeigth } from '../hooks/useVideoHeight';

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
// const videoJSOptionsApresentacao = {
// 	controls: false,
// 	fluid: false,
// 	sources: [
// 		{
// 			src:
// 				'https://sample-videos.com/abc/video708/mp4/240/big_buck_bunny_240p_20mb.mp4',
// 			type: 'video/mp4',
// 		},
// 	],
// };

// TODO: handle fullscreen
function VideoContainer() {
	const video1Ref = useRef(null);
	const video2Ref = useRef(null);
	const wrapperRef = useRef(null);
	const fullscreenArea = useRef(null);
	const [maxWidth, setMaxWidth] = useState(0);
	const [maxHeight, setMaxHeight] = useState(0);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const windowSize = useWindowSize();
	const {
		isPlaying,
		duration,
		currentTime,
		size: sizeVideo1,
		isSeeking: isPlayer1Seeking,
		play: playPlayer1,
		pause: pausePlayer1,
		isWaiting: isPlayer1Waiting,
		setClickedTime: setClickedTimeVideo1,
		handlePlayPauseButton: handlePlayPauseButtonVideo1,
		handleVolumeChange: handleVolumeChangeVideo1,
	} = useVideo(video1Ref, videoJSOptions);
	const {
		size: sizeVideo2,
		play: playPlayer2,
		pause: pausePlayer2,
		isSeeking: isPlayer2Seeking,
		isWaiting: isPlayer2Waiting,
		setClickedTime: setClickedTimeVideo2,
		handlePlayPauseButton: handlePlayPauseButtonVideo2,
		handleVolumeChange: handleVolumeChangeVideo2,
	} = useVideo(video2Ref, videoJSOptionsApresentacao);
	const { heigth, width1, width2 } = useVideoHeigth(
		maxWidth,
		maxHeight,
		sizeVideo1,
		sizeVideo2
	);

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

	useEffect(() => {
		if (isFullscreen) return;
		const totalWidth = wrapperRef.current.offsetWidth;
		const paddingWidth = 16;
		const dividerSize = 8;

		const maxHeight = parseInt(windowSize[1] * 0.4);

		setMaxHeight(maxHeight);
		setMaxWidth(totalWidth - paddingWidth - dividerSize);
	}, [isFullscreen, windowSize]);

	const wrapperStyle = useMemo(() => {
		return { height: heigth + 16 };
	}, [heigth]);

	const video1Style = useMemo(() => {
		return { height: '100%', width: width1 || undefined };
	}, [width1]);

	const video2Style = useMemo(() => {
		return { height: '100%', width: width2 || undefined };
	}, [width2]);

	const handleFullscreen = useCallback(() => {
		if (!isFullscreen) {
			fullscreenArea.current.requestFullscreen();
			setIsFullscreen(true);
			const maxHeight = parseInt(windowSize[1]);
			const maxWidth = parseInt(windowSize[0]);
			setMaxWidth(maxWidth - 8);
			setMaxHeight(maxHeight);
		} else {
			document.exitFullscreen();
			setIsFullscreen(false);
		}
	}, [isFullscreen, windowSize]);

	return (
		<>
			<VideoContainerHeader
				title="Titulo de video teste 1"
				date="19 de abril de 2018"
			/>
			<div
				ref={fullscreenArea}
				style={{
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
				}}
			>
				<div className={styles.wrapper} ref={wrapperRef} style={wrapperStyle}>
					<div data-vjs-player style={video1Style}>
						<video ref={video1Ref} className="video-js"></video>
					</div>
					<div className={styles.space} />
					<div data-vjs-player style={video2Style}>
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
					handleFullscreen={handleFullscreen}
				/>
			</div>
		</>
	);
}

export default VideoContainer;
