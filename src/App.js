import React, { useState, useRef, useMemo } from 'react';
import './App.scss';

import VideoContainer from './components/VideoContainer';
import Tabs from './components/Tabs';
import { BrowserRouter } from 'react-router-dom';
import { Container, Button } from 'reactstrap';
import StepperComponent from './components/Stepper';
import { FaSave, FaShare } from 'react-icons/fa';
import { useCallback } from 'react';
import { useVideo } from './hooks/useVideo';
import { getSnapshot } from './utils/snapshot';

const videoJSOptions = {
	controls: false,
	fluid: false,
	sources: [
		{
			src:
				'https://livestream01.fccn.pt/EducastVod2/_definst_/mp4:clips/0228xx/Clip_022864/ProducedClips/mpeg4_standard_V1_presenter_46.mp4/playlist.m3u8',
			type: 'application/x-mpegURL',
		},
	],
};

const videoJSOptionsApresentacao = {
	controls: false,
	fluid: false,
	sources: [
		{
			src:
				'https://livestream01.fccn.pt/EducastVod2/_definst_/mp4:clips/0228xx/Clip_022864/ProducedClips/mpeg4_standard_V1_screens_46.mp4/playlist.m3u8',
			type: 'application/x-mpegURL',
		},
	],
};

function App() {
	const video1Ref = useRef(null);
	const video2Ref = useRef(null);
	const [step, setStep] = useState(0);
	const [isVideoInverted, setIsVideoInverted] = useState(false);
	const [isVideo1Visible, setIsVideo1Visible] = useState(true);
	const [isVideo2Visible, setIsVideo2Visible] = useState(true);
	const video1Handle = useVideo(video1Ref, videoJSOptions);
	const video2Handle = useVideo(video2Ref, videoJSOptionsApresentacao);

	/**
	 * @returns `string` DataURI
	 */
	const getPresenterScreenShot = useCallback(
		() => getSnapshot(video1Ref.current),
		[]
	);

	/**
	 * @returns `string` DataURI
	 */
	const getPresentationScreenShot = useCallback(
		() => getSnapshot(video2Ref.current),
		[]
	);

	const handleTimelineClick = useCallback(
		(time) => {
			video1Handle.setClickedTime(time);
			video2Handle.setClickedTime(time);
		},
		[video1Handle, video2Handle]
	);

	const presenterVideo = useMemo(
		() => <video ref={video1Ref} className="video-js"></video>,
		[]
	);

	const presentationVideo = useMemo(
		() => <video ref={video2Ref} className="video-js"></video>,
		[]
	);

	return (
		<Container fluid className="app">
			<div className="video-div">
				<VideoContainer
					video1Handle={video1Handle}
					video2Handle={video2Handle}
					presenterVideo={presenterVideo}
					presentationVideo={presentationVideo}
					handleTimelineClick={handleTimelineClick}
					isVideoInverted={isVideoInverted}
					setIsVideoInverted={setIsVideoInverted}
					isVideo1Visible={isVideo1Visible}
					isVideo2Visible={isVideo2Visible}
					setIsVideo1Visible={setIsVideo1Visible}
					setIsVideo2Visible={setIsVideo2Visible}
				/>
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
