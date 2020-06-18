import React, { useMemo } from 'react';
import { Modal as ModalBootstrap, ModalHeader, ModalBody } from 'reactstrap';
import { FaWindowClose } from 'react-icons/fa';
import styles from './Modal.module.scss';

const Modal = ({ onToggle, isOpen, title, body, isClosable, size = 'lg' }) => {
	const toggle = useMemo(() => (isClosable ? onToggle : undefined), [
		isClosable,
		onToggle,
	]);

	const closeIcon = useMemo(
		() =>
			isClosable ? (
				<FaWindowClose
					size="1.3rem"
					className={styles.closeIcon}
					onClick={onToggle}
				/>
			) : undefined,
		[isClosable, onToggle]
	);

	return (
		<div>
			<ModalBootstrap
				isOpen={isOpen}
				toggle={onToggle}
				size={size}
				contentClassName={styles.modal}
				centered
			>
				<ModalHeader
					toggle={toggle}
					className={styles.modalHeader}
					close={closeIcon}
				>
					{title}
				</ModalHeader>
				<ModalBody>{body}</ModalBody>
			</ModalBootstrap>
		</div>
	);
};

export default Modal;
