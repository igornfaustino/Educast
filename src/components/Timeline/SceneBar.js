import React, { useMemo } from 'react';

import Draggable from 'react-draggable';
import cx from 'classnames';

import styles from './Scene.module.scss';
import { X_SNAP_TO } from '../../utils/constants';

const SceneBar = ({ onDrag, onStart, onStop, type, positionInPx }) => {
	const className = useMemo(
		() =>
			type === 'begin'
				? cx('handle', styles['scene-limiter'], styles['scene-limiter---start'])
				: cx('handle', styles['scene-limiter'], styles['scene-limiter---end']),
		[type]
	);

	const position = useMemo(
		() => ({
			x: positionInPx,
			y: 0,
		}),
		[positionInPx]
	);

	const grid = useMemo(() => [X_SNAP_TO, 0], []);

	return (
		<Draggable
			axis="x"
			handle=".handle"
			bounds=".timeline__video-invisible"
			grid={grid}
			position={position}
			onStart={onStart}
			onDrag={onDrag}
			onStop={onStop}
		>
			<div className={className}></div>
		</Draggable>
	);
};

export default SceneBar;
