import React, { useMemo, useCallback, useRef } from 'react';

import cx from 'classnames';
import moment from 'moment';
import { useSelector } from 'react-redux';

import styles from './TimeIndicator.module.scss';
import { ZOOM_MAX } from '../../utils/constants';
import { getNumberOfMainIndicators } from '../../utils/conversions';

const TimeIndicator = ({
	zoomLevel,
	calculatedMargin,
	handleTimelineClick,
	timerDivWidth,
}) => {
	const duration = useSelector((state) => state.video.duration);
	const scrollLeft = useSelector((state) => state.timeline.scrollLeft);
	const visibleArea = useSelector((state) => state.timeline.visibleArea);
	const indicatorsRef = useRef(null);

	const createMainIndicatorWithTimeLabel = useCallback(
		(timeInterval, indicatorIdx) => {
			return (
				<>
					<span
						style={{
							bottom: 20,
							position: 'absolute',
							marginLeft: indicatorIdx * calculatedMargin - 35 + 'px',
							zIndex: 50,
						}}
					>
						{moment.utc(timeInterval * 1000).format('HH:mm:ss:SSS')}
					</span>
					<div
						className={cx(
							styles['timer-vertical-whitebar--big'],
							styles['timer-vertical-whitebar']
						)}
						style={{
							marginLeft: calculatedMargin * indicatorIdx + 'px',
						}}
					></div>
				</>
			);
		},
		[calculatedMargin]
	);

	const createSubIndicator = useCallback(
		(indicatorIdx) => {
			return (
				<div
					className={styles['timer-vertical-whitebar']}
					style={{
						marginLeft: calculatedMargin * indicatorIdx + 'px',
					}}
				></div>
			);
		},
		[calculatedMargin]
	);

	const createMainIndicatorWithoutTimeLabel = useCallback(
		(indicatorIdx) => {
			return (
				<div
					className={cx(
						styles['timer-vertical-whitebar--big'],
						styles['timer-vertical-whitebar']
					)}
					style={{
						marginLeft: calculatedMargin * indicatorIdx + 'px',
					}}
				></div>
			);
		},
		[calculatedMargin]
	);

	const onClick = useCallback(
		(e) => {
			const rect = indicatorsRef.current.getBoundingClientRect();
			const relativeX = e.clientX - rect.left;
			const percentagePlayed = (relativeX * 100) / timerDivWidth;
			const currentTime = (percentagePlayed * duration) / 100;
			handleTimelineClick(currentTime);
		},
		[duration, handleTimelineClick, timerDivWidth]
	);

	const quantityOfMainIndicators = useMemo(
		() => getNumberOfMainIndicators(zoomLevel, duration),
		[duration, zoomLevel]
	);

	const numberOfSubIndicatorsBetweenEachMain = useMemo(
		() => (Number(zoomLevel) === ZOOM_MAX ? 24 : 9),
		[zoomLevel]
	);

	const quantityOfSubIndicators = useMemo(
		() => quantityOfMainIndicators * numberOfSubIndicatorsBetweenEachMain,
		[numberOfSubIndicatorsBetweenEachMain, quantityOfMainIndicators]
	);

	const timeInterval = useMemo(() => duration / quantityOfMainIndicators, [
		duration,
		quantityOfMainIndicators,
	]);

	const indicators = useMemo(() => {
		const arrayOfWhiteBarsAndTimers = [];

		const spaceBetweenBiggerIndicator =
			numberOfSubIndicatorsBetweenEachMain + 1;

		const totalOfIndicators =
			quantityOfMainIndicators + quantityOfSubIndicators;

		for (let i = 0; i <= totalOfIndicators; i++) {
			const margin = i * calculatedMargin;
			if (margin < scrollLeft - 100 || margin > scrollLeft + visibleArea + 100)
				continue;

			let indicator;
			if (
				i !== 0 &&
				i !== totalOfIndicators &&
				i % spaceBetweenBiggerIndicator === 0
			) {
				const intervalOffset = i / spaceBetweenBiggerIndicator;
				indicator = createMainIndicatorWithTimeLabel(
					timeInterval * intervalOffset,
					i
				);
			} else if (i === 0 || i === totalOfIndicators) {
				indicator = createMainIndicatorWithoutTimeLabel(i);
			} else {
				indicator = createSubIndicator(i);
			}
			arrayOfWhiteBarsAndTimers.push(indicator);
		}

		return React.Children.toArray(arrayOfWhiteBarsAndTimers);
	}, [
		calculatedMargin,
		createMainIndicatorWithTimeLabel,
		createMainIndicatorWithoutTimeLabel,
		createSubIndicator,
		numberOfSubIndicatorsBetweenEachMain,
		quantityOfMainIndicators,
		quantityOfSubIndicators,
		scrollLeft,
		timeInterval,
		visibleArea,
	]);

	return (
		<div
			className={styles['timeIndicator__container']}
			ref={indicatorsRef}
			onClick={onClick}
		>
			{indicators}
		</div>
	);
};

export default TimeIndicator;
