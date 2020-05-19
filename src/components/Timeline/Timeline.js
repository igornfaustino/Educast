import React, {
	useState,
	useEffect,
	useMemo,
	useCallback,
	forwardRef,
} from 'react';

import { useDispatch } from 'react-redux';
import { GiFilmStrip, GiStack } from 'react-icons/gi';
import { FaPlusSquare, FaMinusSquare } from 'react-icons/fa';
import Draggable from 'react-draggable';

import TimeIndicator from './TimeIndicator';
import { getPositionInPercent, getPositionInPx } from '../../utils/conversions';
import { FINAL_SPACE, X_SNAP_TO } from '../../utils/constants';
import { useWindowSize } from '../../hooks/useWindowSize';

import cx from 'classnames';
import styles from './Timeline.module.scss';
import { useSceneChapters } from '../../hooks/useSceneChapters';
import Scene from './Scene';
import { useCursor } from '../../hooks/useCursor';

const Timeline = (
	{
		zoomLevel,
		timerDivWidth,
		getPresenterScreenShot,
		getPresentationScreenShot,
		videoLength,
		calculatedMargin,
		handleTimelineClick,
	},
	videoTimelineRef
) => {
	const dispatch = useDispatch();

	const windowsSize = useWindowSize();
	const { scenes, setChapters, dispatchScene, chapters } = useSceneChapters(
		timerDivWidth
	);

	const {
		cursorPosition,
		isCursorInScene,
		handleDrag,
		handleDragCursorEnd,
	} = useCursor(scenes, timerDivWidth, handleTimelineClick);

	const [selectedScenes, setSelectedScenes] = useState([]);
	const [selectedChapters, setSelectedChapters] = useState([]);
	const [disableVideoButton, setDisableVideoButton] = useState(false);
	const [disableChapterButton, setDisableChapterButton] = useState(false);
	const [isSelectedScenesEmpty, setIsSelectedScenesEmpty] = useState(true);
	const [isSelectedChaptersEmpty, setIsSelectedChaptersEmpty] = useState(true);

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

	const handleSceneSelect = useCallback((idx) => {
		setSelectedScenes((prevState) => {
			const tmpSelectedScenes = [...prevState];
			if (tmpSelectedScenes.indexOf(idx) !== -1) {
				tmpSelectedScenes.splice(tmpSelectedScenes.indexOf(idx), 1);
			} else {
				tmpSelectedScenes.push(idx);
			}
			return [...tmpSelectedScenes];
		});
	}, []);

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
			scenes.map((scene, idx) => (
				<Scene
					scene={scene}
					idx={idx}
					timerDivWidth={timerDivWidth}
					isSelected={selectedScenes.includes(idx)}
					dispatchScene={dispatchScene}
					handleSceneSelect={handleSceneSelect}
				/>
			)),
		[scenes, timerDivWidth, selectedScenes, dispatchScene, handleSceneSelect]
	);

	useEffect(() => {
		const wrapperWidth = videoTimelineRef.current.offsetWidth;
		dispatch({ type: 'SET_VISIBLE_AREA', visibleArea: wrapperWidth });
	}, [dispatch, videoTimelineRef, windowsSize]);

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
			setDisableVideoButton(true);
			setDisableChapterButton(false);
		} else {
			setDisableVideoButton(false);
			setDisableChapterButton(true);
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
						width: timerDivWidth + FINAL_SPACE,
						height: '100%',
					}}
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
						<div
							className="timeline__video-invisible"
							style={{
								width: timerDivWidth,
							}}
						>
							{renderScene}
						</div>
					</div>

					<div className={cx(styles['timeline__content'])}>{renderChapter}</div>
				</div>

				<Draggable
					axis="x"
					handle=".handle"
					onDrag={handleDrag}
					onStop={handleDragCursorEnd}
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
