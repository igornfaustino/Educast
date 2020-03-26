import React from 'react';
import styles from './VideoContainerHeader.module.scss';

import { FiFilm } from 'react-icons/fi';
import { MdAccessTime } from 'react-icons/md';

function VideoContainerHeader({ title, date }) {
	return (
		<div className={styles.header}>
			<div className={styles['header--left-side']}>
				<div className={styles['header--branding']}>EDITOR EDUCAST</div>
				<FiFilm size="1.125rem" className={styles.icon} />
				<div className={styles['header--text']}>{title}</div>
			</div>
			<div className={styles['header--right-side']}>
				<MdAccessTime className={styles.icon} size="1.125rem" />
				<div className={styles['header--text']}>{date}</div>
			</div>
		</div>
	);
}

export default VideoContainerHeader;
