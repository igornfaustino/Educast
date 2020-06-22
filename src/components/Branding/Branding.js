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
				<div className={styles.iconWrapper}>
					<div className={styles.iconBackground}>
						<FaChalkboardTeacher className={styles.icon} size={19} />
					</div>
					<div className={styles.iconBackground}>
						<FaImages className={styles.icon} size={19} />
					</div>
					<div className={styles.iconBackground}>
						<FaUpload className={styles.icon} size={18} />
					</div>
				</div>
			</div>

			<input
				type="file"
				id="myFile"
				name="filename"
				className={styles.selectFile}
			/>

			<p className={styles.text}>
				<strong>Nota: </strong>
				<a href="">Recomendações Ténicas</a> para a criação da imagem de
				cabeçalho
			</p>

			<span className={cx(styles.bottomRightTitle)}>Vídeo Pre-Roll</span>
			<input
				type="file"
				id="myFile"
				name="filename"
				className={styles.selectFile}
				style={{ marginTop: '18px' }}
			/>
			<p className={styles.text}>
				<strong>Nota: </strong>
				<a href="">Recomendações Ténicas</a> para a criação do vídeo PreRoll
			</p>
		</div>
	);
};

export default Branding;
