import React, { useEffect, useRef, useState } from 'react';
import Carousel from 'react-multi-carousel';
import { makeStyles } from '@material-ui/core/styles';
import CustomCard from './CustomCard';
import 'react-multi-carousel/lib/styles.css';
import IconButton from '@material-ui/core/IconButton';
import './CustomSlider.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { jsx, css } from '@emotion/core';

// quant q da p mostrar / quant total * 100 == complemento dissos
// style inline lib react

// TODO: another bug: place scrollbar at origin and disable it when all cards fits
// TODO: NO: make scroll bar bigger when deleting. make spacing between cards bigger when deleting; atualizar itemWidth na API quando deletar cards
// TODO: integrar com o componente do video-editor
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
	const [carouselDraggable, setCarouselDraggable] = useState(true);

	const resizeWindow = () => {
		if (carouselRef.current) {
			const { transform, totalItems, slidesToShow } = carouselRef.current.state;
			const maxTranslateX = getMaxTranslateX();
			let value = maxTranslateX / 100;
			carouselRef.current.isAnimationAllowed = false;
			const max = getMaxScrollbarValue(value);
			const maxAllowedTransform = max * value;
			console.log(maxAllowedTransform);
			console.log(transform);
			console.log('break');
			if (Math.abs(transform) > maxAllowedTransform) {
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

	const isTextFieldBeingEdited = (isIt) => {
		setCarouselDraggable(!isIt);
	};

	const modifiedDeleteChapterFunction = async (id) => {
		const deleted = await deleteChapterFunction(id);
		if (deleted === true) {
			setTotItems(totItems - 1);
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
				// ! disable scrollbar here, and make it full width
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
				isTextFieldBeingEdited={isTextFieldBeingEdited}
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

	const CustomRightArrow = () => {
		let value = 0;
		if (carouselRef.current) {
			const maxTranslateX = getMaxTranslateX();
			value = maxTranslateX / 100;
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
				nextTransform = 0;
				nextSlide = 0;
			} else {
				nextSlide =
					currentSlide + 1 > maxSlides ? currentSlide : currentSlide + 1;
				if (nextSlide === currentSlide) {
					nextTransform = maxTransform;
				} else {
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
		const { transform, itemWidth } = carouselRef.current.state;
		return (
			<div className="custom-slider">
				<input
					type="range"
					ref={scrollbarRef}
					value={Math.round(Math.abs(transform) / value)}
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
							transform: -nextTransform,
							currentSlide: nextSlide,
						});
					}}
					className={'custom-slider__input'}
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
			items: 5,
		},
		mobile: {
			breakpoint: {
				max: 1360,
				min: 0,
			},
			items: 3,
		},
		tablet: {
			breakpoint: {
				max: 1810,
				min: 1360,
			},
			items: 4,
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
				draggable={carouselDraggable}
				responsive={responsive}
			>
				{cardsToShow()}
			</Carousel>
			<CustomRightArrow className="right-arrow-spacing" />
		</div>
	);
};

export default CustomSlider;
