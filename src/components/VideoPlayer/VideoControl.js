import React, { useMemo, useCallback, useRef, useState } from 'react';

import cx from 'classnames';
import { IoMdPlay, IoMdPause } from 'react-icons/io';
import { MdFullscreen } from 'react-icons/md';
import moment from 'moment';
import VolumeButton from './VolumeButton';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSelector } from 'react-redux';

import styles from './VideoControl.module.scss';

function VideoControl({
	duration,
	currentTime,
	setCurrentTime,
	handlePlayPauseButton,
	isPlaying,
	handleFullscreen: externalHandleFullscreen,
	handleVolumeChange: handleVolume,
}) {
	useHotkeys('space', handlePlayPauseButton, {}, [handlePlayPauseButton]);

	const progressBar = useRef(null);

	const chapters = useSelector((state) => state.sceneChapters.chapters);

	const [volume, setVolume] = useState(1);
	const [previousVolume, setPreviousVolume] = useState(1);

	const onProgressClickHandle = useCallback(
		(e) => {
			const rect = progressBar.current.getBoundingClientRect();
			const relativeX = e.clientX - rect.left;
			const percentagePlayed =
				(relativeX * 100) / progressBar.current.offsetWidth;
			const currentTime = (percentagePlayed * duration) / 100;
			setCurrentTime(currentTime);
		},
		[duration, setCurrentTime]
	);

	const getWidth = useCallback(() => {
		return (currentTime * 100) / duration;
	}, [duration, currentTime]);

	const style = useMemo(
		() => ({
			width: `${getWidth()}%`,
		}),
		[getWidth]
	);

	const handleVolumeClick = useCallback(() => {
		if (volume > 0) {
			setPreviousVolume(volume);
			setVolume(0);
			handleVolume(0);
		} else {
			setVolume(previousVolume);
			handleVolume(previousVolume);
		}
	}, [handleVolume, previousVolume, volume]);

	const handleFullscreen = useCallback(() => {
		externalHandleFullscreen();
	}, [externalHandleFullscreen]);

	const handleVolumeChange = useCallback(
		(e) => {
			const volume = e.target.value;
			handleVolume(volume);
			setVolume(volume);
		},
		[handleVolume]
	);

	const chapterIndicators = useMemo(
		() =>
			chapters.map((chapter) => {
				const classNames = chapter.isSelected
					? cx(styles.chapterIndicator, styles.chapterSelected)
					: styles.chapterIndicator;
				return (
					<div
						className={classNames}
						style={{ left: chapter.position * 100 + '%' }}
					/>
				);
			}),
		[chapters]
	);

	const currentTimeFormatted = useMemo(() => {
		const currentTimeInMs = currentTime * 1000;
		return moment.utc(currentTimeInMs).format('HH:mm:ss:SSS');
	}, [currentTime]);

	const durationFormatted = useMemo(() => {
		const durationInMs = duration * 1000;
		return moment.utc(durationInMs).format('HH:mm:ss:SSS');
	}, [duration]);

	const playOrPauseIcon = useMemo(
		() =>
			isPlaying ? (
				<IoMdPause size="1.5rem" className={styles.button} />
			) : (
				<IoMdPlay size="1.5rem" className={styles.button} />
			),
		[isPlaying]
	);

	return (
		<div id="video-control">
			<div
				className={styles.range}
				ref={progressBar}
				onClick={onProgressClickHandle}
			>
				{chapterIndicators}
				<div className={styles.played} style={style} />
			</div>
			<div className={styles.control}>
				<div>
					{currentTimeFormatted} / {durationFormatted}
				</div>
				<div onClick={handlePlayPauseButton}>{playOrPauseIcon}</div>
				<div>
					<span className={styles.volumeWrapper}>
						<div className={styles.volumeArea}>
							<input
								type="range"
								min={0}
								max={1}
								step={0.1}
								value={volume}
								className={styles.slider}
								onChange={handleVolumeChange}
								orient="vertical"
							/>
						</div>
						<VolumeButton
							volume={volume}
							size="1.25rem"
							className={styles.button}
							onClick={handleVolumeClick}
						/>
					</span>
					<MdFullscreen
						className={cx(styles.fullscreenIcon, styles.button)}
						size="1.25rem"
						onClick={handleFullscreen}
					/>
				</div>
			</div>
		</div>
	);
}

export default VideoControl;
