import React, { useMemo } from 'react';
import styles from './PublishModal.module.scss';
import Modal from './Modal';

import { FaRegImages, FaLink } from 'react-icons/fa';

import { Button } from 'reactstrap';

import { ReactComponent as Streaming } from '../assets/Streaming.svg';
import { ReactComponent as Desktop } from '../assets/Desktop.svg';
import { ReactComponent as Mobile } from '../assets/Mobile.svg';

const SaveModal = ({ onToggle, isOpen }) => {
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
						<Streaming className={styles.icon} />
						<span>Streaming</span>
					</div>
					<div className={styles.iconTextWrapper}>
						<Desktop className={styles.icon} />
						<span>Desktop</span>
					</div>
					<div className={styles.iconTextWrapper}>
						<Mobile className={styles.icon} />
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
		),
		[onToggle]
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
