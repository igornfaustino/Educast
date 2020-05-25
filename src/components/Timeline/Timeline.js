import React, { useEffect, useMemo, forwardRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import TimeIndicator from './TimeIndicator';
import { FINAL_SPACE } from '../../utils/constants';
import { useWindowSize } from '../../hooks/useWindowSize';

import cx from 'classnames';
import styles from './Timeline.module.scss';
import Scene from './Scene';
import Chapter from './Chapter';
import { useTimeline } from '../../hooks/useTimeline';
import Guide from './Guide';
import Cursor from './Cursor';
import { getIdxOfScenesWithoutImg } from '../../utils/scenes';

const Timeline = (
	{
		zoomLevel,
		timerDivWidth,
		getPresenterScreenShot,
		getPresentationScreenShot,
		videoLength,
		calculatedMargin,
		handleTimelineClick,
	},
	videoTimelineRef
) => {
	const dispatch = useDispatch();
	const isVideoReady = useSelector((state) => state.video.isReady);

	const windowsSize = useWindowSize();

	const {
		scenes,
		deleteScene,
		deleteChapter,
		cursorPosition,
		handleDrag,
		handleDragCursorEnd,
		chapters,
		selectedChapters,
		handleChapterSelectedSelect,
		selectedScenes,
		handleSceneSelect,
		isAddVideoDisabled,
		createScene,
		isChapterButtonDisabled,
		createChapter,
	} = useTimeline(
		timerDivWidth,
		handleTimelineClick,
		getPresenterScreenShot,
		getPresentationScreenShot
	);

	const renderChapter = useMemo(
		() =>
			React.Children.toArray(
				chapters.map((chapter, idx) => {
					const lastScene = scenes[scenes.length - 1];
					const lastSceneEndPosition = lastScene ? lastScene.end.x : 0;

					const chapterEndPosition = chapters[idx + 1]
						? chapters[idx + 1].position
						: lastSceneEndPosition;

					return (
						<Chapter
							chapterEndPosition={chapterEndPosition}
							chapter={chapter}
							idx={idx}
							timerDivWidth={timerDivWidth}
							isSelected={selectedChapters.includes(chapter.id)}
							chapters={chapters}
							handleChapterSelectedSelect={handleChapterSelectedSelect}
						/>
					);
				})
			),
		[
			chapters,
			handleChapterSelectedSelect,
			scenes,
			selectedChapters,
			timerDivWidth,
		]
	);

	const renderScene = useMemo(
		() =>
			React.Children.toArray(
				scenes.map((scene, idx) => (
					<Scene
						scene={scene}
						idx={idx}
						timerDivWidth={timerDivWidth}
						isSelected={selectedScenes.includes(idx)}
						handleSceneSelect={handleSceneSelect}
					/>
				))
			),
		[scenes, timerDivWidth, selectedScenes, handleSceneSelect]
	);

	const cursorPositionPx = useMemo(() => cursorPosition.x * timerDivWidth, [
		cursorPosition.x,
		timerDivWidth,
	]);

	const timelineStyle = useMemo(
		() => ({
			width: timerDivWidth + FINAL_SPACE,
			height: '100%',
		}),
		[timerDivWidth]
	);

	const timelineWrapperStyle = useMemo(
		() => ({
			width: timerDivWidth,
		}),
		[timerDivWidth]
	);

	useEffect(() => {
		const wrapperWidth = videoTimelineRef.current.offsetWidth;
		dispatch({ type: 'SET_VISIBLE_AREA', visibleArea: wrapperWidth });
	}, [dispatch, videoTimelineRef, windowsSize]);

	useEffect(() => {
		if (!isVideoReady) return;

		const idxsOfScenesWithoutImg = getIdxOfScenesWithoutImg(scenes);
		if (idxsOfScenesWithoutImg.length === 0) return;

		const img = getPresenterScreenShot();
		idxsOfScenesWithoutImg.forEach((idx) => {
			dispatch({ type: 'UPDATE_SCENE_IMG', sceneIdx: idx, img });
		});
	}, [dispatch, getPresenterScreenShot, isVideoReady, scenes]);

	return (
		<div className={styles['timeline__wrapper']}>
			<div className={styles['buttonsWrapper']}>
				<div className={styles['blackbox']} />

				<Guide
					type="video"
					onAdd={createScene}
					onDelete={deleteScene}
					isAddDisable={isAddVideoDisabled}
					isDeleteDisable={!selectedScenes.length}
				/>
				<Guide
					type="capitulos"
					onAdd={createChapter}
					onDelete={deleteChapter}
					isAddDisable={isChapterButtonDisabled}
					isDeleteDisable={!selectedChapters.length}
				/>
			</div>

			<div className={styles['timeline']} ref={videoTimelineRef}>
				<div style={timelineStyle}>
					<TimeIndicator
						videoLength={videoLength}
						zoomLevel={zoomLevel}
						calculatedMargin={calculatedMargin}
					/>
					<div
						className={cx(
							styles['timeline__video'],
							styles['timeline__content']
						)}
					>
						<div
							className="timeline__video-invisible"
							style={timelineWrapperStyle}
						>
							{renderScene}
						</div>
					</div>

					<div className={cx(styles['timeline__content'])}>{renderChapter}</div>
				</div>

				<Cursor
					cursorPosition={cursorPositionPx}
					handleDrag={handleDrag}
					handleDragEnd={handleDragCursorEnd}
					bound=".timeline__video-invisible"
				/>
			</div>
		</div>
	);
};

export default forwardRef(Timeline);
