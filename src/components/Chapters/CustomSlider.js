import React, {
	useEffect,
	useRef,
	useState,
	useCallback,
	useMemo,
} from 'react';
import { useSelector } from 'react-redux';

import 'react-multi-carousel/lib/styles.css';
import Carousel from 'react-multi-carousel';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import styles from './CustomSlider.module.scss';
import CustomCard from './CustomCard';
import { CustomRightArrow, CustomLeftArrow } from './SliderArrows';
import { responsive } from '../../utils/responsiveSlider';

const CustomSlider = ({
	deleteChapterFunction,
	updateTitleFunction,
	selectThumbnailFunction,
	getPresenterScreenShot,
	getPresentationScreenShot,
	selectChapter,
}) => {
	const carouselRef = useRef(null);
	const scrollbarRef = useRef(null);
	const [carouselDraggable, setCarouselDraggable] = useState(true);
	const [windowSize, setWindowSize] = useState([0, 0]);
	const [scrollBarValue, setScrollBarValue] = useState(0);
	const [disableScrollBar, setDisableScrollBar] = useState(false);
	const styling = makeStyles({
		scrollBar: {
			'&::-webkit-slider-thumb': {
				width: scrollBarValue + '%',
			},
		},
	});
	const classes = styling();
	const chs = useSelector((state) => state.sceneChapters.chapters);

	// Prevents carousel overflow caused by sliding by forcing maximum valid value.
	const resizeWindow = useCallback(() => {
		setWindowSize([window.innerWidth, window.innerHeight]);
		if (carouselRef.current.state) {
			const { transform, totalItems, slidesToShow } = carouselRef.current.state;
			if (totalItems <= slidesToShow) {
				carouselRef.current.setState({
					transform: 0,
					currentSlide: 0,
				});
			} else {
				const maxTranslateX = getMaxTranslateX();
				let value = maxTranslateX / 100;
				carouselRef.current.isAnimationAllowed = false;
				const max = getMaxScrollbarValue(value);
				const maxAllowedTransform = max * value;
				if (Math.abs(transform) > maxAllowedTransform) {
					carouselRef.current.setState({
						transform: -maxAllowedTransform,
						currentSlide:
							totalItems - slidesToShow < 0 ? 0 : totalItems - slidesToShow,
					});
				}
			}
		}
	}, []);

	// Calculates scrollbar width in percentage.
	const getScrollBarWidth = useCallback((itemsThatFit, total) => {
		let size = 0;
		if (total > 0 && total > itemsThatFit) {
			setDisableScrollBar(false);
			size = (itemsThatFit / total) * 100;
			if (size > 90) {
				size = 90;
			} else if (size < 10) {
				size = 10;
			}
		} else {
			if (itemsThatFit !== 0) {
				setDisableScrollBar(true);
				size = 100;
			}
		}
		return size;
	}, []);

	useEffect(() => {
		resizeWindow();
		window.addEventListener('resize', resizeWindow);
		return () => window.removeEventListener('resize', resizeWindow);
	}, [resizeWindow]);

	// Maximum amount of cards that fits in screen size.
	const getMaxItems = useCallback(() => {
		const width = windowSize[0];
		for (var screenType in responsive) {
			if (
				width >= responsive[screenType].breakpoint.min &&
				width <= responsive[screenType].breakpoint.max
			) {
				return responsive[screenType].items;
			}
		}
	}, [windowSize]);

	useEffect(() => {
		// Sets scrollbar width.
		setScrollBarValue(getScrollBarWidth(getMaxItems(), chs.length));
	}, [chs.length, windowSize, getScrollBarWidth, getMaxItems]);

	// Deletes card and updates carousel state/scrollbar value.
	const modifiedDeleteChapterFunction = useCallback(
		async (id) => {
			const isDeleted = await deleteChapterFunction(id);
			if (!isDeleted || !scrollbarRef.current) return;
			const {
				slidesToShow,
				totalItems,
				itemWidth,
				currentSlide,
				transform,
			} = carouselRef.current.state;
			scrollbarRef.current.value = 0;
			let nextTransform;
			let nextSlide;
			if (slidesToShow >= totalItems) {
				nextTransform = 0;
				nextSlide = 0;
			} else {
				nextSlide = currentSlide - 1 <= 0 ? 0 : currentSlide - 1;
				nextTransform = nextSlide * itemWidth;
			}
			carouselRef.current.setState({
				transform: -nextTransform,
				currentSlide: nextSlide,
			});
			const maxTranslateX = getMaxTranslateX();
			const value = maxTranslateX / 100;
			scrollbarRef.current.value = Math.round(Math.abs(transform) / value);
		},
		[deleteChapterFunction]
	);

	// Helper for disabling draggable action on carousel if card description is being edited.
	const shouldDraggableBeDisabled = useCallback((yes) => {
		setCarouselDraggable(!yes);
	}, []);

	// Cards to be shown in carousel.
	const cardsToShow = useMemo(() => {
		let order = 0;
		return chs.map((chapter) => {
			order++;
			return (
				<CustomCard
					key={chapter.id}
					chapter={chapter}
					deleteChapterFunction={() =>
						modifiedDeleteChapterFunction(chapter.id)
					}
					order={order}
					updateTitleFunction={updateTitleFunction}
					selectThumbnailFunction={selectThumbnailFunction}
					getPresenterScreenShot={getPresenterScreenShot}
					getPresentationScreenShot={getPresentationScreenShot}
					disableDraggableCarousel={shouldDraggableBeDisabled}
					selectChapter={() => selectChapter(chapter.id)}
				></CustomCard>
			);
		});
	}, [
		chs,
		getPresentationScreenShot,
		getPresenterScreenShot,
		modifiedDeleteChapterFunction,
		selectChapter,
		selectThumbnailFunction,
		shouldDraggableBeDisabled,
		updateTitleFunction,
	]);

	// Helper for getting maximum scrollbar value.
	const getMaxTranslateX = () => {
		if (carouselRef.current) {
			const { itemWidth, totalItems, slidesToShow } = carouselRef.current.state;
			if (totalItems === slidesToShow) {
				return itemWidth;
			}
			return Math.round(itemWidth * (totalItems - slidesToShow));
		}
	};

	// Helper for getting maximum scrollbar value.
	const getMaxScrollbarValue = (value) => {
		const { itemWidth, totalItems, slidesToShow } = carouselRef.current.state;
		return (itemWidth * (totalItems - slidesToShow)) / value;
	};

	// Carousel's scrollbar.
	const ChapterScrollbar = () => {
		let value = 0.0;
		if (carouselRef) {
			const maxTranslateX = getMaxTranslateX();
			value = maxTranslateX / 100;
		}
		const { transform, itemWidth } = carouselRef.current.state;
		const scrollBarOnChange = (e) => {
			if (carouselRef.current.isAnimationAllowed) {
				carouselRef.current.isAnimationAllowed = false;
			}
			const nextTransform = e.target.value * value;
			const nextSlide = Math.round(nextTransform / itemWidth);
			carouselRef.current.setState({
				transform: -nextTransform,
				currentSlide: nextSlide,
			});
		};
		return (
			<div className={styles['custom-slider']}>
				<input
					type="range"
					ref={scrollbarRef}
					value={Math.round(Math.abs(transform) / value)}
					max={getMaxScrollbarValue(value)}
					onChange={scrollBarOnChange}
					disabled={disableScrollBar}
					className={classNames(
						styles[`custom-slider__input`],
						classes.scrollBar
					)}
				/>
			</div>
		);
	};

	const NoChapters = () => {
		return (
			<div className={styles['zero-chapters']}>Nenhum Capítulo Criado</div>
		);
	};

	return (
		<div className={styles['root-slider']}>
			<CustomLeftArrow carouselRef={carouselRef} />
			<Carousel
				className={styles['custom-carousel']}
				additionalTransform={0}
				ref={carouselRef}
				arrows={false}
				keyBoardControl={false}
				partialVisbile={false}
				customButtonGroup={
					chs.length === 0 ? <NoChapters /> : <ChapterScrollbar />
				}
				infinite={false}
				itemClass={styles['slider-image-item']}
				containerClass={styles['carousel-container-with-scrollBar']}
				draggable={carouselDraggable}
				responsive={responsive}
			>
				{cardsToShow}
			</Carousel>
			<CustomRightArrow carouselRef={carouselRef} />
		</div>
	);
};

export default CustomSlider;
