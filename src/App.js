import React, { useState, useRef, useMemo, useCallback } from 'react';
import './App.scss';

import VideoContainer from './components/VideoPlayer/VideoContainer';
import Tabs from './components/Tabs';
import { BrowserRouter } from 'react-router-dom';
import { Container, Button } from 'reactstrap';
import StepperComponent from './components/Stepper';
import { FaSave, FaShare } from 'react-icons/fa';

import useModal from './hooks/useModal';

import SaveModal from './components/SaveModal';
import PublishModal from './components/PublishModal';

function App() {
	const [step, setStep] = useState(0);
	const videoComponentRef = useRef(null);

	const { isOpen: isSaveModalOpen, onToggle: onToggleSaveModal } = useModal();
	const {
		isOpen: isPublishModalOpen,
		onToggle: onTogglePublishModal,
	} = useModal();

	/**
	 * @returns `string` DataURI
	 */
	const getPresenterScreenShot = useCallback(
		() => videoComponentRef.current.getPresenterScreenShot(),
		[]
	);

	/**
	 * @returns `string` DataURI
	 */
	const getPresentationScreenShot = useCallback(
		() => videoComponentRef.current.getPresentationScreenShot(),
		[]
	);

	const handleTimelineClick = useCallback(
		(time) => videoComponentRef.current.handleTimelineClick(time),
		[]
	);

	const timelineProps = useMemo(
		() => ({
			getPresenterScreenShot,
			getPresentationScreenShot,
			handleTimelineClick,
		}),
		[getPresentationScreenShot, getPresenterScreenShot, handleTimelineClick]
	);

	return (
		<Container fluid className="app">
			<SaveModal isOpen={isSaveModalOpen} onToggle={onToggleSaveModal} />
			<PublishModal
				isOpen={isPublishModalOpen}
				onToggle={onTogglePublishModal}
			/>
			<div className="video-div">
				<VideoContainer ref={videoComponentRef} />
			</div>
			<div className="edition-div">
				<div className="edition-div-container">
					<BrowserRouter>
						<Tabs step={step} setStep={setStep} timelineProps={timelineProps} />
					</BrowserRouter>
				</div>
				<div className="stepper-buttons-container">
					<div className="stepper-container">
						<StepperComponent step={step} />
					</div>
					<div className="app-buttons-container">
						<Button
							color="warning"
							className="app-buttons app-home-buttons"
							onClick={onToggleSaveModal}
						>
							<FaSave size="1rem" className="icon-btn" />
							Salvar
						</Button>
						<Button
							color="primary"
							className="app-buttons  app-home-buttons"
							onClick={onTogglePublishModal}
						>
							<FaShare size="1rem" className="icon-btn" />
							Publicar
						</Button>
					</div>
				</div>
			</div>
		</Container>
	);
}

export default App;
