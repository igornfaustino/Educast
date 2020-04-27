import React, { useState } from 'react';
import Carousel from 'react-multi-carousel';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CustomCard from './CustomCard';
import 'react-multi-carousel/lib/styles.css';
import IconButton from '@material-ui/core/IconButton';
import './ChapterScrollbar.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdNewReleases } from 'react-icons/md';
//todo: solve funny scrollbar behavior that happens when deleting cards, maybe click on button to update values (correct transform and currentslide)
// another bug after deleting: scrollbar moves because its updating its max value...
// also disable navigation arrows (or not)
// disable scrollbar when all cards fits
const useStyles = makeStyles({
	leftArrow: {
		position: 'relative',
		// display: 'flex',
		// justifyContent: 'flex-start',
		color: '#0099ff',
		
		// 	input:focus {
	// 		outline:none !important;
	// }
		// left: '0',
		// top: '6rem',
		// zIndex: '1',
		// top: '0',
		// left: '0px',
		fontSize: '4rem',
	},
	rightArrow: {
		// display: 'flex',
		// justifyContent: 'flex-end',
		position: 'relative',
		color: '#0099ff',
		// left: '91.4%',
		// zIndex: '1',
		// top: '6rem',
		// top: '14rem',
		// right: '0px',
		fontSize: '4rem',
	},
});

const CustomSlider = ({
	chapters,
	deleteChapterFunction,
	updateTitleFunction,
	selectThumbnailFunction,
	getPresenterSnapshot,
	getPresentationSnapshot,
}) => {
	const [carousel, setCarousel] = useState('');
	const [additionalTransform, setAdditionalTransform] = useState(0);
	const [leftButton, setLeftButton] = useState('');
	const [scrollbar, setScrollbar] = useState(false);
	const classes = useStyles();

	const modifiedDeleteChapterFunction = async id => {
		// const maxTranslateX = getMaxTranslateX();
		// let value = maxTranslateX / 100; // calculate the unit of transform for the slider
		// const prevTransform = carousel.state.transform;
		// const prevMax = getMaxScrollbarValue(value);
		// const {totalItems, slidesToShow} = carousel.state;
		const deleted = await deleteChapterFunction(id);
		if (deleted === true) {

			// const { itemWidth, totalItems, slidesToShow, currentSlide } = carousel.state;
			// const maxTranslateX = Math.round(
			// 	// so that we don't over-slide
			// 	itemWidth * (totalItems - 1 - slidesToShow)
			// 	//  + 150
			// );
			// let value = maxTranslateX / 100;
			// const max = (
			// 	(itemWidth * (totalItems - 1 - slidesToShow) 
			// 	// + (additionalTransform === 150 ? 0 : 150)
			// 	)
			// 	/
			// 	value
			// );
			// const maxTransform = max * value;
			// carousel.setState({
			// 	transform: -maxTransform,
			// 	currentSlide: currentSlide - 1,
			// })

			carousel.isAnimationAllowed = true;
			const {
				slidesToShow,
				totalItems,
				itemWidth,
				currentSlide,
			} = carousel.state;
			let nextTransform;
			let nextSlide;
			if (slidesToShow >= totalItems - 1) {
				nextTransform = 0;
				nextSlide = 0;
			} else {
				nextSlide = currentSlide - 1 <= 0 ? 0 : currentSlide - 1;
				nextTransform = nextSlide * itemWidth;
			}
			carousel.setState({
				transform: -nextTransform,
				currentSlide: nextSlide,
			});

			// const maxTranslateX = getMaxTranslateX();
			// let currentValue = maxTranslateX / 100; // calculate the unit of transform for the slider
			// const currentMax = getMaxScrollbarValue(currentValue);
			// const transformRatio = currentMax / prevMax;
			// const newTransform = transformRatio * prevTransform;
			// console.log('newTrans', newTransform);
			// const {itemWidth} = carousel.state;
			// const nextSlide = Math.round(-newTransform / itemWidth);
			// console.log('newSlide', nextSlide)
			// carousel.setState({
			// 	transform: newTransform,
			// 	currentSlide: nextSlide,
			// });
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
				getPresenterSnapshot={() => getPresenterSnapshot()}
				getPresentationSnapshot={() => getPresentationSnapshot()}
			></CustomCard>
		));
	};

	const getMaxTranslateX = () => {
		if (carousel) {
			const { itemWidth, totalItems, slidesToShow } = carousel.state;
			return Math.round(
				// so that we don't over-slide
				itemWidth * (totalItems - slidesToShow)
				//  + 150
			);
		}
	};

	const getMaxScrollbarValue = (value) => {
		const { itemWidth, totalItems, slidesToShow } = carousel.state;
		return (
			(itemWidth * (totalItems - slidesToShow) 
			// + (additionalTransform === 150 ? 0 : 150)
			)
			/
			value
		);
	};

	const CustomRightArrow = () => {
		let value = 0;
		if (carousel) {
			const maxTranslateX = getMaxTranslateX();
			value = maxTranslateX / 100; // calculate the unit of transform for the slider
		}
		const handleOnClick = () => {
			carousel.isAnimationAllowed = true;
			const {
				slidesToShow,
				totalItems,
				itemWidth,
				currentSlide,
			} = carousel.state;
			const max = getMaxScrollbarValue(value);
			let nextTransform;
			let nextSlide;
			// const maxSlides = totalItems - slidesToShow + 1;
			const maxSlides = totalItems - slidesToShow;
			const maxTransform = max * value;
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
			carousel.setState({
				transform: -nextTransform,
				currentSlide: nextSlide,
			});
		};
		return (
			<IconButton
				className={classes.rightArrow}
				onClick={() => handleOnClick()}
			>
				<FaChevronRight className="right-arrow-icon" />
			</IconButton>
		);
	};

	const CustomLeftArrow = () => {
		const handleOnClick = () => {
			carousel.isAnimationAllowed = true;
			const {
				slidesToShow,
				totalItems,
				itemWidth,
				currentSlide,
			} = carousel.state;
			let nextTransform;
			let nextSlide;
			if (slidesToShow >= totalItems) {
				nextTransform = 0;
				nextSlide = 0;
			} else {
				nextSlide = currentSlide - 1 <= 0 ? 0 : currentSlide - 1;
				nextTransform = nextSlide * itemWidth;
			}
			carousel.setState({
				transform: -nextTransform,
				currentSlide: nextSlide,
			});
		};
		return (
			<IconButton
				className={classes.leftArrow}
				onClick={() => handleOnClick()}
				// ref={el => setLeftButton(el)}
			>
				<FaChevronLeft />
			</IconButton>
		);
	};

	const showScrollbar = () => {

	}

	const ChapterScrollbar = () => {
		let value = 0;
		if (carousel) {
			const maxTranslateX = getMaxTranslateX();
			value = maxTranslateX / 100;
		}
		const { transform, itemWidth } = carousel.state;
		// console.log('ScrollbarTransform: ', transform);
		console.log('Scrollbar:', carousel.state)
		return (
			<div className="custom-slider">
				<input
					type="range"
					value={Math.round(Math.abs(transform) / value)} //this is key for getting exact value
					max={getMaxScrollbarValue(value)}
					onChange={(e) => {
						if (carousel.isAnimationAllowed) {
							carousel.isAnimationAllowed = false;
						}
						const nextTransform = e.target.value * value;
						const nextSlide = Math.round(nextTransform / itemWidth);
						if (e.target.value === 0 && additionalTransform === 150) {
							carousel.isAnimationAllowed = true;
							setAdditionalTransform(0);
						}
						carousel.setState({
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
			partialVisibilityGutter: 40,
		},
		mobile: {
			breakpoint: {
				max: 1360,
				min: 0,
			},
			items: 3,
			partialVisibilityGutter: 30,
		},
		tablet: {
			breakpoint: {
				max: 1810,
				min: 1360,
			},
			items: 4,
			partialVisibilityGutter: 30,
		},
	};

	return (
		<div className="root-slider">
			<CustomLeftArrow className="left-arrow-spacing" />
			<Carousel
				className="custom-carousel"
				additionalTransform={-additionalTransform}
				ssr={false}
				ref={(el) => setCarousel(el)}
				arrows={false}
				keyBoardControl={false}
				partialVisbile={false}
				customButtonGroup={<ChapterScrollbar />}
				infinite={false}
				itemClass="slider-image-item"
				containerClass="carousel-container-with-scrollbar"
				draggable={true}
				responsive={responsive}
				afterChange={(previousSlide) => {

				}}
				// beforeChange={(nextSlide) => {
				// 	if (nextSlide !== 0 && additionalTransform !== 150) {
				// 		setAdditionalTransform(150);
				// 	}
				// 	if (nextSlide === 0 && additionalTransform === 150) {
				// 		setAdditionalTransform(0);
				// 	}
				// }}
			>
				{cardsToShow()}
			</Carousel>
			<CustomRightArrow className="right-arrow-spacing" />
		</div>
	);
};

export default CustomSlider;
