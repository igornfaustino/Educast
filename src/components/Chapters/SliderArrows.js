import React, { useCallback } from 'react';

import 'react-multi-carousel/lib/styles.css';
import IconButton from '@material-ui/core/IconButton';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import styles from './SliderArrows.module.scss';

// Helper for getting maximum scrollbar value.
const getMaxTranslateX = (carouselRef) => {
	if (carouselRef.current) {
		const { itemWidth, totalItems, slidesToShow } = carouselRef.current.state;
		if (totalItems === slidesToShow) {
			return itemWidth;
		}
		return Math.round(itemWidth * (totalItems - slidesToShow)) / 100;
	}
};

// Helper for getting maximum scrollbar value.
const getMaxScrollbarValue = (value, carouselRef) => {
	const { itemWidth, totalItems, slidesToShow } = carouselRef.current.state;
	return (itemWidth * (totalItems - slidesToShow)) / value;
};

const CustomRightArrow = ({ carouselRef }) => {
	const handleOnClick = useCallback(() => {
		carouselRef.current.isAnimationAllowed = true;
		const {
			slidesToShow,
			totalItems,
			itemWidth,
			currentSlide,
		} = carouselRef.current.state;
		const value = getMaxTranslateX(carouselRef);
		const max = getMaxScrollbarValue(value, carouselRef);
		let nextTransform;
		let nextSlide;
		const maxSlides = totalItems - slidesToShow;
		const maxTransform = max * value;
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
	}, [carouselRef]);

	return (
		<IconButton className={styles['arrow']} onClick={handleOnClick}>
			<FaChevronRight />
		</IconButton>
	);
};

const CustomLeftArrow = ({ carouselRef }) => {
	const handleOnClick = useCallback(() => {
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
	}, [carouselRef]);

	return (
		<IconButton className={styles['arrow']} onClick={handleOnClick}>
			<FaChevronLeft />
		</IconButton>
	);
};

export { CustomRightArrow, CustomLeftArrow };
