import React, {
	forwardRef,
	useRef,
	useCallback,
	useMemo,
	useEffect,
	useState,
} from 'react';
import { MdZoomIn, MdZoomOut } from 'react-icons/md';

import { ZOOM_MAX, FINAL_SPACE } from '../../utils/constants';

import styles from './TimelineControl.module.scss';
import { useDispatch, useSelector } from 'react-redux';

const TimelineControl = (
	{ timerDivWidth, zoom, setZoom },
	videoTimelineRef
) => {
	const mainScrollbarRef = useRef(null);

	const dispatch = useDispatch();

	const visibleArea = useSelector((state) => state.timeline.visibleArea);
	const isPlaying = useSelector((state) => state.video.isPlaying);
	const currentTime = useSelector((state) => state.video.currentTime);
	const duration = useSelector((state) => state.video.duration);

	const [lastTimerDivWidth, setLastTimerDivWidth] = useState(timerDivWidth);

	const scrollWidth = useMemo(() => {
		if (!mainScrollbarRef.current) return 0;
		const scrollBarWrapperSize = mainScrollbarRef.current.offsetWidth;
		return (scrollBarWrapperSize * (timerDivWidth + FINAL_SPACE)) / visibleArea;
	}, [timerDivWidth, visibleArea]);

	const handleScroll = useCallback(() => {
		if (!videoTimelineRef.current || !mainScrollbarRef.current) return;
		const scrollBarScrollLeft = mainScrollbarRef.current.scrollLeft;
		const videoScroll =
			(scrollBarScrollLeft * (timerDivWidth + FINAL_SPACE)) / scrollWidth;
		videoTimelineRef.current.scrollLeft = videoScroll;
		dispatch({
			type: 'SET_SCROLL_LEFT',
			scrollLeft: videoScroll,
		});
	}, [dispatch, scrollWidth, timerDivWidth, videoTimelineRef]);

	const updateScrollPosition = useCallback(() => {
		const percentPlayed = currentTime / duration;
		const scrollOffset = visibleArea * 0.2;
		const newScroll = scrollWidth * percentPlayed - scrollOffset;
		mainScrollbarRef.current.scrollLeft = newScroll;
		handleScroll();
	}, [currentTime, duration, handleScroll, scrollWidth, visibleArea]);

	const handleZoomChange = useCallback(
		(evt) => {
			setZoom(evt.target.value);
		},
		[setZoom]
	);

	const scrollStyle = useMemo(
		() => ({
			height: '100%',
			width: scrollWidth + 'px',
			backgroundColor: 'transparent',
		}),
		[scrollWidth]
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

	useEffect(() => {
		if (isPlaying) return updateScrollPosition();
		if (timerDivWidth === lastTimerDivWidth) return;
		setLastTimerDivWidth(timerDivWidth);
		updateScrollPosition();
	}, [isPlaying, lastTimerDivWidth, timerDivWidth, updateScrollPosition]);

	return (
		<div className={styles['scrollbar']}>
			<div className={styles['blackbox']}></div>

			{scrollBar}

			{zoomInput}
		</div>
	);
};

export default forwardRef(TimelineControl);
