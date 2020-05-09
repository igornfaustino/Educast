import React, { useState, useRef, useMemo } from 'react';
import './App.scss';

import VideoContainer from './components/VideoContainer';
import Tabs from './components/Tabs';
import { BrowserRouter } from 'react-router-dom';
import { Container, Button } from 'reactstrap';
import StepperComponent from './components/Stepper';
import { FaSave, FaShare } from 'react-icons/fa';
import { useCallback } from 'react';

function App() {
	const [step, setStep] = useState(0);
	const videoComponentRef = useRef(null);

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

	const timelineProps = useMemo(
		() => ({
			getPresenterScreenShot,
			getPresentationScreenShot,
		}),
		[getPresentationScreenShot, getPresenterScreenShot]
	);

	return (
		<Container fluid className="app">
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
						<Button color="warning" className="app-buttons app-home-buttons">
							<FaSave size="1rem" className="icon-btn" />
							Salvar
						</Button>
						<Button color="primary" className="app-buttons  app-home-buttons">
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
