import React, { useMemo } from 'react';
import styles from './ModalImage.module.scss';
import Modal from '../Modal';

import { FaImage } from 'react-icons/fa';

import { Button } from 'reactstrap';

const ModalImage = ({ onToggle, isOpen }) => {
	const body = useMemo(
		() => (
			<div className={styles.bodyWrapper}>
				<strong className={styles.title}>Recomendações Técnicas:</strong>
				<span>Utilizar um fundo branco</span>
				<span>Dimensões da imagem: 960x60px</span>
				<span>Formatos Suportados: jpg, jpeg e png</span>
				<span>Tamanho Máximo: 2MB</span>
				<a href="">Download Template</a>
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
				<FaImage />
				<span>Imagem Cabeçalho</span>
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

export default ModalImage;
