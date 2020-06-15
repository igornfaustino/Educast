import React from 'react';
import styles from './PublishModal.module.scss';
import Modal from './Modal';

import { FaRegImages } from 'react-icons/fa';

import { Button } from 'reactstrap';

const SaveModal = ({ onToggle, isOpen }) => {
	const body = (
		<>
			<p className={styles.text}>
				O clip será exportado para seu canal
				<br />
				em vários formatos de entrega:
			</p>
			<div className={styles.iconsWrapper}>
				<div className={styles.iconTextWrapper}>
					<FaRegImages size="2rem" />
					<span>Streaming</span>
				</div>
				<div className={styles.iconTextWrapper}>
					<FaRegImages size="2rem" />
					<span>Desktop</span>
				</div>
				<div className={styles.iconTextWrapper}>
					<FaRegImages size="2rem" />
					<span>Mobile</span>
				</div>
			</div>
			<div className={styles.button}>
				<Button
					color="primary"
					className="app-buttons  app-home-buttons"
					onClick={onToggle}
				>
					OK
				</Button>
			</div>
		</>
	);

	const title = (
		<div className={styles.titleWrapper}>
			<span>Publicação</span>
		</div>
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

export default SaveModal;
