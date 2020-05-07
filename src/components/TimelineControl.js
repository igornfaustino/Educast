import React, { forwardRef, useRef, useCallback } from 'react';
import { MdZoomIn, MdZoomOut } from 'react-icons/md';

import { ZOOM_MAX } from '../utils/constants';

import styles from './TimelineControl.module.scss';
import { useMemo } from 'react';

const TimelineControl = (
	{ timerDivWidth, zoom, setZoom },
	videoTimelineRef
) => {
	const mainScrollbarRef = useRef(null);

	const handleScroll = useCallback(() => {
		if (!videoTimelineRef.current) return;
		videoTimelineRef.current.scrollLeft = mainScrollbarRef.current.scrollLeft;
	}, [videoTimelineRef]);

	const handleZoomChange = useCallback(
		(evt) => {
			setZoom(evt.target.value);
		},
		[setZoom]
	);

	const scrollStyle = useMemo(
		() => ({
			height: '100%',
			width: timerDivWidth + 'px',
			backgroundColor: 'transparent',
		}),
		[timerDivWidth]
	);

	const scrollBar = useMemo(
		() => (
			<div className={styles['scrollbar__container']}>
				<div
					className={styles['timeline__scrollbar']}
					ref={mainScrollbarRef}
					onScroll={handleScroll}
				>
					<div style={scrollStyle} className="timeline__video-invisible" />
				</div>

				<div className={styles['scrollbar__blackbox']}></div>
			</div>
		),
		[handleScroll, scrollStyle]
	);

	const zoomInput = useMemo(
		() => (
			<div className={styles['zoom__bar']}>
				<MdZoomOut className={styles['btnContainer__icon']} />
				<div className={styles['slider-box']}>
					<input
						type="range"
						min="1"
						max={ZOOM_MAX}
						value={zoom}
						onChange={handleZoomChange}
						step="1"
						className={styles['slider']}
						id="myRange"
					/>
				</div>
				<MdZoomIn className={styles['btnContainer__icon']} />
			</div>
		),
		[handleZoomChange, zoom]
	);

	return (
		<div className={styles['scrollbar']}>
			<div className={styles['blackbox']}></div>

			{scrollBar}

			{zoomInput}
		</div>
	);
};

export default forwardRef(TimelineControl);
