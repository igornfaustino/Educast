import React, { useMemo, useCallback, useRef, useState } from 'react';

import cx from 'classnames';
import { Popover, PopoverBody } from 'reactstrap';
import { IoMdPlay, IoMdPause } from 'react-icons/io';
import { FaVolumeUp } from 'react-icons/fa';
import { MdFullscreen } from 'react-icons/md';
import moment from 'moment';

import styles from './VideoControl.module.scss';

function VideoControl({
	duration,
	currentTime,
	setCurrentTime,
	handlePlayPauseButton,
	isPlaying,
	handleFullscreen,
	handleVolumeChange: handleVolume,
}) {
	const progressBar = useRef(null);

	const [popoverOpen, setPopoverOpen] = useState(false);
	const [volume, setVolume] = useState(1);

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

	const toggle = useCallback(() => setPopoverOpen(!popoverOpen), [popoverOpen]);

	const handleVolumeChange = useCallback(
		(e) => {
			const volume = e.target.value;
			handleVolume(volume);
			setVolume(volume);
		},
		[handleVolume]
	);

	const currentTimeFormated = useMemo(() => {
		const currentTimeInMilis = currentTime * 1000;
		return moment.utc(currentTimeInMilis).format('HH:mm:ss');
	}, [currentTime]);

	const durationFormated = useMemo(() => {
		const durationInMilis = duration * 1000;
		return moment.utc(durationInMilis).format('HH:mm:ss');
	}, [duration]);

	const playOrPauseIcon = useMemo(
		() =>
			isPlaying ? (
				<IoMdPause size="1rem" className={styles.button} />
			) : (
				<IoMdPlay size="1rem" className={styles.button} />
			),
		[isPlaying]
	);

	return (
		<div>
			<div
				className={styles.range}
				ref={progressBar}
				onClick={onProgressClickHandle}
			>
				<div className={styles.played} style={style} />
			</div>
			<div className={styles.control}>
				<div>
					{currentTimeFormated} / {durationFormated}
				</div>
				<div onClick={handlePlayPauseButton}>{playOrPauseIcon}</div>
				<div>
					<FaVolumeUp
						id="volume-popover"
						size="1rem"
						className={styles.button}
					/>
					<MdFullscreen
						className={cx(styles.fullscreenIcon, styles.button)}
						size="1rem"
						onClick={handleFullscreen}
					/>
				</div>
			</div>
			<Popover
				placement="top"
				isOpen={popoverOpen}
				target="volume-popover"
				toggle={toggle}
			>
				<PopoverBody>
					<input
						type="range"
						min={0}
						max={1}
						step={0.1}
						value={volume}
						className={styles.slider}
						onChange={handleVolumeChange}
					/>
				</PopoverBody>
			</Popover>
		</div>
	);
}

export default VideoControl;
