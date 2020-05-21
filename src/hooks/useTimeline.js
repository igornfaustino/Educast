import { useState, useCallback, useEffect } from 'react';
import { useSceneChapters } from './useSceneChapters';
import { useCursor } from './useCursor';
import { getPositionInPercent } from '../utils/conversions';

export function useTimeline(
	timerDivWidth,
	handleTimelineClick,
	getPresenterScreenShot,
	getPresentationScreenShot
) {
	const { scenes, setChapters, dispatchScene, chapters } = useSceneChapters(
		timerDivWidth
	);
	const {
		cursorPosition,
		isCursorInScene,
		handleDrag,
		handleDragCursorEnd,
	} = useCursor(scenes, timerDivWidth, handleTimelineClick);

	const [selectedScenes, setSelectedScenes] = useState([]);
	const [selectedChapters, setSelectedChapters] = useState([]);
	const [isAddVideoDisabled, setIsAddVideoDisabled] = useState(false);
	const [isChapterButtonDisabled, setIsChapterButtonDisabled] = useState(false);

	const getSticksEndPosition = useCallback(() => {
		const possibleScenes = scenes.filter((scene) => {
			return scene.start.x > cursorPosition.x;
		});

		if (possibleScenes.length > 0) {
			return (
				possibleScenes.sort((a, b) => a.start.x - b.start.x)[0].start.x -
				getPositionInPercent(10, timerDivWidth)
			);
		} else {
			return getPositionInPercent(timerDivWidth, timerDivWidth);
		}
	}, [cursorPosition.x, scenes, timerDivWidth]);

	const deleteScene = useCallback(() => {
		setSelectedScenes([]);

		const deletedScenes = scenes.filter((val, idx) => {
			return selectedScenes.includes(idx);
		});
		deletedScenes.forEach((scene) => {
			const chaptersToDelete = chapters.filter((chap) => {
				return scene.start.x <= chap.position && scene.end.x >= chap.position;
			});
			if (chaptersToDelete.length > 0) {
				chaptersToDelete.forEach((element) => {
					setSelectedChapters((prevState) => {
						let tmpSelectedChapters = [...prevState];
						tmpSelectedChapters.splice(
							tmpSelectedChapters.indexOf(element.id),
							1
						);
						return [...tmpSelectedChapters];
					});
				});
			}
		});
		dispatchScene({ type: 'delete', scenesIdx: selectedScenes });
	}, [chapters, dispatchScene, scenes, selectedScenes]);

	const deleteChapter = useCallback(() => {
		setChapters((prevState) => {
			const tmp = prevState.filter((val) => {
				return !selectedChapters.includes(val.id);
			});

			return [...tmp];
		});
		setSelectedChapters([]);
	}, [selectedChapters, setChapters]);

	const createScene = useCallback(() => {
		if (isCursorInScene()) return;

		const endPosition = getSticksEndPosition();

		const scene = {
			start: { x: cursorPosition.x, y: 0 },
			end: { x: endPosition, y: 0 },
			img: getPresenterScreenShot(),
		};

		dispatchScene({ type: 'create', scene });
		setIsAddVideoDisabled(() => true);
	}, [
		cursorPosition.x,
		dispatchScene,
		getPresenterScreenShot,
		getSticksEndPosition,
		isCursorInScene,
	]);

	const handleSceneSelect = useCallback((idx) => {
		setSelectedScenes((prevState) => {
			const tmpSelectedScenes = [...prevState];
			if (tmpSelectedScenes.indexOf(idx) !== -1) {
				tmpSelectedScenes.splice(tmpSelectedScenes.indexOf(idx), 1);
			} else {
				tmpSelectedScenes.push(idx);
			}
			return [...tmpSelectedScenes];
		});
	}, []);

	const handleChapterSelectedSelect = useCallback((id) => {
		setSelectedChapters((prevState) => {
			const tmpSelectedChapters = [...prevState];
			if (tmpSelectedChapters.indexOf(id) !== -1) {
				tmpSelectedChapters.splice(tmpSelectedChapters.indexOf(id), 1);
			} else {
				tmpSelectedChapters.push(id);
			}
			return [...tmpSelectedChapters];
		});
	}, []);

	const createChapter = useCallback(() => {
		if (!isCursorInScene()) return;

		setChapters((prevState) => {
			let tmpMarkInChapter = [...prevState];

			tmpMarkInChapter.push({
				position: cursorPosition.x,
				id: Date.now(),
				img: getPresentationScreenShot(),
			});
			tmpMarkInChapter.sort((a, b) => a.position - b.position);

			return [...tmpMarkInChapter];
		});
	}, [
		cursorPosition.x,
		getPresentationScreenShot,
		isCursorInScene,
		setChapters,
	]);

	useEffect(() => {
		setSelectedChapters((selectedChapters) => {
			const updatedSelectedChapters = selectedChapters.filter((selected) => {
				return chapters.some((chapter) => chapter.id === selected);
			});
			return updatedSelectedChapters;
		});
	}, [chapters]);

	useEffect(() => {
		if (isCursorInScene()) {
			setIsAddVideoDisabled(true);
			setIsChapterButtonDisabled(false);
		} else {
			setIsAddVideoDisabled(false);
			setIsChapterButtonDisabled(true);
		}
	}, [cursorPosition, isCursorInScene, scenes]);

	return {
		deleteScene,
		scenes,
		deleteChapter,
		cursorPosition,
		isCursorInScene,
		handleDrag,
		handleDragCursorEnd,
		createScene,
		handleSceneSelect,
		handleChapterSelectedSelect,
		createChapter,
		chapters,
		selectedChapters,
		selectedScenes,
		dispatchScene,
		isAddVideoDisabled,
		isChapterButtonDisabled,
	};
}
