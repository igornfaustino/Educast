import { useState, useReducer, useCallback } from 'react';
import { getPositionInPercent } from '../utils/conversions';

export function useSceneChapters(timerDivWidth) {
	const [chapters, setChapters] = useState([]);

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

	const isChapterBetweenMovedScene = useCallback(
		(scene) =>
			chapters.some((chap) => {
				const valueInPercent = getPositionInPercent(10, timerDivWidth);
				return (
					(scene.start.x - valueInPercent <= chap.position &&
						scene.end.x >= chap.position) ||
					(scene.start.x <= chap.position &&
						scene.end.x + valueInPercent >= chap.position)
				);
			}),
		[chapters, timerDivWidth]
	);

	const updateScene = useCallback(
		(state, action) => {
			const stateBeforeUpdate = [...state];
			let updatedState = [...state];

			if (!isSceneValid(action.scene, action.sceneIdx, state)) {
				return stateBeforeUpdate;
			}

			// check if there was a chapter between the moved scene
			// WTF??
			const valueInPercent = getPositionInPercent(10, timerDivWidth);
			if (isChapterBetweenMovedScene(action.scene)) {
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
		},
		[chapters, isChapterBetweenMovedScene, isSceneValid, timerDivWidth]
	);

	const [scenes, dispatchScene] = useReducer((state, action) => {
		switch (action.type) {
			case 'delete':
				return deleteScenesAndInsideChapters(state, action);
			case 'create':
				return [...state, action.scene];
			default:
				return updateScene(state, action);
		}
	}, []);

	return {
		scenes,
		dispatchScene,
		setChapters,
		chapters,
	};
}
