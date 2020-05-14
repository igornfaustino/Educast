import React, { useState, useEffect, useRef } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import Timeline from './Timeline';
import TimelineControl from './TimelineControl';
import { useSceneChapters } from '../hooks/useSceneChapters';
import { useWindowSize } from '../hooks/useWindowSize';

import { getNumberOfMainIndicators } from '../utils/conversions';

import { ZOOM_MAX } from '../utils/constants';

const BASE_DIV_WIDTH = 1064.32;
const BASE_TIME_INDICATOR_MARGIN = 10.5;
const INTIAL_NUMBER_OF_MAIN_TIME_INDICATOR = 10;
const INTIAL_NUMBER_OF_SUB_TIME_INDICATOR = 90;
const INITIAL_TOTAL_NUMBER_OF_INDICATORS =
	INTIAL_NUMBER_OF_MAIN_TIME_INDICATOR * INTIAL_NUMBER_OF_SUB_TIME_INDICATOR;

const VideoEditor = ({
	getPresenterScreenShot,
	getPresentationScreenShot,
	handleTimelineClick,
}) => {
	const duration = useSelector((state) => state.video.duration);
	const dispatch = useDispatch();

	const videoTimelineRef = useRef(null);

	const [videoLength, setVideoLength] = useState(duration);
	const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [totalOfTimeIndicators, setTotalOfTimeIndicators] = useState(
		INITIAL_TOTAL_NUMBER_OF_INDICATORS
	);
	const [timerDivWidth, setTimerDivWidth] = useState(
		BASE_TIME_INDICATOR_MARGIN * totalOfTimeIndicators
	);

	const [calculatedMargin, setCalculatedMargin] = useState(
		BASE_TIME_INDICATOR_MARGIN
	);

	useWindowSize();

	useEffect(() => {
		if (!videoTimelineRef.current) return;

		const wrapperWidth = videoTimelineRef.current.offsetWidth;
		const realTimeIndicatorMargin =
			(wrapperWidth * BASE_TIME_INDICATOR_MARGIN) / BASE_DIV_WIDTH;

		dispatch({ type: 'SET_VISIBLE_AREA', visibleArea: wrapperWidth });
		setCalculatedMargin(realTimeIndicatorMargin);

		setTimerDivWidth(realTimeIndicatorMargin * totalOfTimeIndicators);
	});

	useEffect(() => {
		const numberOfMainIndicators = getNumberOfMainIndicators(zoom, duration);
		const numberOfSubIndicatorsBetweenEachMain =
			Number(zoom) === ZOOM_MAX ? 24 : 9;
		const numberOfSubIndicators =
			numberOfMainIndicators * numberOfSubIndicatorsBetweenEachMain;
		const totalOfIndicators = numberOfMainIndicators + numberOfSubIndicators;
		setTotalOfTimeIndicators(totalOfIndicators);
	}, [duration, zoom]);

	const { scenes, setChapters, dispatchScene, chapters } = useSceneChapters(
		timerDivWidth
	);

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
				scenes={scenes}
				dispatchScene={dispatchScene}
				chapters={chapters}
				setChapters={setChapters}
				getPresenterScreenShot={getPresenterScreenShot}
				getPresentationScreenShot={getPresentationScreenShot}
				calculatedMargin={calculatedMargin}
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
