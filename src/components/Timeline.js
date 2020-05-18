import React, {
	useState,
	useEffect,
	useMemo,
	useCallback,
	forwardRef,
} from 'react';

import { useSelector } from 'react-redux';
import { GiFilmStrip, GiStack } from 'react-icons/gi';
import { FaPlusSquare, FaMinusSquare } from 'react-icons/fa';
import Draggable from 'react-draggable';
import TimeIndicator from './TimeIndicator';
import { getPositionInPercent, getPositionInPx } from '../utils/conversions';

import cx from 'classnames';
import styles from './Timeline.module.scss';

const FINAL_SPACE = 34;
const X_SNAP_TO = 1;

const Timeline = (
	{
		zoomLevel,
		timerDivWidth,
		scenes,
		dispatchScene,
		chapters,
		setChapters,
		getPresenterScreenShot,
		getPresentationScreenShot,
		videoLength,
		calculatedMargin,
	},
	videoTimelineRef
) => {
	const currentTime = useSelector((state) => state.video.currentTime);
	const duration = useSelector((state) => state.video.duration);

	const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
	const [selectedScenes, setSelectedScenes] = useState([]);
	const [selectedChapters, setSelectedChapters] = useState([]);
	const [disableVideoButton, setDisableVideoButton] = useState(false);
	const [disableChapterButton, setDisableChapterButton] = useState(false);
	const [isSelectedScenesEmpty, setIsSelectedScenesEmpty] = useState(true);
	const [isSelectedChaptersEmpty, setIsSelectedChaptersEmpty] = useState(true);
	const [lastSceneWithCursor, setLastSceneWithCursor] = useState(undefined);
	const [lastGapWithCursor, setLastGapWithCursor] = useState(undefined);

	useEffect(() => {
		console.log('timerdivwidth ', timerDivWidth);
	}, [timerDivWidth]);

	const getPlayingScene = useCallback(
		(cursorPosition) =>
			scenes.find((scene) => {
				return cursorPosition >= scene.start.x && cursorPosition <= scene.end.x;
			}),
		[scenes]
	);

	const getPlayingDrag = useCallback(
		(cursorPosition) => {
			let gap = undefined;
			scenes.some((scene, idx) => {
				const isFirstScene = idx === 0;
				const isLastScene = idx === scenes.length - 1;

				const cursorAfterLastScene =
					cursorPosition > scenes[scenes.length - 1].end.x;

				const cursorBeforeFirstScene = cursorPosition < scenes[0].start.x;

				const cursorBetweenScenes =
					!isLastScene &&
					cursorPosition > scene.end.x &&
					cursorPosition < scenes[idx + 1].start.x;

				if (isFirstScene && cursorBeforeFirstScene) {
					gap = { start: {}, end: {} };
					gap.start.x = 0;
					gap.end.x = scenes[0].start.x;
					return true;
				}
				if (isLastScene && cursorAfterLastScene) {
					gap = { start: {}, end: {} };
					gap.start.x = scene.end.x;
					gap.end.x = 1;
					return true;
				}
				if (cursorBetweenScenes) {
					gap = { start: {}, end: {} };
					gap.start.x = scene.end.x;
					gap.end.x = scenes[idx + 1].start.x;
					return true;
				}
				return false;
			});
			return gap;
		},
		[scenes]
	);

	const isCursorInsideThis = useCallback((value, cursorPosition) => {
		if (!value) return false;
		if (value.start.x <= cursorPosition && cursorPosition <= value.end.x)
			return true;
		return false;
	}, []);

	const verifyCursorAndSetSceneOrGapInfo = useCallback(
		(cursorPosition) => {
			const playingScene = getPlayingScene(cursorPosition);
			if (playingScene) {
				setLastSceneWithCursor(playingScene);
				setLastGapWithCursor(undefined);
				return true;
			}
			const playingGap = getPlayingDrag(cursorPosition);
			if (playingGap) {
				setLastGapWithCursor(playingGap);
				setLastSceneWithCursor(undefined);
				return false;
			}
		},
		[getPlayingDrag, getPlayingScene]
	);

	const isCursorInsideSomeScene = useCallback(
		(cursorPosition) => {
			if (
				lastSceneWithCursor &&
				isCursorInsideThis(lastSceneWithCursor, cursorPosition)
			)
				return true;
			if (
				lastGapWithCursor &&
				isCursorInsideThis(lastGapWithCursor, cursorPosition)
			) {
				return false;
			}
			return verifyCursorAndSetSceneOrGapInfo(cursorPosition);
		},
		[
			isCursorInsideThis,
			lastGapWithCursor,
			lastSceneWithCursor,
			verifyCursorAndSetSceneOrGapInfo,
		]
	);

	const isCursorInScene = useCallback(() => {
		if (!scenes.length) return false;
		if (scenes.length === 1)
			return isCursorInsideThis(scenes[0], cursorPosition.x);
		return isCursorInsideSomeScene(cursorPosition.x);
	}, [cursorPosition.x, isCursorInsideSomeScene, isCursorInsideThis, scenes]);

	useEffect(() => {
		const timeInPercent = getPositionInPercent(currentTime, duration);
		setCursorPosition({ x: timeInPercent });
	}, [currentTime, duration]);

	const handleDrag = (e, ui) => {
		const { x: lastPosition } = cursorPosition;
		const deltaXInPercent = getPositionInPercent(ui.deltaX, timerDivWidth);
		// const deltaXInTime = deltaXInPercent * videoLength;
		// const newTime = (lastPosition + deltaXInPercent) * videoLength;
		// handleTimelineClick(newTime);
		// console.log({ newTime });
		setCursorPosition({
			x: lastPosition + deltaXInPercent,
		});
	};

	const deleteScene = useCallback(() => {
		setSelectedScenes([]);

		// remove the selected chapter from the array
		const deletedScenes = scenes.filter((val, idx) => {
			return selectedScenes.includes(idx);
		});
		deletedScenes.forEach((scene) => {
			// chapters that are in a scene
			const chaptersToDelete = chapters.filter((chap) => {
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
		dispatchScene({ type: 'delete', scenesIdx: selectedScenes });
	}, [chapters, dispatchScene, scenes, selectedScenes]);

	const deleteChapter = useCallback(() => {
		// dispatchChapter({ type: "delete", deleteIdx: selectedChapters });
		setChapters((prevState) => {
			const tmp = prevState.filter((val) => {
				return !selectedChapters.includes(val.id);
			});

			return [...tmp];
		});
		setSelectedChapters([]);
	}, [selectedChapters, setChapters]);

	const getSticksEndPosition = useCallback(() => {
		// get the next scene after the marker
		const possibleScenes = scenes.filter((scene) => {
			return scene.start.x > cursorPosition.x;
		});

		if (possibleScenes.length > 0) {
			return (
				possibleScenes.sort((a, b) => a.start.x - b.start.x)[0].start.x -
				getPositionInPercent(10, timerDivWidth)
			);
		} else {
			return getPositionInPercent(timerDivWidth, timerDivWidth);
		}
	}, [cursorPosition.x, scenes, timerDivWidth]);

	const createScene = useCallback(() => {
		// extra verification (just in case)
		if (isCursorInScene()) {
			alert('Já existe uma cena aqui!');
			return;
		}

		// get the stick's end position
		const endPosition = getSticksEndPosition();
		// create two objects to hold stick's position
		const scene = {
			start: { x: cursorPosition.x, y: 0 },
			end: { x: endPosition, y: 0 },
			img: getPresenterScreenShot(),
		};

		dispatchScene({ type: 'create', scene });
		setDisableVideoButton(() => true);

		// const img = getPresenterScreenShot();
		// setBackgroundImg(img);
	}, [
		cursorPosition.x,
		dispatchScene,
		getPresenterScreenShot,
		getSticksEndPosition,
		isCursorInScene,
	]);

	const createChapter = useCallback(() => {
		//  extra verification (just in case)
		if (!isCursorInScene()) {
			alert('É necessário criar o capítulo em uma cena');
			return;
		}

		setChapters((prevState) => {
			let tmpMarkInChapter = [...prevState];

			tmpMarkInChapter.push({
				position: cursorPosition.x,
				id: Date.now(),
				img: getPresentationScreenShot(),
			});
			tmpMarkInChapter.sort((a, b) => a.position - b.position);

			return [...tmpMarkInChapter];
		});
	}, [
		cursorPosition.x,
		getPresentationScreenShot,
		isCursorInScene,
		setChapters,
	]);

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
						style={{
							marginLeft:
								getPositionInPx(chapter.position, timerDivWidth) + 1.5,
						}}
					></div>
				);

				const chapterContent = (
					<div
						className={styles['scene-content']}
						style={{
							marginLeft:
								getPositionInPx(chapter.position, timerDivWidth) + 4 + 'px', // 4 is the scene-limiter width
							width: chapters[idx + 1]
								? getPositionInPx(
										chapters[idx + 1].position - chapter.position,
										timerDivWidth
								  ) + 'px'
								: getPositionInPx(endSceneX - chapter.position, timerDivWidth) +
								  'px',
							backgroundImage: `url(${chapter.img})`,
							backgroundSize: 'auto 100%',
							borderLeft: `2px solid #3f8ae0`,
						}}
					>
						{/* Capítulo {idx + 1} */}
					</div>
				);

				const layer = (
					<div
						className={styles['scene-content']}
						style={{
							marginLeft:
								getPositionInPx(chapter.position, timerDivWidth) + 4 + 'px',
							backgroundColor: selectedChapters.includes(chapter.id)
								? 'rgba(63, 136, 191, 0.75)'
								: 'rgba(0, 0, 0, 0)',
							position: 'absolute',
							height: '100%',
							width: chapters[idx + 1]
								? getPositionInPx(
										chapters[idx + 1].position - chapter.position,
										timerDivWidth
								  ) + 'px'
								: getPositionInPx(endSceneX - chapter.position, timerDivWidth) +
								  'px',
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
		[chapters, scenes, selectedChapters, timerDivWidth]
	);

	const renderScene = useMemo(
		() =>
			scenes.map((scene, idx) => {
				const sceneStartBar = (
					<Draggable
						axis="x"
						handle=".handle"
						bounds=".timeline__video-invisible"
						grid={[X_SNAP_TO, 0]}
						position={{
							x: getPositionInPx(scene.start.x, timerDivWidth),
							y: 0,
						}}
						onStart={() =>
							dispatchScene({ scene: scene, type: 'on_drag_start' })
						}
						onDrag={(e, ui) => {
							const tmpScene = {
								start: { x: getPositionInPercent(ui.x, timerDivWidth), y: 0 },
								end: scene.end,
							};
							dispatchScene({
								sceneIdx: idx,
								scene: tmpScene,
								type: 'drag_left',
							});
						}}
						onStop={() => dispatchScene({ type: 'on_drag_end' })}
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
						grid={[X_SNAP_TO, 0]}
						position={{ x: getPositionInPx(scene.end.x, timerDivWidth), y: 0 }}
						onStart={() =>
							dispatchScene({ scene: scene, type: 'on_drag_start' })
						}
						onDrag={(e, ui) => {
							// ve qual pauzinho tu tá usando
							const updatedScene = {
								start: scene.start,
								end: { x: getPositionInPercent(ui.x, timerDivWidth), y: 0 },
							};
							dispatchScene({
								sceneIdx: idx,
								scene: updatedScene,
								type: 'drag_right',
							});
						}}
						onStop={() => dispatchScene({ type: 'on_drag_end' })}
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
							marginLeft:
								getPositionInPx(scene.start.x, timerDivWidth) + 4 + 'px', // 7 is the scene-limiter width
							width:
								getPositionInPx(scene.end.x - scene.start.x, timerDivWidth) +
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
							marginLeft:
								getPositionInPx(scene.start.x, timerDivWidth) + 4 + 'px',
							backgroundColor: selectedScenes.includes(idx)
								? 'rgba(63, 136, 191, 0.75)'
								: 'rgba(84, 80, 79, 0.75)',
							position: 'absolute',
							height: '100%',
							width:
								getPositionInPx(scene.end.x - scene.start.x, timerDivWidth) +
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
		[scenes, timerDivWidth, selectedScenes, dispatchScene]
	);

	useEffect(() => {
		setLastGapWithCursor(undefined);
		setLastSceneWithCursor(undefined);
	}, [scenes]);

	useEffect(() => {
		setSelectedChapters((selectedChapters) => {
			const updatedSelectedChapters = selectedChapters.filter((selected) => {
				return chapters.some((chapter) => chapter.id === selected);
			});
			return updatedSelectedChapters;
		});
	}, [chapters]);

	useEffect(() => {
		setIsSelectedScenesEmpty(selectedScenes.length > 0 ? false : true);
	}, [selectedScenes]);

	useEffect(() => {
		setIsSelectedChaptersEmpty(() => {
			return selectedChapters.length > 0 ? false : true;
		});
	}, [selectedChapters]);

	useEffect(() => {
		if (isCursorInScene()) {
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
	}, [cursorPosition, isCursorInScene, scenes]);

	return (
		<div className={styles['timeline__wrapper']}>
			<div className={styles['buttonsWrapper']}>
				<div className={styles['blackbox']} />

				<div className={styles['btnContainer']}>
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
						<span className={styles['btnContainer__text']}>Capítulos</span>
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
						videoLength={videoLength}
						zoomLevel={zoomLevel}
						calculatedMargin={calculatedMargin}
						scrollLeft={
							videoTimelineRef.current && videoTimelineRef.current.scrollLeft
						}
						visibleWidth={
							videoTimelineRef.current && videoTimelineRef.current.offsetWidth
						}
					/>

					<div
						className={cx(
							styles['timeline__video'],
							styles['timeline__content']
						)}
					>
						{renderScene}
					</div>

					<div className={cx(styles['timeline__content'])}>{renderChapter}</div>
				</div>

				<Draggable
					axis="x"
					handle=".handle"
					onDrag={handleDrag}
					position={{ x: cursorPosition.x * timerDivWidth, y: 0 }}
					bounds=".timeline__video-invisible"
					grid={[X_SNAP_TO, 0]}
				>
					<div className={cx('handle', styles['stick'])}></div>
				</Draggable>
			</div>
		</div>
	);
};

export default forwardRef(Timeline);
