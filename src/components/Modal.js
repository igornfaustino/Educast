import React from 'react';
import { Modal as ModalBootstrap, ModalHeader, ModalBody } from 'reactstrap';
import { FaWindowClose } from 'react-icons/fa';
import styles from './Modal.module.scss';

const Modal = ({ onToggle, isOpen, title, body, isClosable, size = 'lg' }) => {
	return (
		<div>
			<ModalBootstrap
				isOpen={isOpen}
				toggle={onToggle}
				size={size}
				contentClassName={styles.modal}
			>
				<ModalHeader
					toggle={isClosable ? onToggle : undefined}
					className={styles.modalHeader}
					close={
						isClosable ? (
							<FaWindowClose
								size="1.3rem"
								className={styles.closeIcon}
								onClick={onToggle}
							/>
						) : undefined
					}
				>
					{title}
				</ModalHeader>
				<ModalBody>{body}</ModalBody>
			</ModalBootstrap>
		</div>
	);
};

export default Modal;
