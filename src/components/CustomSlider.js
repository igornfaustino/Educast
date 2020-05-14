import React, { useEffect, useRef, useState } from 'react';
import Carousel from 'react-multi-carousel';
import { makeStyles } from '@material-ui/core/styles';
import CustomCard from './CustomCard';
import 'react-multi-carousel/lib/styles.css';
import IconButton from '@material-ui/core/IconButton';
import './CustomSlider.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// unselectable component when dragging and undraggable carousel when editing text
// another bug: place scrollbar at origin and disable it when all cards fits

// NO: window resizing sometimes fucks up probably because of the way scroll bar updates its values ... can probably make it work
// NO: another bug after deleting: scrollbar moves because its updating its max value... omfg it worked l0L
// NO: make scroll bar bigger when deleting. make spacing between cards bigger when deleting
const useStyles = makeStyles({
	leftArrow: {
		position: 'relative',
		color: '#0099ff',
		fontSize: '4rem',
		'&:hover': {
			background: 'rgba(0, 0, 0, 0)',
		},
		'&:focus': {
			outline: 'none',
		},
	},
	rightArrow: {
		position: 'relative',
		color: '#0099ff',
		fontSize: '4rem',
		'&:hover': {
			background: 'rgba(0, 0, 0, 0)',
		},
		'&:focus': {
			outline: 'none',
		},
	},
});

const CustomSlider = ({
	chapters,
	deleteChapterFunction,
	updateTitleFunction,
	selectThumbnailFunction,
	getPresenterScreenShot,
	getPresentationScreenShot,
}) => {
	const carouselRef = useRef(null);
	const scrollbarRef = useRef(null);
	const [totItems, setTotItems] = useState(chapters.length);

	const classes = useStyles();

	const resizeWindow = () => {
		if (carouselRef.current) {
			const { transform, totalItems, slidesToShow } = carouselRef.current.state;
			const maxTranslateX = getMaxTranslateX();
			let value = maxTranslateX / 100; // calculate the unit of transform for the slider
			carouselRef.current.isAnimationAllowed = false;
			const max = getMaxScrollbarValue(value);
			const maxAllowedTransform = max * value;
			console.log(maxAllowedTransform);
			console.log(transform);
			console.log('break');
			if (Math.abs(transform) > maxAllowedTransform) {
				// console.log("error")
				carouselRef.current.setState({
					transform: -maxAllowedTransform,
					currentSlide:
						totalItems - slidesToShow < 0 ? 0 : totalItems - slidesToShow,
				});
			}
		}
	};

	useEffect(() => {
		resizeWindow();
		window.addEventListener('resize', resizeWindow);
		return () => window.removeEventListener('resize', resizeWindow);
	}, []);

	const modifiedDeleteChapterFunction = async (id) => {
		const deleted = await deleteChapterFunction(id);
		if (deleted === true) {
			setTotItems(totItems - 1);
			// const maxTranslateX = getMaxTranslateX();
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
				// disable scrollbar here, and make it full width
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
			scrollbarRef.current.value = Math.round(Math.abs(transform) / value); //omfg it worked
			// scrollbarRef.current.value = scrollbarRef.current.max;
			// scrollbarRef.current.value=0//this is key for getting exact value
			// console.log(scrollbarRef.current)
		}
	};

	const cardsToShow = () => {
		return chapters.map((chapter) => (
			<CustomCard
				key={chapter.id}
				chapter={chapter}
				deleteChapterFunction={() => modifiedDeleteChapterFunction(chapter.id)}
				updateTitleFunction={updateTitleFunction}
				selectThumbnailFunction={selectThumbnailFunction}
				getPresenterScreenShot={getPresenterScreenShot}
				getPresentationScreenShot={getPresentationScreenShot}
			></CustomCard>
		));
	};

	const getMaxTranslateX = () => {
		if (carouselRef.current) {
			const { itemWidth, totalItems, slidesToShow } = carouselRef.current.state;
			if (totalItems === slidesToShow) {
				return itemWidth;
			}
			return Math.round(itemWidth * (totalItems - slidesToShow));
		}
	};

	const getMaxScrollbarValue = (value) => {
		const { itemWidth, totalItems, slidesToShow } = carouselRef.current.state;
		return (itemWidth * (totalItems - slidesToShow)) / value;
	};

	// how many times you can click on the right arrow until END is reached
	const getMaxSlidesAvailable = () => {
		let maxSlides = 0;
		if (carouselRef.current) {
			const { slidesToShow, totalItems } = carouselRef.current.state;
			maxSlides = totalItems - slidesToShow;
		}
		return maxSlides;
	};

	//fix currentSlide, fix transform when resizing window
	// atualizar itemWidth na API quando deletar cards
	const CustomRightArrow = () => {
		let value = 0;
		if (carouselRef.current) {
			const maxTranslateX = getMaxTranslateX();
			value = maxTranslateX / 100; // calculate the unit of transform for the slider
		}
		const handleOnClick = () => {
			carouselRef.current.isAnimationAllowed = true;
			const {
				slidesToShow,
				totalItems,
				itemWidth,
				currentSlide,
			} = carouselRef.current.state;
			const max = getMaxScrollbarValue(value);
			let nextTransform;
			let nextSlide;
			const maxSlides = totalItems - slidesToShow;
			const maxTransform = max * value;
			console.log('rightValue:', maxTransform);
			if (slidesToShow >= totalItems) {
				//all cards fit in the screen
				nextTransform = 0; //should try changing this to 0 instOf maxTransform
				nextSlide = 0;
			} else {
				nextSlide =
					currentSlide + 1 > maxSlides ? currentSlide : currentSlide + 1;
				if (nextSlide === currentSlide) {
					// last slide reached
					nextTransform = maxTransform;
				} else {
					// can go up 1 slide (not the last)
					nextTransform = nextSlide * itemWidth;
					if (nextSlide >= maxSlides) {
						nextTransform = maxTransform;
					}
				}
			}
			carouselRef.current.setState({
				transform: -nextTransform,
				currentSlide: nextSlide,
			});
		};
		return (
			<IconButton
				variant="outlined"
				className={classes.rightArrow}
				onClick={() => handleOnClick()}
			>
				<FaChevronRight className="right-arrow-icon" />
			</IconButton>
		);
	};

	const CustomLeftArrow = () => {
		const handleOnClick = () => {
			carouselRef.current.isAnimationAllowed = true;
			const {
				slidesToShow,
				totalItems,
				itemWidth,
				currentSlide,
			} = carouselRef.current.state;
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
		};
		return (
			<IconButton className={classes.leftArrow} onClick={() => handleOnClick()}>
				<FaChevronLeft />
			</IconButton>
		);
	};

	const ChapterScrollbar = () => {
		carouselRef.current.isAnimationAllowed = true;
		let value = 0.0;
		if (carouselRef) {
			const maxTranslateX = getMaxTranslateX();
			value = maxTranslateX / 100;
		}
		// console.log(carouselRef.current.state);
		const { transform, itemWidth } = carouselRef.current.state;
		return (
			<div className="custom-slider">
				<input
					type="range"
					ref={scrollbarRef}
					// style={scrollbarStyle}
					value={Math.round(Math.abs(transform) / value)} //this is key for getting exact value
					max={getMaxScrollbarValue(value)}
					onChange={(e) => {
						if (carouselRef.current.isAnimationAllowed) {
							carouselRef.current.isAnimationAllowed = false;
						}
						const nextTransform = e.target.value * value;
						const nextSlide = Math.round(nextTransform / itemWidth);
						if (e.target.value === 0) {
							carouselRef.current.isAnimationAllowed = true;
						}
						console.log(nextTransform, ' aaa', nextSlide);
						carouselRef.current.setState({
							transform: -nextTransform, // padding 20px and 5 items.
							currentSlide: nextSlide,
						});
					}}
					className="custom-slider__input"
				/>
			</div>
		);
	};

	const responsive = {
		desktop: {
			breakpoint: {
				max: 3000,
				min: 1810,
			},
			items: 6,
			// partialVisibilityGutter: 40,
		},
		mobile: {
			breakpoint: {
				max: 1360,
				min: 0,
			},
			items: 3,
			// partialVisibilityGutter: 30,
		},
		tablet: {
			breakpoint: {
				max: 1810,
				min: 1360,
			},
			items: 4,
			// partialVisibilityGutter: 30,
		},
	};

	return (
		<div className="root-slider">
			<CustomLeftArrow className="left-arrow-spacing" />
			<Carousel
				className="custom-carousel"
				additionalTransform={0}
				ssr={false}
				ref={carouselRef}
				arrows={false}
				keyBoardControl={false}
				partialVisbile={false}
				customButtonGroup={<ChapterScrollbar />}
				infinite={false}
				itemClass="slider-image-item"
				containerClass="carousel-container-with-scrollbar"
				draggable={true}
				responsive={responsive}
			>
				{cardsToShow()}
			</Carousel>
			<CustomRightArrow className="right-arrow-spacing" />
		</div>
	);
};

export default CustomSlider;
