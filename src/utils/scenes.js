export const getIdxOfScenesWithoutImg = (scenes) =>
	scenes
		.map((scene, idx) => ({ ...scene, sceneIdx: idx }))
		.filter((scene) => !scene.img)
		.map((scene) => scene.sceneIdx);
