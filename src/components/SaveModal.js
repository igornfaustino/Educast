import React, { useMemo, useCallback } from 'react';
import styles from './SaveModal.module.scss';
import Modal from './Modal';

import { FaSave } from 'react-icons/fa';

import { Button } from 'reactstrap';

const SaveModal = ({ onToggle, isOpen, okFunction }) => {
	const saveFunction = useCallback(() => {
		okFunction();
		onToggle();
	}, [okFunction, onToggle]);

	const body = useMemo(
		() => (
			<>
				<p className={styles.text}>
					As suas alterações foram gravadas
					<br />
					com sucesso.
				</p>
				<div className={styles.button}>
					<Button
						color="primary"
						className="app-buttons  app-home-buttons"
						onClick={saveFunction}
					>
						OK
					</Button>
				</div>
			</>
		),
		[saveFunction]
	);

	const title = useMemo(
		() => (
			<div className={styles.titleWrapper}>
				<FaSave />
				<span>Alterações gravadas</span>
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
