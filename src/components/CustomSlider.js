import React, { useState } from 'react';
import Carousel from 'react-multi-carousel';
import { makeStyles } from '@material-ui/core/styles';
import CustomCard from './CustomCard';
import 'react-multi-carousel/lib/styles.css';
import IconButton from '@material-ui/core/IconButton';
import './ChapterScrollbar.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
//todo: if arrows disappear update scrollbar to 100 or 0
//	    solve funny scrollbar behavior that happens when deleting cards
const useStyles = makeStyles({
	leftArrow: {
		position: 'absolute',
		color: '#0099ff',
		top: '14rem',
		left: '0px',
		fontSize: '4rem',
	},
	rightArrow: {
		position: 'absolute',
		color: '#0099ff',
		top: '14rem',
		right: '0px',
		fontSize: '4rem',
	},
});

const CustomSlider = ({
	chapters,
	deleteChapterFunction,
	updateTitleFunction,
	selectThumbnailFunction,
}) => {
	const [carousel, setCarousel] = useState('');
	const [additionalTransform, setAdditionalTransform] = useState(0);
	const classes = useStyles();

	const cardsToShow = () => {
		return chapters.map((chapter) => (
			<CustomCard
				key={chapter.id}
				chapter={chapter}
				deleteChapterFunction={() => modifiedDeleteChapterFunction(chapter.id)}
				updateTitleFunction={updateTitleFunction}
				selectThumbnailFunction={selectThumbnailFunction}
			></CustomCard>
		));
	};

	const modifiedDeleteChapterFunction = (id) => {
		if (deleteChapterFunction(id)) {
			//insert code that fixes scrollbar here
		}
	};

	const getMaxTranslateX = () => {
		if (carousel) {
			const { itemWidth, totalItems, slidesToShow } = carousel.state;
			return Math.round(
				// so that we don't over-slide
				itemWidth * (totalItems - slidesToShow) + 150
			);
		}
	};

	const getMaxScrollbarValue = (value) => {
		const { itemWidth, totalItems, slidesToShow } = carousel.state;
		return (
			(itemWidth * (totalItems - slidesToShow) +
				(additionalTransform === 150 ? 0 : 150)) /
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
			const maxSlides = totalItems - slidesToShow + 1;
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
		// let value = 0;
		// if (carousel) {
		// 	const maxTranslateX = getMaxTranslateX();
		// 	value = maxTranslateX / 100; // calculate the unit of transform for the slider
		// }
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
			// <div className='custom-left-arrow'>
			<IconButton
				className={classes.leftArrow}
				onClick={() => handleOnClick()}
			>
				<FaChevronLeft />
			</IconButton>
		);
	};

	const ChapterScrollbar = () => {
		let value = 0;
		if (carousel) {
			const maxTranslateX = getMaxTranslateX();
			value = maxTranslateX / 100;
		}
		const { transform, itemWidth } = carousel.state;
		console.log('ScrollbarTransform: ', transform);
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
				min: 1024,
			},
			items: 5,
			partialVisibilityGutter: 40,
		},
		mobile: {
			breakpoint: {
				max: 800,
				min: 0,
			},
			items: 2,
			partialVisibilityGutter: 30,
		},
		tablet: {
			breakpoint: {
				max: 1200,
				min: 800,
			},
			items: 3,
			partialVisibilityGutter: 30,
		},
	};

	return (
		<div className="container-fluid">
			<CustomLeftArrow className="left-arrow-spacing" />
			<Carousel
				className="custom-carousel"
				additionalTransform={additionalTransform}
				ssr={false}
				ref={(el) => setCarousel(el)}
				arrows={false}
				keyBoardControl={false}
				partialVisbile={false}
				customButtonGroup={<ChapterScrollbar />}
				infinite={false}
				itemClass="slider-image-item"
				containerClass="carousel-container-with-scrollbar"
				draggable={false}
				responsive={responsive}
				beforeChange={(nextSlide) => {
					if (nextSlide !== 0 && additionalTransform !== 150) {
						setAdditionalTransform(150);
					}
					if (nextSlide === 0 && additionalTransform === 150) {
						setAdditionalTransform(0);
					}
				}}
			>
				{cardsToShow()}
			</Carousel>
			<CustomRightArrow />
		</div>
	);
};

export default CustomSlider;
