import React, { useState } from 'react';
import Carousel from 'react-multi-carousel';
import CustomCard from './CustomCard';
import 'react-multi-carousel/lib/styles.css';
import './CustomSlider.module.css';
import { CustomRightArrow } from './CustomArrows';
import './ChapterScrollbar.css';

const CustomSlider = ({
	chapters,
	deleteChapterFunction,
	updateTitleFunction,
	selectThumbnailFunction,
}) => {
	const [carousel, setCarousel] = useState('');
	const [additionalTransform, setAdditionalTransform] = useState(0);
	const [sliderEnabled, setSliderEnabled] = useState(true)

	const cardsToShow = () => {
		return chapters.map((chapter) => (
			<CustomCard
				key={chapter.id}
				chapter={chapter}
				deleteChapterFunction={() => deleteChapterFunction(chapter.id)}
				updateTitleFunction={updateTitleFunction}
				selectThumbnailFunction={selectThumbnailFunction}
			></CustomCard>
		));
	};

	const CustomLeftArrow = ({ carouselState }) => {
		let value = 0;
		let carouselItemWidth = 0;
		if (carousel) {
			carouselItemWidth = carousel.state.itemWidth;
			const maxTranslateX = Math.round(
				// so that we don't over-slide
				carouselItemWidth *
					(carousel.state.totalItems - carousel.state.slidesToShow) +
					150
			);
			value = maxTranslateX / 100; // calculate the unit of transform for the slider
				// value = ;
		}

		return (
			<div className='custom-left-arrow'>

				{/* <i onClick={() => onClick()} className="custom-left-arrow" /> */}
			</div>
		);
	};

	const ChapterScrollbar = ({ carouselState }) => {
		let value = 0;
		let carouselItemWidth = 0;
		if (carousel) {
			carouselItemWidth = carousel.state.itemWidth;
			const maxTranslateX = Math.round(
				// so that we don't over-slide
				carouselItemWidth *
					(carousel.state.totalItems - carousel.state.slidesToShow) +
					150
			);
			value = maxTranslateX / 100; // calculate the unit of transform for the slider
				// value = ;
		}
		const { transform } = carouselState;
		return (
			<div className="custom-slider">
				<input
					type="range"
					value={Math.round(Math.abs(transform) / value)}
					// defaultValue={0}
					max={
						(carouselItemWidth *
							(carouselState.totalItems - carouselState.slidesToShow) +
							(additionalTransform === 150 ? 0 : 150)) /
						value
					}
					onChange={(e) => {
						if (carousel.isAnimationAllowed) {
							carousel.isAnimationAllowed = false;
						}
						console.log(carouselState.totalItems)
						const nextTransform = e.target.value * value;
						console.log(e.target.value)
						const nextSlide = Math.round(nextTransform / carouselItemWidth);
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
		// <div style={{"width: 100%"}}></div>
		<div className="container-fluid">
			<Carousel
				className='custom-carousel'
				additionalTransform={additionalTransform}
				ssr={false}
				ref={(el) => setCarousel(el)}
				// arrows
				partialVisbile={false}
				// centerMode={true}
				// className=""
				customLeftArrow={<CustomLeftArrow />}
				// customRightArrow={<CustomRightArrow />}
				customButtonGroup={<ChapterScrollbar />}
				infinite={false}
				itemClass="slider-image-item"
				containerClass="carousel-container-with-scrollbar"
				// focusOnSelect={false}
				// keyBoardControl
				// renderButtonGroupOutside={true}
				responsive={responsive}
				// sliderClass=""
				// slidesToSlide={1}
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
		</div>
	);
};

export default CustomSlider;
