import React, {
	useCallback,
	useRef,
	useEffect,
	useState,
	useMemo,
} from 'react';
import { MdSwapHoriz } from 'react-icons/md';
import { FaEyeSlash } from 'react-icons/fa';
import cx from 'classnames';

import VideoContainerHeader from './VideoContainerHeader';
import VideoControl from './VideoControl';

import styles from './VideoContainer.module.scss';

import { useWindowSize } from '../hooks/useWindowSize';
import { useVideoHeight } from '../hooks/useVideoHeight';
import IndicatorIcon from './IndicatorIcon';
import { tryToEnterFullscreen } from '../utils/fullscreen';

function VideoContainer({
	video1Handle,
	video2Handle,
	presenterVideo,
	presentationVideo,
	handleTimelineClick,
	isVideoInverted,
	setIsVideoInverted,
	isVideo1Visible,
	isVideo2Visible,
	setIsVideo1Visible,
	setIsVideo2Visible,
}) {
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
		handlePlayPauseButton: handlePlayPauseButtonVideo1,
		handleVolumeChange: handleVolumeChangeVideo1,
	} = video1Handle;
	const {
		size: sizeVideo2,
		play: playPlayer2,
		pause: pausePlayer2,
		isSeeking: isPlayer2Seeking,
		isWaiting: isPlayer2Waiting,
		handlePlayPauseButton: handlePlayPauseButtonVideo2,
		handleVolumeChange: handleVolumeChangeVideo2,
	} = video2Handle;
	const { height, width1, width2 } = useVideoHeight(
		maxWidth,
		maxHeight,
		sizeVideo1,
		sizeVideo2
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
		setIsVideoInverted,
	]);

	const handleHideVideo1 = useCallback(
		() => setIsVideo1Visible(!isVideo1Visible),
		[isVideo1Visible, setIsVideo1Visible]
	);

	const handleHideVideo2 = useCallback(
		() => setIsVideo2Visible(!isVideo2Visible),
		[isVideo2Visible, setIsVideo2Visible]
	);

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
						{presenterVideo}
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
						{presentationVideo}
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

export default VideoContainer;
