import { useState, useCallback, useEffect } from 'react';
import { useCursor } from './useCursor';
import { getPositionInPercent } from '../utils/conversions';
import { useDispatch, useSelector } from 'react-redux';

export function useTimeline(
	timerDivWidth,
	handleTimelineClick,
	getPresenterScreenShot,
	getPresentationScreenShot
) {
	const dispatch = useDispatch();
	const scenes = useSelector((state) => state.sceneChapters.scenes);
	const chapters = useSelector((state) => state.sceneChapters.chapters);

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

	const getSceneBarEndPosition = useCallback(() => {
		const possibleScenes = scenes.filter((scene) => {
			return scene.start.x > cursorPosition.x;
		});

		if (possibleScenes.length > 0) {
			return possibleScenes.sort((a, b) => a.start.x - b.start.x)[0].start.x;
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
		dispatch({ type: 'DELETE', scenesIdx: selectedScenes });
	}, [chapters, dispatch, scenes, selectedScenes]);

	const deleteChapter = useCallback(() => {
		const updatedChapters = chapters.filter((val) => {
			return !selectedChapters.includes(val.id);
		});

		dispatch({ type: 'SET_CHAPTERS', chapters: updatedChapters });
		setSelectedChapters([]);
	}, [chapters, dispatch, selectedChapters]);

	const createScene = useCallback(() => {
		if (isCursorInScene()) return;

		const endPosition = getSceneBarEndPosition();

		const scene = {
			start: { x: cursorPosition.x, y: 0 },
			end: { x: endPosition, y: 0 },
			img: getPresenterScreenShot(),
		};

		dispatch({ type: 'CREATE', scene });
		setIsAddVideoDisabled(() => true);
	}, [
		cursorPosition.x,
		dispatch,
		getPresenterScreenShot,
		getSceneBarEndPosition,
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

		const updatedChapters = [...chapters];

		updatedChapters.push({
			position: cursorPosition.x,
			id: Date.now(),
			img: getPresentationScreenShot(),
		});
		updatedChapters.sort((a, b) => a.position - b.position);

		dispatch({ type: 'SET_CHAPTERS', chapters: updatedChapters });
	}, [
		chapters,
		cursorPosition.x,
		dispatch,
		getPresentationScreenShot,
		isCursorInScene,
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
		isAddVideoDisabled,
		isChapterButtonDisabled,
	};
}
