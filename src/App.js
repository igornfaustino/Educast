import React, { useState } from 'react';
import './App.scss';

import VideoContainer from './components/VideoContainer';
import Tabs from './components/Tabs';
import { BrowserRouter } from 'react-router-dom';
import { Container, Button } from 'reactstrap';
import StepperComponent from './components/Stepper';
import { FaSave, FaShare } from 'react-icons/fa';

function App() {
	const [step, setStep] = useState(0);
	return (
		<Container fluid className="app">
			<div className="video-div">
				<VideoContainer />
			</div>
			<div className="edition-div">
				<div className="edition-div-container">
					<BrowserRouter>
						<Tabs step={step} setStep={setStep} />
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
