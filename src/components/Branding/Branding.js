import React, { useState, useCallback } from 'react';
import cx from 'classnames';
import styles from './Branding.module.scss';
import ModalImage from './ModalImage';
import ModalPreRoll from './ModalPreRoll';
import useModal from '../../hooks/useModal';

import {
	FaUpload,
	FaImages,
	FaTimes,
	FaChalkboardTeacher,
} from 'react-icons/fa';

const Branding = (props) => {
	const [headerImage, setHeaderImage] = useState('Nenhum ficheiro selecionado');
	const [preRollImage, setPreRollImage] = useState(
		'Nenhum ficheiro selecionado'
	);

	const { isOpen: isModalImageOpen, onToggle: onToggleModalImage } = useModal();
	const {
		isOpen: isModalPreRollOpen,
		onToggle: onToggleModalPreRoll,
	} = useModal();

	const handleHeaderImageSubmit = useCallback((e) => {
		setHeaderImage(e.target.files[0].name);
	}, []);

	const handlePreRollImageSubmit = useCallback((e) => {
		setPreRollImage(e.target.files[0].name);
	}, []);

	return (
		<div className={styles.branding}>
			<div className={styles.leftColumn}>
				<p className={cx(styles.titleText)}>Imagem de Capa</p>

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
			</div>

			<div className={styles.rightColumn}>
				<span className={cx(styles.titleText, styles.upperRightTitle)}>
					Imagem de Cabeçalho
				</span>

				<div className={styles.inputWrapper}>
					<label htmlFor="header" className={styles.labelBtn}>
						Selecionar Ficheiro
					</label>
					<span className={styles.fileName}>{headerImage}</span>
					<input
						type="file"
						id="header"
						name="filename"
						className={styles.selectFile}
						onChange={handleHeaderImageSubmit}
					/>
				</div>

				<p className={styles.text}>
					<strong>Nota: </strong>
					<span onClick={onToggleModalImage} className={styles.link}>
						Recomendações Ténicas
					</span>{' '}
					para a criação da imagem de cabeçalho
				</p>

				<span className={cx(styles.bottomRightTitle)}>Vídeo Pre-Roll</span>
				<div className={styles.inputWrapper}>
					<label htmlFor="preRoll" className={styles.labelBtn}>
						Selecionar Ficheiro
					</label>
					<span className={styles.fileName}>{preRollImage}</span>
					<input
						type="file"
						id="preRoll"
						name="filename"
						className={styles.selectFile}
						onChange={handlePreRollImageSubmit}
					/>
				</div>
				<p className={styles.text}>
					<strong>Nota: </strong>
					<span className={styles.link} onClick={onToggleModalPreRoll}>
						Recomendações Ténicas
					</span>{' '}
					para a criação do vídeo PreRoll
				</p>
			</div>

			<ModalImage onToggle={onToggleModalImage} isOpen={isModalImageOpen} />
			<ModalPreRoll
				onToggle={onToggleModalPreRoll}
				isOpen={isModalPreRollOpen}
			/>
		</div>
	);
};

export default Branding;
