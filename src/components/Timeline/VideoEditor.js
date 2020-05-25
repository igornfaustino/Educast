import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import Timeline from './Timeline';
import TimelineControl from './TimelineControl';
import { getNumberOfMainIndicators } from '../../utils/conversions';
import {
	ZOOM_MAX,
	INITIAL_TOTAL_NUMBER_OF_INDICATORS,
	BASE_TIME_INDICATOR_MARGIN,
	BASE_DIV_WIDTH,
} from '../../utils/constants';

const VideoEditor = ({
	getPresenterScreenShot,
	getPresentationScreenShot,
	handleTimelineClick,
}) => {
	const videoTimelineRef = useRef(null);

	const duration = useSelector((state) => state.video.duration);
	const visibleArea = useSelector((state) => state.timeline.visibleArea);
	const currentTime = useSelector((state) => state.video.currentTime);

	const [videoLength, setVideoLength] = useState(duration);
	const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [totalOfTimeIndicators, setTotalOfTimeIndicators] = useState(
		INITIAL_TOTAL_NUMBER_OF_INDICATORS
	);
	const [timerDivWidth, setTimerDivWidth] = useState(
		(visibleArea * BASE_TIME_INDICATOR_MARGIN) / BASE_DIV_WIDTH
	);
	const [calculatedMargin, setCalculatedMargin] = useState(
		BASE_TIME_INDICATOR_MARGIN
	);

	useHotkeys(
		'left',
		() => {
			const frameSize = 1 / 25;
			const currentFrame = Math.round(currentTime / frameSize);
			const previousFramePosition = (currentFrame - 1) * frameSize;
			handleTimelineClick(previousFramePosition);
		},
		{},
		[currentTime]
	);

	useHotkeys(
		'right',
		() => {
			const frameSize = 1 / 25;
			const currentFrame = Math.round(currentTime / frameSize);
			const nextFramePosition = (currentFrame + 1) * frameSize;
			console.log({ currentFrame, nextFramePosition });
			handleTimelineClick(nextFramePosition);
		},
		{},
		[currentTime]
	);

	useHotkeys(
		'shift+right',
		() => {
			handleTimelineClick(parseInt(currentTime) + 1);
		},
		{},
		[currentTime]
	);

	useHotkeys(
		'shift+left',
		() => {
			handleTimelineClick(parseInt(currentTime) - 1);
		},
		{},
		[currentTime]
	);

	const getRealTimeIndicatorMargin = useCallback(() => {
		if (visibleArea > 900)
			return (visibleArea * BASE_TIME_INDICATOR_MARGIN) / BASE_DIV_WIDTH;
		return BASE_TIME_INDICATOR_MARGIN;
	}, [visibleArea]);

	useEffect(() => {
		const realTimeIndicatorMargin = getRealTimeIndicatorMargin();
		setCalculatedMargin(realTimeIndicatorMargin);
		setTimerDivWidth(realTimeIndicatorMargin * totalOfTimeIndicators);
	}, [getRealTimeIndicatorMargin, totalOfTimeIndicators]);

	useEffect(() => {
		const numberOfMainIndicators = getNumberOfMainIndicators(zoom, duration);
		const numberOfSubIndicatorsBetweenEachMain =
			Number(zoom) === ZOOM_MAX ? 24 : 9;
		const numberOfSubIndicators =
			numberOfMainIndicators * numberOfSubIndicatorsBetweenEachMain;
		const totalOfIndicators = numberOfMainIndicators + numberOfSubIndicators;
		setTotalOfTimeIndicators(totalOfIndicators);
	}, [duration, zoom]);

	useEffect(() => {
		setVideoLength(duration * zoom);
		setTimerDivWidth(calculatedMargin * totalOfTimeIndicators);
	}, [zoom, duration, calculatedMargin, totalOfTimeIndicators]);

	return (
		<div style={{}}>
			<Timeline
				zoomLevel={zoom}
				timerDivWidth={timerDivWidth}
				cursorPosition={cursorPosition}
				setCursorPosition={setCursorPosition}
				ref={videoTimelineRef}
				videoLength={videoLength}
				getPresenterScreenShot={getPresenterScreenShot}
				getPresentationScreenShot={getPresentationScreenShot}
				calculatedMargin={calculatedMargin}
				handleTimelineClick={handleTimelineClick}
			/>
			<TimelineControl
				timerDivWidth={timerDivWidth}
				ref={videoTimelineRef}
				zoom={zoom}
				setZoom={setZoom}
			/>
		</div>
	);
};

export default VideoEditor;
