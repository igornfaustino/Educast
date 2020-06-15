import { useState, useCallback, useEffect } from 'react';
import { useCursor } from './useCursor';
import { getPositionInPercent } from '../utils/conversions';
import { useDispatch, useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';

export function useTimeline(
	timerDivWidth,
	handleTimelineClick,
	getPresenterScreenShot,
	getPresentationScreenShot
) {
	const dispatch = useDispatch();
	const scenes = useSelector((state) => state.sceneChapters.scenes);
	const currentTime = useSelector((state) => state.video.currentTime);
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

	const handleHotkeyToSelectScene = useCallback(
		(type) => {
			if (selectedScenes.length !== 1) return;
			switch (type) {
				case 'previous':
					return setSelectedScenes((prevState) => {
						const lastSelectedScene = prevState[0];
						if (lastSelectedScene === 0) return prevState;
						return [lastSelectedScene - 1];
					});
				case 'next':
					return setSelectedScenes((prevState) => {
						const lastSelectedScene = prevState[0];
						if (lastSelectedScene === scenes.length - 1) return prevState;
						return [lastSelectedScene + 1];
					});
				default:
					return;
			}
		},
		[scenes.length, selectedScenes.length, setSelectedScenes]
	);

	const handleHotkeyToSelectChapter = useCallback(
		(type) => {
			if (selectedChapters.length !== 1) return;
			const idxOfLastSelectedChapter = chapters.findIndex(
				(chapter) => chapter.id === selectedChapters[0]
			);
			switch (type) {
				case 'previous':
					return setSelectedChapters((prevState) => {
						if (idxOfLastSelectedChapter === 0) return prevState;
						return [chapters[idxOfLastSelectedChapter - 1].id];
					});
				case 'next':
					return setSelectedChapters((prevState) => {
						if (idxOfLastSelectedChapter === chapters.length - 1)
							return prevState;
						return [chapters[idxOfLastSelectedChapter + 1].id];
					});
				default:
					return;
			}
		},
		[chapters, selectedChapters, setSelectedChapters]
	);

	useHotkeys(
		'a',
		() => {
			if (!selectedChapters.length && !selectedScenes.length) return;
			if (selectedChapters.length && selectedScenes.length) return;
			if (selectedScenes.length) return handleHotkeyToSelectScene('previous');
			return handleHotkeyToSelectChapter('previous');
		},
		{},
		[
			selectedChapters,
			selectedScenes,
			handleHotkeyToSelectChapter,
			handleHotkeyToSelectScene,
		]
	);

	useHotkeys(
		'p',
		() => {
			if (!selectedChapters.length && !selectedScenes.length) return;
			if (selectedChapters.length && selectedScenes.length) return;
			if (selectedScenes.length) return handleHotkeyToSelectScene('next');
			return handleHotkeyToSelectChapter('next');
		},
		{},
		[
			selectedChapters,
			selectedScenes,
			handleHotkeyToSelectChapter,
			handleHotkeyToSelectScene,
		]
	);

	useHotkeys(
		's',
		() => {
			if (isAddVideoDisabled) return;
			createScene();
		},
		{},
		[isAddVideoDisabled, createScene]
	);

	useHotkeys(
		'c',
		() => {
			if (isChapterButtonDisabled) return;
			createChapter();
		},
		{},
		[isChapterButtonDisabled, createChapter]
	);

	useHotkeys(
		'delete, backspace',
		() => {
			deleteChapter();
			deleteScene();
		},
		{},
		[deleteChapter, deleteScene]
	);

	useHotkeys(
		'i',
		() => {
			dispatch({ type: 'SHORTCUT_I', currentPosition: cursorPosition });
		},
		{},
		[cursorPosition, dispatch]
	);

	useHotkeys(
		'o',
		() => {
			dispatch({ type: 'SHORTCUT_O', currentPosition: cursorPosition });
		},
		{},
		[cursorPosition, dispatch]
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
		setSelectedScenes,
		setSelectedChapters,
	};
}
