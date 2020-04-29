import React, { useState, useEffect } from 'react';

import Timeline from './Timeline';
import TimelineControl from './TimelineControl';
import { useSceneChapters } from '../hooks/useSceneChapters';

const VideoEditor = ({ getPresenterScreenShot, getPresentationScreenShot }) => {
	// WTF???
	const videoBoxRef = useState(React.createRef())[0];
	const mainScrollbarRef = useState(React.createRef())[0];
	const [chapterTimelineRef, setChapterTimelineRef] = useState(
		React.createRef()
	);
	const [videoTimelineRef, setVideoTimelineRef] = useState(React.createRef());
	const [timelineIndicatorRef, setTimelineIndicatorRef] = useState(
		React.createRef()
	);

	const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(2);
	const [videoLength, setVideoLength] = useState(200);
	const [timerDivWidth, setTimerDivWidth] = useState(videoLength * 10);

	const { scenes, setChapters, dispatchScene, chapters } = useSceneChapters(
		timerDivWidth
	);

	useEffect(() => {
		setVideoLength(200 * zoom);
		setTimerDivWidth(2000 * zoom);
	}, [zoom]);

	return (
		<div style={{}}>
			<Timeline
				videoBoxRef={videoBoxRef}
				timerDivWidth={timerDivWidth}
				chapterTimelineRef={chapterTimelineRef}
				cursorPosition={cursorPosition}
				setCursorPosition={setCursorPosition}
				videoTimelineRef={videoTimelineRef}
				timelineIndicatorRef={timelineIndicatorRef}
				videoLength={videoLength}
				scenes={scenes}
				dispatchScene={dispatchScene}
				chapters={chapters}
				setChapters={setChapters}
				getPresenterScreenShot={getPresenterScreenShot}
				getPresentationScreenShot={getPresentationScreenShot}
			/>
			<TimelineControl
				mainScrollbarRef={mainScrollbarRef}
				setVideoTimelineRef={setVideoTimelineRef}
				timerDivWidth={timerDivWidth}
				videoTimelineRef={videoTimelineRef}
				zoom={zoom}
				setZoom={setZoom}
			/>
		</div>
	);
};

export default VideoEditor;
