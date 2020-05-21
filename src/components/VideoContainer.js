import React, {
	useCallback,
	useRef,
	useEffect,
	useState,
	useMemo,
	forwardRef,
	useImperativeHandle,
} from 'react';
import { MdSwapHoriz } from 'react-icons/md';
import { FaEyeSlash } from 'react-icons/fa';
import cx from 'classnames';

import VideoContainerHeader from './VideoContainerHeader';
import VideoControl from './VideoControl';
import { useDispatch } from 'react-redux';

import styles from './VideoContainer.module.scss';

import { useVideo } from '../hooks/useVideo';
import { useWindowSize } from '../hooks/useWindowSize';
import { useVideoHeight } from '../hooks/useVideoHeight';
import IndicatorIcon from './IndicatorIcon';
import { tryToEnterFullscreen } from '../utils/fullscreen';
import { getSnapshot } from '../utils/snapshot';

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

function VideoContainer(props, ref) {
	const video1Ref = useRef(null);
	const video2Ref = useRef(null);
	const wrapperRef = useRef(null);
	const fullscreenArea = useRef(null);

	const dispatch = useDispatch();

	const [maxWidth, setMaxWidth] = useState(0);
	const [maxHeight, setMaxHeight] = useState(0);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [isVideoInverted, setIsVideoInverted] = useState(false);
	const [isVideo1Visible, setIsVideo1Visible] = useState(true);
	const [isVideo2Visible, setIsVideo2Visible] = useState(true);

	const windowSize = useWindowSize();
	const {
		isPlaying,
		duration,
		currentTime,
		isReady,
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
	const { height, width1, width2 } = useVideoHeight(
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

	const handleFullscreen = useCallback(() => {
		const elem = fullscreenArea.current;
		if (!isFullscreen) {
			const isFullscreen = tryToEnterFullscreen(elem);
			if (!isFullscreen) return;

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

	const handleSwap = useCallback(() => setIsVideoInverted(!isVideoInverted), [
		isVideoInverted,
	]);

	const handleHideVideo1 = useCallback(
		() => setIsVideo1Visible(!isVideo1Visible),
		[isVideo1Visible]
	);

	const handleHideVideo2 = useCallback(
		() => setIsVideo2Visible(!isVideo2Visible),
		[isVideo2Visible]
	);

	const wrapperStyle = useMemo(() => {
		return { height: height + 16 };
	}, [height]);

	const video1Style = useMemo(() => {
		return { position: 'relative', height: '100%', width: width1 || undefined };
	}, [width1]);

	const video2Style = useMemo(() => {
		return { position: 'relative', height: '100%', width: width2 || undefined };
	}, [width2]);

	const wrapperClassName = useMemo(
		() =>
			isVideoInverted
				? cx(styles.wrapper, styles['inverse-video'])
				: styles.wrapper,
		[isVideoInverted]
	);

	const video1VisibleIconType = useMemo(
		() => (isVideo1Visible ? 'visible' : 'invisible'),
		[isVideo1Visible]
	);

	const video2VisibleIconType = useMemo(
		() => (isVideo2Visible ? 'visible' : 'invisible'),
		[isVideo2Visible]
	);

	const presenterIconClassName = useMemo(
		() => (isVideoInverted ? styles.iconRight : styles.iconLeft),
		[isVideoInverted]
	);

	const presentationIconClassName = useMemo(
		() => (isVideoInverted ? styles.iconLeft : styles.iconRight),
		[isVideoInverted]
	);

	const video1HideLayer = useMemo(
		() =>
			!isVideo1Visible && (
				<div className={styles.hideLayer}>
					<FaEyeSlash size="3rem" />
				</div>
			),
		[isVideo1Visible]
	);

	const video2HideLayer = useMemo(
		() =>
			!isVideo2Visible && (
				<div className={styles.hideLayer}>
					<FaEyeSlash size="3rem" />
				</div>
			),
		[isVideo2Visible]
	);

	useImperativeHandle(ref, () => ({
		getPresenterScreenShot() {
			return getSnapshot(video1Ref.current);
		},
		getPresentationScreenShot() {
			return getSnapshot(video2Ref.current);
		},
		handleTimelineClick,
	}));

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

		const maxHeight = parseInt(windowSize[1] * 0.35);

		setMaxHeight(maxHeight);
		setMaxWidth(totalWidth - paddingWidth - dividerSize);
	}, [isFullscreen, windowSize]);

	useEffect(() => {
		dispatch({ type: 'SET_DURATION', duration });
	}, [dispatch, duration]);

	useEffect(() => {
		dispatch({ type: 'SET_CURRENT_TIME', currentTime });
	}, [dispatch, currentTime]);

	useEffect(() => {
		dispatch({ type: 'SET_IS_READY', isReady });
	}, [dispatch, isReady]);

	return (
		<>
			<VideoContainerHeader
				title="Titulo de video teste 1"
				date="19 de abril de 2018"
			/>
			<div ref={fullscreenArea} className={styles.fullscreenArea}>
				<div className={wrapperClassName} ref={wrapperRef} style={wrapperStyle}>
					<div data-vjs-player style={video1Style}>
						{video1HideLayer}
						<video ref={video1Ref} className="video-js"></video>
						<div className={presenterIconClassName}>
							<IndicatorIcon
								type={video1VisibleIconType}
								onClick={handleHideVideo1}
							/>
							<IndicatorIcon type="presenter" />
						</div>
					</div>
					<div className={styles.space}>
						<MdSwapHoriz
							className={styles.swap}
							onClick={handleSwap}
							size="2rem"
						/>
					</div>
					<div data-vjs-player style={video2Style}>
						{video2HideLayer}
						<video ref={video2Ref} className="video-js"></video>
						<div className={presentationIconClassName}>
							<IndicatorIcon
								type={video2VisibleIconType}
								onClick={handleHideVideo2}
							/>
							<IndicatorIcon type="presentation" />
						</div>
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

export default forwardRef(VideoContainer);
