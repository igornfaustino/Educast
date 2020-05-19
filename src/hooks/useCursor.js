import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getPositionInPercent } from '../utils/conversions';

export function useCursor(scenes, timerDivWidth, handleTimelineClick) {
	const currentTime = useSelector((state) => state.video.currentTime);
	const duration = useSelector((state) => state.video.duration);

	const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
	const [lastSceneWithCursor, setLastSceneWithCursor] = useState(undefined);
	const [lastGapWithCursor, setLastGapWithCursor] = useState(undefined);

	const getPlayingScene = useCallback(
		(cursorPosition) =>
			scenes.find((scene) => {
				return cursorPosition >= scene.start.x && cursorPosition <= scene.end.x;
			}),
		[scenes]
	);

	const getPlayingDrag = useCallback(
		(cursorPosition) => {
			let gap = undefined;
			scenes.some((scene, idx) => {
				const isFirstScene = idx === 0;
				const isLastScene = idx === scenes.length - 1;

				const cursorAfterLastScene =
					cursorPosition > scenes[scenes.length - 1].end.x;

				const cursorBeforeFirstScene = cursorPosition < scenes[0].start.x;

				const cursorBetweenScenes =
					!isLastScene &&
					cursorPosition > scene.end.x &&
					cursorPosition < scenes[idx + 1].start.x;

				if (isFirstScene && cursorBeforeFirstScene) {
					gap = { start: {}, end: {} };
					gap.start.x = 0;
					gap.end.x = scenes[0].start.x;
					return true;
				}
				if (isLastScene && cursorAfterLastScene) {
					gap = { start: {}, end: {} };
					gap.start.x = scene.end.x;
					gap.end.x = 1;
					return true;
				}
				if (cursorBetweenScenes) {
					gap = { start: {}, end: {} };
					gap.start.x = scene.end.x;
					gap.end.x = scenes[idx + 1].start.x;
					return true;
				}
				return false;
			});
			return gap;
		},
		[scenes]
	);

	const isCursorInsideThis = useCallback((value, cursorPosition) => {
		if (!value) return false;
		if (value.start.x <= cursorPosition && cursorPosition <= value.end.x)
			return true;
		return false;
	}, []);

	const verifyCursorAndSetSceneOrGapInfo = useCallback(
		(cursorPosition) => {
			const playingScene = getPlayingScene(cursorPosition);
			if (playingScene) {
				setLastSceneWithCursor(playingScene);
				setLastGapWithCursor(undefined);
				return true;
			}
			const playingGap = getPlayingDrag(cursorPosition);
			if (playingGap) {
				setLastGapWithCursor(playingGap);
				setLastSceneWithCursor(undefined);
				return false;
			}
		},
		[getPlayingDrag, getPlayingScene]
	);

	const isCursorInsideSomeScene = useCallback(
		(cursorPosition) => {
			if (
				lastSceneWithCursor &&
				isCursorInsideThis(lastSceneWithCursor, cursorPosition)
			)
				return true;
			if (
				lastGapWithCursor &&
				isCursorInsideThis(lastGapWithCursor, cursorPosition)
			) {
				return false;
			}
			return verifyCursorAndSetSceneOrGapInfo(cursorPosition);
		},
		[
			isCursorInsideThis,
			lastGapWithCursor,
			lastSceneWithCursor,
			verifyCursorAndSetSceneOrGapInfo,
		]
	);

	const handleDragCursorEnd = useCallback(
		(e) => {
			const { x: cursorPositionInPercent } = cursorPosition;
			const cursorPositionInTime = duration * cursorPositionInPercent;
			handleTimelineClick(cursorPositionInTime);
		},
		[cursorPosition, duration, handleTimelineClick]
	);

	const handleDrag = useCallback(
		(e, ui) => {
			const { x: lastPosition } = cursorPosition;
			const deltaXInPercent = getPositionInPercent(ui.deltaX, timerDivWidth);
			setCursorPosition({
				x: lastPosition + deltaXInPercent,
			});
		},
		[cursorPosition, timerDivWidth]
	);

	const isCursorInScene = useCallback(() => {
		if (!scenes.length) return false;
		if (scenes.length === 1)
			return isCursorInsideThis(scenes[0], cursorPosition.x);
		return isCursorInsideSomeScene(cursorPosition.x);
	}, [cursorPosition.x, isCursorInsideSomeScene, isCursorInsideThis, scenes]);

	useEffect(() => {
		const timeInPercent = getPositionInPercent(currentTime, duration);
		setCursorPosition({ x: timeInPercent });
	}, [currentTime, duration]);

	useEffect(() => {
		setLastGapWithCursor(undefined);
		setLastSceneWithCursor(undefined);
	}, [scenes]);

	return {
		cursorPosition,
		isCursorInScene,
		handleDrag,
		handleDragCursorEnd,
	};
}
