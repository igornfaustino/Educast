import { useState, useReducer, useCallback } from 'react';
import { getPositionInPercent } from '../utils/conversions';

export function useSceneChapters(timerDivWidth) {
	const [chapters, setChapters] = useState([]);
	const [chaptersInsideDraggedScene, setChaptersInsideDraggedScene] = useState(
		[]
	);

	const isChapterInsideScene = useCallback(
		(chapter, scene) =>
			scene.start.x <= chapter.position && scene.end.x >= chapter.position,
		[]
	);

	const removeChaptersInsideScene = useCallback(
		(scene) => {
			scene.forEach((scene) => {
				setChapters((chapters) => {
					return chapters.filter(
						(chapter) => !isChapterInsideScene(chapter, scene)
					);
				});
			});
		},
		[isChapterInsideScene]
	);

	const deleteScenesAndInsideChapters = useCallback(
		(state, action) => {
			const deletedScenes = state.filter((val, idx) => {
				return action.scenesIdx.includes(idx);
			});

			removeChaptersInsideScene(deletedScenes);

			const updatedState = state.filter((val, idx) => {
				return !action.scenesIdx.includes(idx);
			});
			return [...updatedState];
		},
		[removeChaptersInsideScene]
	);

	const isSceneInvadingOther = useCallback((sceneIdx, scene, scenes, type) => {
		let validScene = scene;
		scenes.some((otherScene, idx) => {
			if (sceneIdx === idx) return false;

			const isSceneInvadingRight =
				type === 'drag_right' &&
				otherScene.start.x < scene.end.x &&
				scene.end.x < otherScene.end.x;

			const isSceneRightInsideScene =
				type === 'drag_right' &&
				scene.start.x < otherScene.start.x &&
				scene.end.x > otherScene.end.x;

			if (isSceneInvadingRight || isSceneRightInsideScene) {
				validScene.end.x = otherScene.start.x;
				return true;
			}

			const isSceneInvadingLeft =
				type === 'drag_left' &&
				scene.start.x < otherScene.end.x &&
				otherScene.start.x < scene.start.x;

			const isSceneLeftInsideScene =
				type === 'drag_left' &&
				scene.end.x > otherScene.end.x &&
				scene.start.x < otherScene.start.x;

			if (isSceneInvadingLeft || isSceneLeftInsideScene) {
				validScene.start.x = otherScene.end.x;
				return true;
			}

			return false;
		});
		return validScene;
	}, []);

	const isSceneValid = useCallback((scene) => {
		const isSceneLimitsAreCrossing =
			scene.start.x >= scene.end.x || scene.end.x <= scene.start.x;
		if (isSceneLimitsAreCrossing) {
			return false;
		}
		return true;
	}, []);

	const getIdOfChaptersInsideDraggedScene = useCallback(
		(scene) => [
			...chapters
				.filter((chapter) => {
					const valueInPercent = getPositionInPercent(7.6, timerDivWidth);
					return (
						(scene.start.x - valueInPercent <= chapter.position &&
							scene.end.x >= chapter.position) ||
						(scene.start.x <= chapter.position &&
							scene.end.x + valueInPercent >= chapter.position)
					);
				})
				.map((chapter) => chapter.id),
		],
		[chapters, timerDivWidth]
	);

	const getChaptersInsideDraggedScene = useCallback(
		() =>
			chapters.filter((chapter) =>
				chaptersInsideDraggedScene.includes(chapter.id)
			),
		[chapters, chaptersInsideDraggedScene]
	);

	const deleteChapterIfNecessary = useCallback((chapters) => {
		if (chapters.length < 2) return false;

		if (chapters[0].position >= chapters[1].position) {
			setChapters((prevState) => {
				let updatedChapters = [...prevState];
				updatedChapters.splice(updatedChapters.indexOf(chapters[0]), 1);
				return [...updatedChapters];
			});

			return true;
		}

		return false;
	}, []);

	const dragOrRemoveChapterIfNecessary = useCallback(
		(scene) => {
			const chapters = getChaptersInsideDraggedScene();
			if (!chapters.length) return;

			const hasChapterBeenDeleted = deleteChapterIfNecessary(chapters);
			if (hasChapterBeenDeleted) return;

			const sceneStartPassChapterStart = scene.start.x > chapters[0].position;
			if (!sceneStartPassChapterStart) return;

			setChapters((prevState) => {
				let tmpChapters = [...prevState];
				tmpChapters[chapters.indexOf(chapters[0])].position = scene.start.x;
				return [...tmpChapters];
			});
		},
		[deleteChapterIfNecessary, getChaptersInsideDraggedScene]
	);

	const removeChapterIfNecessary = useCallback(
		(scene) => {
			const chapters = getChaptersInsideDraggedScene();
			if (!chapters.length) return;

			const sceneEndPassChapterStart =
				chapters[chapters.length - 1] &&
				scene.end.x < chapters[chapters.length - 1].position;

			if (!sceneEndPassChapterStart) return;

			setChapters((prevState) => {
				let updatedChapters = [...prevState];
				updatedChapters.splice(
					updatedChapters.indexOf(chapters[chapters.length - 1]),
					1
				);
				return [...updatedChapters];
			});
		},
		[getChaptersInsideDraggedScene]
	);

	const handleChapterBetweenScenes = useCallback(
		(scene, type) => {
			switch (type) {
				case 'drag_left':
					return dragOrRemoveChapterIfNecessary(scene);
				case 'drag_right':
					return removeChapterIfNecessary(scene);
				default:
					return;
			}
		},
		[dragOrRemoveChapterIfNecessary, removeChapterIfNecessary]
	);

	const updateScene = useCallback(
		(state, action) => {
			const stateBeforeUpdate = [...state];

			if (!isSceneValid(action.scene)) {
				return stateBeforeUpdate;
			}

			const ValidScene = isSceneInvadingOther(
				action.sceneIdx,
				action.scene,
				state,
				action.type
			);

			handleChapterBetweenScenes(ValidScene, action.type);

			const updatedState = [...state];
			updatedState[action.sceneIdx] = {
				...updatedState[action.sceneIdx],
				...ValidScene,
			};
			return [...updatedState];
		},
		[handleChapterBetweenScenes, isSceneInvadingOther, isSceneValid]
	);

	const updateSceneImage = useCallback((state, action) => {
		const { img, sceneIdx } = action;

		if (!img || !state[sceneIdx]) return state;

		const updatedState = [...state];
		updatedState[sceneIdx].img = img;

		return updatedState;
	}, []);

	const [scenes, dispatchScene] = useReducer(
		(state, action) => {
			switch (action.type) {
				case 'delete':
					return deleteScenesAndInsideChapters(state, action);
				case 'create':
					return [...state, action.scene].sort((a, b) => a.start.x - b.start.x);
				case 'on_drag_start':
					setChaptersInsideDraggedScene(
						getIdOfChaptersInsideDraggedScene(action.scene)
					);
					return state;
				case 'on_drag_end':
					setChaptersInsideDraggedScene([]);
					return state;
				case 'drag_left':
				case 'drag_right':
					return updateScene(state, action);
				case 'update_scene_img':
					return updateSceneImage(state, action);
				default:
					return state;
			}
		},
		[{ start: { x: 0, y: 0 }, end: { x: 1, y: 0 } }]
	);

	return {
		scenes,
		dispatchScene,
		setChapters,
		chapters,
	};
}
