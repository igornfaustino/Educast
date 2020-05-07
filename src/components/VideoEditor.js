import React, { useState, useEffect, useRef } from 'react';

import Timeline from './Timeline';
import TimelineControl from './TimelineControl';
import { useSceneChapters } from '../hooks/useSceneChapters';

import { ZOOM_MAX } from '../utils/constants';

const VideoEditor = ({
	getPresenterScreenShot,
	getPresentationScreenShot,
	duration,
}) => {
	const videoTimelineRef = useRef(null);

	const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [videoLength, setVideoLength] = useState(duration);
	const [timerDivWidth, setTimerDivWidth] = useState(
		10.5 * (zoom * 10 + zoom * 90)
	);
	const INITIAL_DIV_WIDTH = useState(10.5 * (zoom * 10 + zoom * 90))[0];
	const INITIAL_DIV_WIDTH2 = useState(
		10.5 * (videoLength / zoom + (videoLength / zoom) * 24)
	)[0];
	// console.log('timerdivwidht:' + 10.5 * (zoom * 10 + zoom * 90));

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
