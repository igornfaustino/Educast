import React, { useState, useEffect, useMemo } from 'react';
import { GiFilmStrip, GiStack } from 'react-icons/gi';
import { FaPlusSquare, FaMinusSquare } from 'react-icons/fa';
import Draggable from 'react-draggable';
import TimeIndicator from './TimeIndicator';

import cx from 'classnames';
import styles from './Timeline.module.scss';

const FINAL_SPACE = 34;

const Timeline = ({
	videoBoxRef,
	timerDivWidth,
	chapterTimelineRef,
	videoTimelineRef,
	deltaPosition,
	setDeltaPosition,
	videoLength,
	timelineIndicatorRef,
	scenes,
	dispatchScene,
	chapters,
	setChapters,
	getPresenterScreenShot,
	getPresentationScreenShot,
}) => {
	const [selectedScenes, setSelectedScenes] = useState([]);
	const [selectedChapters, setSelectedChapters] = useState([]);

	const [disableVideoButton, setDisableVideoButton] = useState(false);
	const [disableChapterButton, setDisableChapterButton] = useState(false);

	const [isSelectedScenesEmpty, setIsSelectedScenesEmpty] = useState(true);
	const [isSelectedChaptersEmpty, setIsSelectedChaptersEmpty] = useState(true);

	useEffect(() => {
		createScene();
	}, []);

	useEffect(() => {
		setIsSelectedScenesEmpty(() => {
			return selectedScenes.length > 0 ? false : true;
		});
	}, [selectedScenes]);

	useEffect(() => {
		setIsSelectedChaptersEmpty(() => {
			return selectedChapters.length > 0 ? false : true;
		});
	}, [selectedChapters]);

	useEffect(() => {
		if (isMarkerInScene()) {
			setDisableVideoButton(() => {
				return true;
			});
			setDisableChapterButton(() => {
				return false;
			});
		} else {
			setDisableVideoButton(() => {
				return false;
			});
			setDisableChapterButton(() => {
				return true;
			});
		}
	}, [deltaPosition, scenes]);

	const handleDrag = (e, ui) => {
		const { x, y } = deltaPosition;
		console.log('asdkadkaskDSFASFSAFASFAS', ui);
		setDeltaPosition({
			x: x + ui.deltaX / timerDivWidth,
		});
	};

	const deleteScene = () => {
		setSelectedScenes([]);

		// remove the selected chapter from the array
		const deletedScenes = scenes.filter((val, idx) => {
			return selectedScenes.includes(idx);
		});
		deletedScenes.forEach((scene) => {
			// chapters that are in a scene
			const chaptersToDelete = chapters.filter((chap) => {
				console.log(chap);
				return scene.start.x <= chap.position && scene.end.x >= chap.position;
			});
			if (chaptersToDelete.length > 0) {
				chaptersToDelete.forEach((element) => {
					setSelectedChapters((prevState) => {
						let tmpSelectedChapters = [...prevState];
						tmpSelectedChapters.splice(
							tmpSelectedChapters.indexOf(element.id),
							1
						);
						return [...tmpSelectedChapters];
					});
				});
			}
		});
		dispatchScene({ type: 'delete', deleteIdx: selectedScenes });
	};

	const deleteChapter = () => {
		// dispatchChapter({ type: "delete", deleteIdx: selectedChapters });
		setChapters((prevState) => {
			const tmp = prevState.filter((val) => {
				return !selectedChapters.includes(val.id);
			});

			return [...tmp];
		});
		setSelectedChapters([]);
	};

	// check if the main marker is in a scene
	const isMarkerInScene = () => {
		if (
			scenes.some((scene) => {
				return (
					deltaPosition.x >= scene.start.x && deltaPosition.x <= scene.end.x
				);
			})
		) {
			return true;
		}

		return false;
	};

	const getSticksEndPosition = () => {
		// get the next scene after the marker
		const possibleScenes = scenes.filter((scene) => {
			return scene.start.x > deltaPosition.x;
		});

		if (possibleScenes.length > 0) {
			return (
				possibleScenes.sort((a, b) => a.start.x - b.start.x)[0].start.x - 10
			);
		} else {
			return videoLength * 10;
		}
	};

	const createScene = () => {
		// extra verification (just in case)
		if (isMarkerInScene()) {
			alert('Já existe uma cena aqui!');
			return;
		}

		// get the stick's end position
		const endPosition = getSticksEndPosition();
		console.log('end position: ', endPosition);
		// create two objects to hold stick's position
		const scene = {
			start: { x: deltaPosition.x, y: 0 },
			end: { x: endPosition, y: 0 },
			img: getPresenterScreenShot(),
		};

		dispatchScene({ sceneIdx: -1, scene });
		setDisableVideoButton(() => true);

		// const img = getPresenterScreenShot();
		// setBackgroundImg(img);
	};

	const createChapter = () => {
		//  extra verification (just in case)
		if (!isMarkerInScene()) {
			alert('É necessário criar o capítulo em uma cena');
			return;
		}

		setChapters((prevState) => {
			let tmpMarkInChapter = [...prevState];

			tmpMarkInChapter.push({
				position: deltaPosition.x,
				id: Date.now(),
				img: getPresentationScreenShot(),
			});
			tmpMarkInChapter.sort((a, b) => a.position - b.position);

			return [...tmpMarkInChapter];
		});
	};

	const renderChapter = useMemo(
		() =>
			chapters.map((chapter, idx) => {
				const endSceneX = Math.max.apply(
					Math,
					scenes.map(function (scene) {
						return scene.end.x;
					})
				);

				const startTag = (
					<div
						className={cx(
							styles['chapter-tag'],
							selectedChapters.includes(chapter.id)
								? styles['chapter-tag--blue']
								: styles['chapter-tag--gray']
						)}
						style={{ marginLeft: chapter.position }}
					></div>
				);

				const chapterContent = (
					<div
						className={styles['scene-content']}
						style={{
							marginLeft: chapter.position + 4 + 'px', // 4 is the scene-limiter width
							width: chapters[idx + 1]
								? chapters[idx + 1].position - chapter.position + 'px'
								: endSceneX - chapter.position + 'px',
							backgroundImage: `url(${chapter.img})`,
							backgroundSize: 'auto 100%',
						}}
					>
						{/* Capítulo {idx + 1} */}
					</div>
				);

				const layer = (
					<div
						className={styles['scene-content']}
						style={{
							marginLeft: chapter.position + 4 + 'px',
							backgroundColor: selectedChapters.includes(chapter.id)
								? 'rgba(63, 136, 191, 0.75)'
								: 'rgba(0, 0, 0, 0)',
							position: 'absolute',
							height: '100%',
							width: chapters[idx + 1]
								? chapters[idx + 1].position - chapter.position + 'px'
								: endSceneX - chapter.position + 'px',
							backgroundSize: 'auto 100%',
						}}
						onClick={() => {
							setSelectedChapters((prevState) => {
								const tmpSelectedChapters = [...prevState];
								if (tmpSelectedChapters.indexOf(chapter.id) !== -1) {
									tmpSelectedChapters.splice(
										tmpSelectedChapters.indexOf(chapter.id),
										1
									);
								} else {
									tmpSelectedChapters.push(chapter.id);
								}
								return [...tmpSelectedChapters];
							});
						}}
					></div>
				);

				return (
					<>
						{startTag}
						{chapterContent}
						{layer}
					</>
				);
			}),
		[chapters, scenes, selectedChapters]
	);

	const renderScene = useMemo(
		() =>
			scenes.map((scene, idx) => {
				console.log('asdkakda');
				const sceneStartBar = (
					<Draggable
						axis="x"
						handle=".handle"
						bounds=".timeline__video-invisible"
						grid={[10, 0]}
						position={scenes[idx].start}
						onDrag={(e, ui) => {
							// ve qual pauzinho tu tá usando
							const scene = {
								start: { x: ui.x, y: 0 },
								end: scenes[idx].end,
							};
							dispatchScene({ sceneIdx: idx, scene, isStart: true });
						}}
					>
						<div
							className={cx(
								'handle',
								styles['scene-limiter'],
								styles['scene-limiter---start']
							)}
						></div>
					</Draggable>
				);

				const sceneEndBar = (
					<Draggable
						axis="x"
						handle=".handle"
						bounds=".timeline__video-invisible"
						grid={[10, 0]}
						position={scenes[idx].end}
						onDrag={(e, ui) => {
							// ve qual pauzinho tu tá usando
							const scene = {
								start: scenes[idx].start,
								end: { x: ui.x, y: 0 },
							};
							dispatchScene({ sceneIdx: idx, scene, isStart: false });
						}}
					>
						<div
							className={cx(
								'handle',
								styles['scene-limiter'],
								styles['scene-limiter---end']
							)}
						></div>
					</Draggable>
				);

				const centerDiv = (
					<div
						className={styles['scene-content']}
						style={{
							marginLeft: scenes[idx].start.x + 4 + 'px', // 7 is the scene-limiter width
							width:
								scenes[idx].end.x -
								scenes[idx].start.x +
								// + 20 bcos of the second scene's default position
								'px',

							backgroundImage: `url(${scene.img})`,
							backgroundSize: 'auto 100%',
						}}
						onClick={() => {
							setSelectedScenes((prevState) => {
								const tmpSelectedScenes = [...prevState];
								if (tmpSelectedScenes.indexOf(idx) !== -1) {
									tmpSelectedScenes.splice(tmpSelectedScenes.indexOf(idx), 1);
								} else {
									tmpSelectedScenes.push(idx);
								}
								return [...tmpSelectedScenes];
							});
						}}
					></div>
				);

				const layer = (
					<div
						className={styles['scene-content']}
						style={{
							marginLeft: scenes[idx].start.x + 4 + 'px',
							backgroundColor: selectedScenes.includes(idx)
								? 'rgba(63, 136, 191, 0.75)'
								: 'rgba(84, 80, 79, 0.75)',
							position: 'absolute',
							height: '100%',
							width:
								scenes[idx].end.x -
								scenes[idx].start.x +
								// + 20 bcos of the second scene's default position
								'px',
							backgroundSize: 'auto 100%',
						}}
						onClick={() => {
							setSelectedScenes((prevState) => {
								const tmpSelectedScenes = [...prevState];
								if (tmpSelectedScenes.indexOf(idx) !== -1) {
									tmpSelectedScenes.splice(tmpSelectedScenes.indexOf(idx), 1);
								} else {
									tmpSelectedScenes.push(idx);
								}
								return [...tmpSelectedScenes];
							});
						}}
					>
						Cena {idx + 1}
					</div>
				);

				return (
					<>
						{sceneStartBar}
						{centerDiv}
						{layer}
						{sceneEndBar}
					</>
				);
			}),
		[scenes, dispatchScene, selectedScenes]
	);

	console.log(timerDivWidth);

	return (
		<div className={styles['timeline__wrapper']}>
			<div className={styles['buttonsWrapper']}>
				<div className={styles['blackbox']} />

				<div className={styles['btnContainer']} ref={videoBoxRef}>
					<div className={styles['btnContainer__left']}>
						<GiFilmStrip className={styles['btnContainer__icon']} />
						<span className={styles['btnContainer__text']}>Vídeo</span>
					</div>

					<div className={styles['btnContainer__right']}>
						<FaPlusSquare
							className={
								disableVideoButton
									? cx(styles['btnContainer__button-disabled'])
									: cx(styles['btnContainer__button'])
							}
							onClick={disableVideoButton ? null : createScene}
						/>
						<FaMinusSquare
							className={
								isSelectedScenesEmpty
									? styles['btnContainer__button-disabled']
									: styles['btnContainer__button']
							}
							onClick={isSelectedScenesEmpty ? null : deleteScene}
						/>
					</div>
				</div>

				<div className={styles['btnContainer']} style={{}}>
					<div className={styles['btnContainer__left']}>
						<GiStack className={styles['btnContainer__icon']} />
						<span className={styles['btnContainer__text--smallMargin']}>
							Capítulos
						</span>
					</div>

					<div className={styles['btnContainer__right']}>
						<FaPlusSquare
							className={
								disableChapterButton
									? styles['btnContainer__button-disabled']
									: styles['btnContainer__button']
							}
							onClick={disableChapterButton ? null : createChapter}
						/>
						<FaMinusSquare
							className={
								isSelectedChaptersEmpty
									? styles['btnContainer__button-disabled']
									: styles['btnContainer__button']
							}
							onClick={isSelectedChaptersEmpty ? null : deleteChapter}
						/>
					</div>
				</div>
			</div>

			<div className={styles['timeline']} ref={videoTimelineRef}>
				<div
					style={{
						width: timerDivWidth + FINAL_SPACE + 'px',
					}}
					className={styles['timeline__video-invisible']}
				>
					<TimeIndicator
						timelineIndicatorRef={timelineIndicatorRef}
						videoLength={videoLength}
					/>

					<div
						className={cx(
							styles['timeline__video'],
							styles['timeline__content']
						)}
					>
						{renderScene}
					</div>

					<div
						className={cx(styles['timeline__content'])}
						ref={chapterTimelineRef}
					>
						{renderChapter}
					</div>
				</div>

				<Draggable
					axis="x"
					handle=".handle"
					onDrag={handleDrag}
					position={{ x: deltaPosition.x * timerDivWidth, y: 0 }}
					bounds=".timeline__video-invisible"
					grid={[10, 0]}
				>
					<div className={cx('handle', styles['stick'])}></div>
				</Draggable>
			</div>
		</div>
	);
};

export default Timeline;
