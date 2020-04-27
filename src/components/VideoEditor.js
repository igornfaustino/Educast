import React, { useState, useReducer, useEffect } from 'react';
import Timeline from './Timeline';
import TimelineControl from './TimelineControl';
import { act } from 'react-dom/test-utils';

import { getPositionInPercent } from '../utils/convertions';

const VideoEditor = ({ getPresenterScreenShot, getPresentationScreenShot }) => {
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

	const [chapters, setChapters] = useState([]);

	const [zoom, setZoom] = useState(2);

	const [videoLength, setVideoLength] = useState(200);
	const [timerDivWidth, setTimerDivWidth] = useState(videoLength * 10);

	// handle scenes changes
	const sceneReducer = (state, action) => {
		let updatedState = [...state];

		// delete scene
		if (action.type === 'delete') {
			// delete chapters that are inside a deleted scene
			const deletedScenes = state.filter((val, idx) => {
				return action.deleteIdx.includes(idx);
			});

			deletedScenes.forEach((scene) => {
				// chapters that are in a scene
				const chaptersToMaintain = chapters.filter((chap) => {
					return !(
						scene.start.x <= chap.position && scene.end.x >= chap.position
					);
				});
				setChapters(chaptersToMaintain);
			});

			// update the scenes correctly
			const updatedState = state.filter((val, idx) => {
				return !action.deleteIdx.includes(idx);
			});
			return [...updatedState];
		}

		// create stick
		if (action.sceneIdx === -1) {
			return [...state, action.scene];
		}

		// if the moved stick exceeded his brother's position in the wrong side
		if (
			action.scene.start.x >= action.scene.end.x ||
			action.scene.end.x <= action.scene.start.x
		) {
			return [...state];
		}
		if (
			state.some((stick, idx) => {
				if (action.sceneIdx !== idx) {
					return (
						(stick.start.x <= action.scene.end.x && // if the moved stick is between another scene
							stick.end.x >= action.scene.end.x) ||
						(stick.end.x >= action.scene.start.x &&
							stick.start.x <= action.scene.start.x) ||
						(action.scene.end.x >= stick.end.x && // if the moved stick exceeded another scene
							action.scene.start.x <= stick.start.x) ||
						(action.scene.start.x <= stick.start.x &&
							action.scene.end.x >= stick.end.x)
					);
				}
				return false;
			})
		) {
			// return the previous state
			return [...state];
		}

		// check if there was a chapter between the moved scene
		const valueInPercent = getPositionInPercent(10, timerDivWidth);
		if (
			chapters.some((chap) => {
				return (
					(action.scene.start.x - valueInPercent <= chap.position &&
						action.scene.end.x >= chap.position) ||
					(action.scene.start.x <= chap.position &&
						action.scene.end.x + valueInPercent >= chap.position)
				);
			})
		) {
			const chap = chapters.filter((chapter) => {
				return (
					(action.scene.start.x - valueInPercent <= chapter.position &&
						action.scene.end.x >= chapter.position) ||
					(action.scene.start.x <= chapter.position &&
						action.scene.end.x + valueInPercent >= chapter.position)
				);
			});
			if (action.isStart) {
				if (action.scene.start.x > chap[0].position) {
					// drag the chapter too

					setChapters((prevState) => {
						let tmpChapters = [...prevState];
						tmpChapters[chapters.indexOf(chap[0])].position =
							action.scene.start.x;
						return [...tmpChapters];
					});
				}
			} else {
				if (action.scene.end.x < chap[chap.length - 1].position) {
					// delete the chapter
					setChapters((prevState) => {
						let updatedChapters = [...prevState];
						updatedChapters.splice(
							updatedChapters.indexOf(chap[chap.length - 1]),
							1
						);
						return [...updatedChapters];
					});
				}
			}
		}

		// just update
		updatedState[action.sceneIdx] = action.scene; // {start: {x,y }, end: {x,y}}
		// updatedState[action.sceneIdx].img = getPresenterScreenShot();
		return [...updatedState];
	};

	const [scenes, dispatchScene] = useReducer(sceneReducer, []);

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
