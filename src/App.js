import React, { useState } from 'react';
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
				<div
					style={{
						width: '100%',
						height: '100%',
						justifyContent: 'center',
						alignItems: 'center',
						display: 'flex',
					}}
				>
					<span style={{ fontSize: 50 }}>VIDEO HERE</span>
				</div>
			</div>
			<Container fluid className="edition-div">
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
			</Container>
		</Container>
	);
}

export default App;
