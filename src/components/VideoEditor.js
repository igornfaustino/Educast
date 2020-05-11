import React, { useState, useEffect, useRef } from 'react';

import { useSelector } from 'react-redux';

import Timeline from './Timeline';
import TimelineControl from './TimelineControl';
import { useSceneChapters } from '../hooks/useSceneChapters';
import { useWindowSize } from '../hooks/useWindowSize';

import { ZOOM_MAX } from '../utils/constants';

const BASE_DIV_WIDTH = 1064.32;
const BASE_TIME_INDICATOR_MARGIN = 10.5;
const INTIAL_NUMBER_OF_MAIN_TIME_INDICATOR = 10;
const INTIAL_NUMBER_OF_SUB_TIME_INDICATOR = 90;

const VideoEditor = ({
	getPresenterScreenShot,
	getPresentationScreenShot,
	handleTimelineClick,
}) => {
	const duration = useSelector((state) => state.video.duration);

	const videoTimelineRef = useRef(null);

	const [videoLength, setVideoLength] = useState(duration);
	const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [timerDivWidth, setTimerDivWidth] = useState(
		10.5 * (zoom * 10 + zoom * 90)
	);

	const [calculatedMargin, setCalculatedMargin] = useState(10.5);

	const INITIAL_DIV_WIDTH = useState(10.5 * (zoom * 10 + zoom * 90))[0];
	const qtdPauzinhos = duration + duration * 24;
	console.log('QTD PAUZINHOS=', qtdPauzinhos);
	const INITIAL_DIV_WIDTH2 = useState(10.5 * qtdPauzinhos)[0];

	useWindowSize();

	useEffect(() => {
		if (!videoTimelineRef.current) return;
		const wrapperWidth = videoTimelineRef.current.offsetWidth;
		const realTimeIndicatorMargin =
			(wrapperWidth * BASE_TIME_INDICATOR_MARGIN) / BASE_DIV_WIDTH;

		if (ZOOM_MAX === Number(zoom)) {
			setCalculatedMargin(10.5);
			return setTimerDivWidth(10.5 * qtdPauzinhos);
		}
		setCalculatedMargin(realTimeIndicatorMargin);

		const numberOfTimeIndicators =
			zoom * INTIAL_NUMBER_OF_MAIN_TIME_INDICATOR +
			zoom * INTIAL_NUMBER_OF_SUB_TIME_INDICATOR;

		setTimerDivWidth(realTimeIndicatorMargin * numberOfTimeIndicators);
	});

	const { scenes, setChapters, dispatchScene, chapters } = useSceneChapters(
		timerDivWidth
	);

	useEffect(() => {
		setVideoLength(duration * zoom);
		if (Number(zoom) === ZOOM_MAX) {
			setTimerDivWidth(INITIAL_DIV_WIDTH2);
		} else {
			setTimerDivWidth(zoom * INITIAL_DIV_WIDTH);
		}
	}, [zoom, INITIAL_DIV_WIDTH, duration, INITIAL_DIV_WIDTH2]);

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
