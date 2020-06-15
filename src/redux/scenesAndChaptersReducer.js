const initialState = {
	scenes: [{ start: { x: 0, y: 0 }, end: { x: 1, y: 0 } }],
	chapters: [],
	chaptersInsideDraggedScene: [],
	timelineWidth: 1,
};

const isChapterInsideScene = (chapter, scene) =>
	scene.start.x <= chapter.position && scene.end.x >= chapter.position;

const removeChaptersInsideScene = (state, scenes) => {
	let chaptersToKeep = [...state.chapters];
	scenes.forEach((scene) => {
		chaptersToKeep = chaptersToKeep.filter(
			(chapter) => !isChapterInsideScene(chapter, scene)
		);
	});
	return chaptersToKeep;
};

const deleteScenesAndInsideChapters = (state, action) => {
	const { scenes } = state;

	const deletedScenes = scenes.filter((_, idx) => {
		return action.scenesIdx.includes(idx);
	});

	const chapters = removeChaptersInsideScene(state, deletedScenes);

	const updatedScenes = scenes.filter((_, idx) => {
		return !action.scenesIdx.includes(idx);
	});
	return Object.assign({}, state, {
		chapters,
		scenes: updatedScenes,
	});
};

const getIdOfChaptersInsideDraggedScene = (scene, { chapters }) => [
	...chapters
		.filter((chapter) => {
			return (
				(scene.start.x <= chapter.position &&
					scene.end.x >= chapter.position) ||
				(scene.start.x <= chapter.position && scene.end.x >= chapter.position)
			);
		})
		.map((chapter) => chapter.id),
];

const setChaptersInsideDraggedScene = (state, action) =>
	Object.assign({}, state, {
		chaptersInsideDraggedScene: getIdOfChaptersInsideDraggedScene(
			action.scene,
			state
		),
	});

const cleanChaptersInsideDraggedScene = (state) =>
	Object.assign({}, state, {
		chaptersInsideDraggedScene: [],
	});

const isSceneValid = (scene) => {
	const isSceneLimitsAreCrossing =
		scene.start.x >= scene.end.x || scene.end.x <= scene.start.x;
	if (isSceneLimitsAreCrossing) {
		return false;
	}
	return true;
};

const isSceneInvadingOther = (sceneIdx, scene, { scenes }, type) => {
	let validScene = scene;

	scenes.some((otherScene, idx) => {
		if (sceneIdx === idx) return false;

		const isSceneInvadingRight =
			type === 'DRAG_RIGHT' &&
			otherScene.start.x < scene.end.x &&
			scene.end.x < otherScene.end.x;

		const isSceneRightInsideScene =
			type === 'DRAG_RIGHT' &&
			scene.start.x < otherScene.start.x &&
			scene.end.x > otherScene.end.x;

		if (isSceneInvadingRight || isSceneRightInsideScene) {
			validScene.end.x = otherScene.start.x;
			return true;
		}

		const isSceneInvadingLeft =
			type === 'DRAG_LEFT' &&
			scene.start.x < otherScene.end.x &&
			otherScene.start.x < scene.start.x;

		const isSceneLeftInsideScene =
			type === 'DRAG_LEFT' &&
			scene.end.x > otherScene.end.x &&
			scene.start.x < otherScene.start.x;

		if (isSceneInvadingLeft || isSceneLeftInsideScene) {
			validScene.start.x = otherScene.end.x;
			return true;
		}

		return false;
	});
	return validScene;
};

const getChaptersInsideDraggedScene = ({
	chapters,
	chaptersInsideDraggedScene,
}) =>
	chapters.filter((chapter) => chaptersInsideDraggedScene.includes(chapter.id));

const deleteChapterIfNecessary = (chapters) => {
	if (chapters.length < 2) return false;

	if (chapters[0].position >= chapters[1].position) {
		const updatedChapters = [...chapters];
		updatedChapters.splice(updatedChapters.indexOf(chapters[0]), 1);
		return [...updatedChapters];
	}

	return;
};

const dragOrRemoveChapterIfNecessary = (scene, state) => {
	const chaptersInsideScene = getChaptersInsideDraggedScene(state);
	if (!chaptersInsideScene.length) return state.chapters;

	const chapterStateWithDeletedChapters = deleteChapterIfNecessary(
		chaptersInsideScene
	);
	if (chapterStateWithDeletedChapters) return chapterStateWithDeletedChapters;

	const sceneStartPassChapterStart =
		scene.start.x > chaptersInsideScene[0].position;
	if (!sceneStartPassChapterStart) return state.chapters;

	let tmpChapters = [...state.chapters];
	tmpChapters[tmpChapters.indexOf(chaptersInsideScene[0])].position =
		scene.start.x;

	return tmpChapters.filter((chapter) => {
		if (!chaptersInsideScene.includes(chapter)) return true;
		return chapter.position >= scene.start.x;
	});
};

const removeChapterIfNecessary = (scene, state) => {
	const chaptersInsideScene = getChaptersInsideDraggedScene(state);
	if (!chaptersInsideScene.length) return state.chapters;

	const updatedChapters = [...state.chapters];

	return updatedChapters.filter((chapter) => {
		if (!chaptersInsideScene.includes(chapter)) return true;
		return !(scene.end.x < chapter.position);
	});
};

const handleChapterBetweenScenesAndGetChaptersState = (state, scene, type) => {
	switch (type) {
		case 'DRAG_LEFT':
			return dragOrRemoveChapterIfNecessary(scene, state);
		case 'DRAG_RIGHT':
			return removeChapterIfNecessary(scene, state);
		default:
			return state.chapters;
	}
};

const updateScene = (state, action) => {
	if (!isSceneValid(action.scene)) {
		return state;
	}

	const ValidScene = isSceneInvadingOther(
		action.sceneIdx,
		action.scene,
		state,
		action.type
	);

	const chapters = handleChapterBetweenScenesAndGetChaptersState(
		state,
		ValidScene,
		action.type
	);

	const updatedScenes = [...state.scenes];
	updatedScenes[action.sceneIdx] = {
		...updatedScenes[action.sceneIdx],
		...ValidScene,
	};
	return Object.assign({}, state, {
		chapters,
		scenes: updatedScenes,
	});
};

const updateSceneImage = (state, action) => {
	const { img, sceneIdx } = action;

	if (!img || !state.scenes[sceneIdx]) return state;

	const updatedState = [...state.scenes];
	updatedState[sceneIdx].img = img;

	return Object.assign({}, state, {
		scenes: updatedState,
	});
};

const updateChapterImage = (state, action) => {
	const { img, id } = action;
	const chapterIdx = state.chapters.findIndex((chapter) => chapter.id === id);
	if (!img || !chapterIdx) return state;

	const updatedState = [...state.chapters];
	updatedState[chapterIdx].img = img;

	return Object.assign({}, state, {
		chapters: updatedState,
	});
};

const updateChapterTitle = (state, action) => {
	const { title, id } = action;
	const chapterIdx = state.chapters.findIndex((chapter) => chapter.id === id);
	if (!title || !chapterIdx) return state;

	const updatedState = [...state.chapters];
	updatedState[chapterIdx].title = title;

	return Object.assign({}, state, {
		chapters: updatedState,
	});
};

const createScene = (state, action) =>
	Object.assign({}, state, {
		scenes: [...state.scenes, action.scene].sort(
			(a, b) => a.start.x - b.start.x
		),
	});

const handleShortcutI = (state, action) => {
	const { currentPosition } = action;

	const findScene = (scene, idx) => {
		if (idx === state.scenes.length - 1) return true;
		return scene.end.x >= currentPosition.x;
	};

	const sceneToMove = {
		...state.scenes.find(findScene),
	};

	const newState = {
		...state,
		...setChaptersInsideDraggedScene(state, { scene: sceneToMove }),
	};

	const sceneIdx = state.scenes.findIndex(findScene);
	sceneToMove.start.x = currentPosition.x;
	if (sceneToMove.start.x > sceneToMove.end.x) {
		sceneToMove.end.x = 1;
	}

	return {
		...updateScene(newState, {
			scene: sceneToMove,
			type: 'DRAG_LEFT',
			sceneIdx,
		}),
		chaptersInsideDraggedScene: [],
	};
};

const handleShortcutO = (state, action) => {
	const { currentPosition } = action;

	const findScene = (scene, idx) => {
		if (idx === state.scenes.length - 1) return true;
		return scene.start.x <= currentPosition.x;
	};

	const reversedScenes = [...state.scenes].reverse();

	const sceneToMove = {
		...reversedScenes.find(findScene),
	};

	const newState = {
		...state,
		...setChaptersInsideDraggedScene(state, { scene: sceneToMove }),
	};

	const sceneIdx =
		state.scenes.length - 1 - reversedScenes.findIndex(findScene);
	sceneToMove.end.x = currentPosition.x;
	if (sceneToMove.start.x > sceneToMove.end.x) {
		sceneToMove.start.x = 0;
	}

	return {
		...updateScene(newState, {
			scene: sceneToMove,
			type: 'DRAG_RIGHT',
			sceneIdx,
		}),
		chaptersInsideDraggedScene: [],
	};
};

export const sceneAndChaptersReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'DELETE':
			return deleteScenesAndInsideChapters(state, action);
		case 'CREATE':
			return createScene(state, action);
		case 'ON_DRAG_START':
			return setChaptersInsideDraggedScene(state, action);
		case 'ON_DRAG_END':
			return cleanChaptersInsideDraggedScene(state);
		case 'DRAG_LEFT':
		case 'DRAG_RIGHT':
			return updateScene(state, action);
		case 'UPDATE_SCENE_IMG':
			return updateSceneImage(state, action);
		case 'UPDATE_CHAPTER_IMG':
			return updateChapterImage(state, action);
		case 'UPDATE_CHAPTER_TITLE':
			return updateChapterTitle(state, action);
		case 'SET_CHAPTERS':
			return Object.assign({}, state, {
				chapters: action.chapters,
			});
		case 'SHORTCUT_I':
			return handleShortcutI(state, action);
		case 'SHORTCUT_O':
			return handleShortcutO(state, action);
		default:
			return state;
	}
};
