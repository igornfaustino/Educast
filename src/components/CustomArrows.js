import * as React from 'react';
import styles from './CustomArrows.module.css';
import {
	FaUpload,
	FaImages,
	FaTimes,
	FaChalkboardTeacher,
} from 'react-icons/fa';

const CustomLeftArrow = ({ onClick }) => {
	return (
		<div className={styles['left-arrow']}>
			<i>
				<FaChalkboardTeacher />
			</i>
			{/* <i onClick={() => onClick()} className="custom-left-arrow" /> */}
		</div>
	);
};

const CustomRightArrow = ({ onClick }) => {
	return (
		<i className={styles['custom-right-arrow']} onClick={() => onClick()} />
	);
};

const CustomButtonGroup = ({ next, previous, goToSlide, carouselState }) => {
	const { totalItems, currentSlide } = carouselState;
	return (
		<div className="custom-button-group">
			<div>Current slide is {currentSlide}</div>
			<button onClick={() => previous()}>Previous slide</button>
			<button onClick={() => next()}>Next slide</button>
			<button
				onClick={() => goToSlide(Math.floor(Math.random() * totalItems + 1))}
			>
				Go to a random slide
			</button>
		</div>
	);
};

const CustomButtonGroupAsArrows = ({ next, previous }) => {
	return (
		<div
			style={{
				textAlign: 'center',
			}}
		>
			<h4>These buttons can be positioned anywhere you want on the screen</h4>
			<button onClick={previous}>Prev</button>
			<button onClick={next}>Next</button>
		</div>
	);
};

export {
	CustomLeftArrow,
	CustomRightArrow,
	CustomButtonGroup,
	CustomButtonGroupAsArrows,
};
