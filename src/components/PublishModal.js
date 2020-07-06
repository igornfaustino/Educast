import React, { useMemo, useCallback } from 'react';
import styles from './PublishModal.module.scss';
import Modal from './Modal';

import { FaLink } from 'react-icons/fa';

import { Button } from 'reactstrap';

import Streaming from '../assets/Streaming.png';
import Desktop from '../assets/Desktop.png';
import Mobile from '../assets/Mobile.png';

const SaveModal = ({ onToggle, isOpen, okFunction }) => {
	const publishFunction = useCallback(() => {
		okFunction();
		onToggle();
	}, [okFunction, onToggle]);

	const body = useMemo(
		() => (
			<>
				<p className={styles.text}>
					O clip será exportado para seu canal
					<br />
					em vários formatos de entrega:
				</p>
				<div className={styles.iconsWrapper}>
					<div className={styles.iconTextWrapper}>
						<img className={styles.icon} src={Streaming} alt="streaming" />
						<span>Streaming</span>
					</div>
					<div className={styles.iconTextWrapper}>
						<img className={styles.icon} src={Desktop} alt="desktop" />
						<span>Desktop</span>
					</div>
					<div className={styles.iconTextWrapper}>
						<img className={styles.icon} src={Mobile} alt="mobile" />
						<span>Mobile</span>
					</div>
				</div>
				<div className={styles.button}>
					<Button
						color="primary"
						className="app-buttons  app-home-buttons"
						onClick={publishFunction}
					>
						OK
					</Button>
				</div>
			</>
		),
		[publishFunction]
	);

	const title = useMemo(
		() => (
			<div className={styles.titleWrapper}>
				<FaLink />
				<span>Publicação</span>
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

export default SaveModal;
