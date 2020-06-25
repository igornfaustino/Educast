import React, { useMemo } from 'react';
import styles from './ModalPreRoll.module.scss';
import Modal from '../Modal';

import { FaFilm } from 'react-icons/fa';

import { Button } from 'reactstrap';

const ModalPreRoll = ({ onToggle, isOpen }) => {
	const body = useMemo(
		() => (
			<div className={styles.bodyWrapper}>
				<strong className={styles.title}>Recomendações Técnicas:</strong>
				<span>Dimensões do vídeo: Full HD (1920x1080)</span>
				<span>Duração máxima: 15 segundos</span>
				<span>Formatos suportados: mov, mp4, m4v</span>
				<span>Tamanho Máximo: 15MB</span>
				<br />
				<Button
					color="primary"
					className="app-buttons  app-home-buttons"
					onClick={onToggle}
				>
					OK
				</Button>
			</div>
		),
		[onToggle]
	);

	const title = useMemo(
		() => (
			<div className={styles.titleWrapper}>
				<FaFilm />
				<span>Vídeo Pre-Roll</span>
			</div>
		),
		[]
	);

	return (
		<Modal
			isOpen={isOpen}
			onToggle={onToggle}
			body={body}
			title={title}
			size="md"
		/>
	);
};

export default ModalPreRoll;
