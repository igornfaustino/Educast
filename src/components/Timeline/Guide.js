import React, { useMemo } from 'react';
import { GiFilmStrip, GiStack } from 'react-icons/gi';
import { FaPlusSquare, FaMinusSquare } from 'react-icons/fa';
import styles from './Guide.module.scss';

const Guide = ({ onAdd, onDelete, isAddDisable, isDeleteDisable, type }) => {
	const addButtonClassName = useMemo(
		() =>
			isAddDisable
				? styles['btnContainer__button-disabled']
				: styles['btnContainer__button'],
		[isAddDisable]
	);

	const deleteButtonClassName = useMemo(
		() =>
			isDeleteDisable
				? styles['btnContainer__button-disabled']
				: styles['btnContainer__button'],
		[isDeleteDisable]
	);

	const title = useMemo(
		() =>
			type === 'video' ? (
				<div className={styles['btnContainer__left']}>
					<GiFilmStrip className={styles['btnContainer__icon']} />
					<span className={styles['btnContainer__text']}>Vídeo</span>
				</div>
			) : (
				<div className={styles['btnContainer__left']}>
					<GiStack className={styles['btnContainer__icon']} />
					<span className={styles['btnContainer__text']}>Capítulos</span>
				</div>
			),
		[type]
	);

	return (
		<div className={styles['btnContainer']}>
			{title}

			<div className={styles['btnContainer__right']}>
				<FaPlusSquare className={addButtonClassName} onClick={onAdd} />
				<FaMinusSquare className={deleteButtonClassName} onClick={onDelete} />
			</div>
		</div>
	);
};

export default Guide;
