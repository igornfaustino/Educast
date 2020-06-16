import React from 'react';
import cx from 'classnames';
import styles from './Branding.module.scss';

import {
	FaUpload,
	FaImages,
	FaTimes,
	FaChalkboardTeacher,
} from 'react-icons/fa';

const Branding = (props) => {
	return (
		<div style={{ position: 'relative', width: '100%', height: '100%' }}>
			<span className={cx(styles.titleText, styles.leftTitle)}>
				Imagem de Capa
			</span>
			<span className={cx(styles.titleText, styles.upperRightTitle)}>
				Imagem de Cabeçalho
			</span>
			<div className={cx(styles.coverImage)}>
				<div>
					<FaImages />
				</div>
				<div>
					<FaChalkboardTeacher />
				</div>
				<div>
					<FaUpload />
				</div>
			</div>
		</div>
	);
};

export default Branding;
