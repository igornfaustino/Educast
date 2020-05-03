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

	const isSceneInvadingOther = useCallback(
		(sceneIdx, scene, scenes) =>
			scenes.some((otherScene, idx) => {
				if (sceneIdx === idx) return false;

				const isSceneInvadingRight =
					otherScene.start.x <= scene.end.x && scene.end.x <= otherScene.end.x;

				const isSceneInvadingLeft =
					scene.start.x <= otherScene.end.x &&
					otherScene.start.x <= scene.start.x;

				const isSceneLeftInsideScene =
					scene.end.x >= otherScene.end.x &&
					scene.start.x <= otherScene.start.x;

				const isSceneRightInsideScene =
					scene.start.x <= otherScene.start.x &&
					scene.end.x >= otherScene.end.x;

				return (
					isSceneInvadingRight ||
					isSceneInvadingLeft ||
					isSceneLeftInsideScene ||
					isSceneRightInsideScene
				);
			}),
		[]
	);

	const isSceneValid = useCallback(
		(scene, sceneIdx, scenes) => {
			const isSceneLimitsAreCrossing =
				scene.start.x >= scene.end.x || scene.end.x <= scene.start.x;
			if (isSceneLimitsAreCrossing) {
				return false;
			}
			if (isSceneInvadingOther(sceneIdx, scene, scenes)) {
				return false;
			}
			return true;
		},
		[isSceneInvadingOther]
	);

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

	const dragChapterIfNecessary = useCallback(
		(scene) => {
			const chapters = getChaptersInsideDraggedScene();
			if (!chapters.length) return;

			const sceneStartPassChapterStart = scene.start.x > chapters[0].position;
			if (!sceneStartPassChapterStart) return;

			setChapters((prevState) => {
				let tmpChapters = [...prevState];
				tmpChapters[chapters.indexOf(chapters[0])].position = scene.start.x;
				return [...tmpChapters];
			});
		},
		[getChaptersInsideDraggedScene]
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
					return dragChapterIfNecessary(scene);
				case 'drag_right':
					return removeChapterIfNecessary(scene);
				default:
					return;
			}
		},
		[dragChapterIfNecessary, removeChapterIfNecessary]
	);

	const updateScene = useCallback(
		(state, action) => {
			const stateBeforeUpdate = [...state];

			if (!isSceneValid(action.scene, action.sceneIdx, state)) {
				return stateBeforeUpdate;
			}

			handleChapterBetweenScenes(action.scene, action.type);

			const updatedState = [...state];
			updatedState[action.sceneIdx] = action.scene;
			return [...updatedState];
		},
		[handleChapterBetweenScenes, isSceneValid]
	);

	const [scenes, dispatchScene] = useReducer((state, action) => {
		switch (action.type) {
			case 'delete':
				return deleteScenesAndInsideChapters(state, action);
			case 'create':
				return [...state, action.scene];
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
			default:
				return state;
		}
	}, []);

	return {
		scenes,
		dispatchScene,
		setChapters,
		chapters,
	};
}
