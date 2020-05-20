import React, { useCallback, useMemo } from 'react';

import cx from 'classnames';

import styles from './Chapter.module.scss';
import { getPositionInPx } from '../../utils/conversions';

const Chapter = ({
	chapter,
	timerDivWidth,
	isSelected,
	handleChapterSelectedSelect,
	chapterEndPosition,
}) => {
	const onClick = useCallback(() => handleChapterSelectedSelect(chapter.id), [
		chapter.id,
		handleChapterSelectedSelect,
	]);

	const chapterLimiterStyle = useMemo(
		() => ({
			marginLeft: getPositionInPx(chapter.position, timerDivWidth) + 1.5,
		}),
		[chapter.position, timerDivWidth]
	);

	const chapterLimiterClassName = useMemo(
		() =>
			cx(
				styles['chapter-tag'],
				isSelected ? styles['chapter-tag--blue'] : styles['chapter-tag--gray']
			),
		[isSelected]
	);

	const chapterStyle = useMemo(
		() => ({
			marginLeft: getPositionInPx(chapter.position, timerDivWidth) + 4 + 'px',
			width: getPositionInPx(
				chapterEndPosition - chapter.position,
				timerDivWidth
			),
			backgroundImage: `url(${chapter.img})`,
		}),
		[chapter.img, chapter.position, chapterEndPosition, timerDivWidth]
	);

	const layerClassName = useMemo(
		() =>
			isSelected
				? cx(
						styles['chapter-content'],
						styles['chapter-content-layer'],
						styles.selected
				  )
				: cx(styles['chapter-content'], styles['chapter-content-layer']),
		[isSelected]
	);

	const layerStyle = useMemo(
		() => ({
			marginLeft: getPositionInPx(chapter.position, timerDivWidth) + 4,
			width: getPositionInPx(
				chapterEndPosition - chapter.position,
				timerDivWidth
			),
		}),
		[chapter.position, chapterEndPosition, timerDivWidth]
	);

	return (
		<>
			<div className={chapterLimiterClassName} style={chapterLimiterStyle} />
			<div className={styles['chapter-content']} style={chapterStyle} />
			<div className={layerClassName} style={layerStyle} onClick={onClick} />
		</>
	);
};

export default Chapter;
