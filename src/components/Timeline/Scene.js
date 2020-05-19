import React, { useCallback, useMemo } from 'react';

import cx from 'classnames';

import styles from './Scene.module.scss';
import { getPositionInPx, getPositionInPercent } from '../../utils/conversions';
import SceneBar from './SceneBar';

const Scene = ({
	scene,
	idx,
	timerDivWidth,
	isSelected,
	dispatchScene,
	handleSceneSelect,
}) => {
	const onDragStart = useCallback(
		() => dispatchScene({ scene: scene, type: 'on_drag_start' }),
		[dispatchScene, scene]
	);

	const onDragStop = useCallback(() => dispatchScene({ type: 'on_drag_end' }), [
		dispatchScene,
	]);

	const onDragLeft = useCallback(
		(e, ui) => {
			const tmpScene = {
				start: { x: getPositionInPercent(ui.x, timerDivWidth), y: 0 },
				end: scene.end,
			};
			dispatchScene({
				sceneIdx: idx,
				scene: tmpScene,
				type: 'drag_left',
			});
		},
		[dispatchScene, idx, scene.end, timerDivWidth]
	);

	const onDragRight = useCallback(
		(e, ui) => {
			const updatedScene = {
				start: scene.start,
				end: { x: getPositionInPercent(ui.x, timerDivWidth), y: 0 },
			};
			dispatchScene({
				sceneIdx: idx,
				scene: updatedScene,
				type: 'drag_right',
			});
		},
		[dispatchScene, idx, scene.start, timerDivWidth]
	);

	const onClick = useCallback(() => handleSceneSelect(idx), [
		handleSceneSelect,
		idx,
	]);

	const sceneStartPx = useMemo(
		() => getPositionInPx(scene.start.x, timerDivWidth),
		[scene.start.x, timerDivWidth]
	);

	const sceneEndPx = useMemo(
		() => getPositionInPx(scene.end.x, timerDivWidth),
		[scene.end.x, timerDivWidth]
	);

	const layerStyle = useMemo(
		() => ({
			marginLeft: getPositionInPx(scene.start.x, timerDivWidth) + 4,
			width: getPositionInPx(scene.end.x - scene.start.x, timerDivWidth),
		}),
		[scene.end.x, scene.start.x, timerDivWidth]
	);

	const sceneStyle = useMemo(
		() => ({
			marginLeft: getPositionInPx(scene.start.x, timerDivWidth) + 4,
			width: getPositionInPx(scene.end.x - scene.start.x, timerDivWidth),

			backgroundImage: `url(${scene.img})`,
		}),
		[scene.end.x, scene.img, scene.start.x, timerDivWidth]
	);

	const layerClassName = useMemo(
		() =>
			isSelected
				? cx(
						styles['scene-content'],
						styles['scene-content-layer'],
						styles.selected
				  )
				: cx(styles['scene-content'], styles['scene-content-layer']),
		[isSelected]
	);

	const layer = useMemo(() => {
		const sceneNumber = idx + 1;
		return (
			<div className={layerClassName} style={layerStyle} onClick={onClick}>
				Cena {sceneNumber}
			</div>
		);
	}, [idx, layerClassName, layerStyle, onClick]);

	return (
		<>
			<SceneBar
				type="begin"
				positionInPx={sceneStartPx}
				onDrag={onDragLeft}
				onStop={onDragStop}
				onStart={onDragStart}
			/>
			<div className={styles['scene-content']} style={sceneStyle} />
			{layer}
			<SceneBar
				type="end"
				positionInPx={sceneEndPx}
				onDrag={onDragRight}
				onStop={onDragStop}
				onStart={onDragStart}
			/>
		</>
	);
};

export default Scene;
