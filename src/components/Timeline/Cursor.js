import React, { useMemo } from 'react';

import cx from 'classnames';
import Draggable from 'react-draggable';

import styles from './Cursor.module.scss';
import { X_SNAP_TO } from '../../utils/constants';

const Cursor = ({ handleDrag, handleDragEnd, cursorPosition, bound }) => {
	const position = useMemo(() => ({ x: cursorPosition, y: 0 }), [
		cursorPosition,
	]);

	return (
		<Draggable
			axis="x"
			handle=".handle"
			onDrag={handleDrag}
			onStop={handleDragEnd}
			position={position}
			bounds={bound}
			grid={[X_SNAP_TO, 0]}
		>
			<div className={cx('handle', styles['stick'])}></div>
		</Draggable>
	);
};

export default Cursor;
