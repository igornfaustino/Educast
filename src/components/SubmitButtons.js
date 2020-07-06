import React from 'react';

import { Button } from 'reactstrap';
import { FaSave, FaShare } from 'react-icons/fa';

import useModal from '../hooks/useModal';
import { useXml } from '../hooks/useXml';

import SaveModal from './SaveModal';
import PublishModal from './PublishModal';
const { xml } = require('../resources/base.xml.js');

const SubmitButtons = () => {
	const { getCompleteXML } = useXml(xml);
	const { isOpen: isSaveModalOpen, onToggle: onToggleSaveModal } = useModal();
	const {
		isOpen: isPublishModalOpen,
		onToggle: onTogglePublishModal,
	} = useModal();

	const printXML = () => console.log(getCompleteXML());

	return (
		<>
			<div className="app-buttons-container">
				<Button
					className="app-buttons app-home-buttons no-hover"
					onClick={onToggleSaveModal}
				>
					<FaSave size="1rem" className="icon-btn" />
					Salvar
				</Button>
				<Button
					color="primary"
					className="app-buttons  app-home-buttons blue-btn"
					onClick={onTogglePublishModal}
				>
					<FaShare size="1rem" className="icon-btn" />
					Publicar
				</Button>
			</div>
			<SaveModal
				isOpen={isSaveModalOpen}
				onToggle={onToggleSaveModal}
				okFunction={printXML}
			/>
			<PublishModal
				isOpen={isPublishModalOpen}
				onToggle={onTogglePublishModal}
				okFunction={printXML}
			/>
		</>
	);
};

export default SubmitButtons;
