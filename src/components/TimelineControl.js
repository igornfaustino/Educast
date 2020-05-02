import React, { forwardRef, useRef } from 'react';
import { MdZoomIn, MdZoomOut } from 'react-icons/md';

import styles from './TimelineControl.module.scss';

const TimelineControl = (
	{ timerDivWidth, zoom, setZoom },
	videoTimelineRef
) => {
	const mainScrollbarRef = useRef(null);

	const handleScroll = () => {
		if (!videoTimelineRef.current) return;
		videoTimelineRef.current.scrollLeft = mainScrollbarRef.current.scrollLeft;
	};

	return (
		<div className={styles['scrollbar']}>
			<div className={styles['blackbox']}></div>

			<div className={styles['scrollbar__container']}>
				<div
					className={styles['timeline__scrollbar']}
					ref={mainScrollbarRef}
					onScroll={handleScroll}
				>
					<div
						style={{
							height: '100%',
							width: timerDivWidth + 'px',
							backgroundColor: 'transparent',
						}}
						className="timeline__video-invisible"
					/>
				</div>

				<div className={styles['scrollbar__blackbox']}></div>
			</div>

			<div className={styles['zoom__bar']}>
				<MdZoomOut className={styles['btnContainer__icon']} />
				<div className={styles['slider-box']}>
					<input
						type="range"
						min="1"
						max="10"
						value={zoom}
						onChange={(evt) => {
							setZoom(evt.target.value);
						}}
						step="1"
						className={styles['slider']}
						id="myRange"
					/>
				</div>
				<MdZoomIn className={styles['btnContainer__icon']} />
			</div>
		</div>
	);
};

export default forwardRef(TimelineControl);
