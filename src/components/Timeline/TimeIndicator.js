import React, { useMemo, useCallback, useRef } from 'react';

import cx from 'classnames';
import moment from 'moment';
import { useSelector } from 'react-redux';

import styles from './TimeIndicator.module.scss';
import { ZOOM_MAX } from '../../utils/constants';
import { getNumberOfMainIndicators } from '../../utils/conversions';
import { FaPassport } from 'react-icons/fa';

const TimeIndicator = ({ zoomLevel, calculatedMargin }) => {
	const duration = useSelector((state) => state.video.duration);
	const scrollLeft = useSelector((state) => state.timeline.scrollLeft);
	const visibleArea = useSelector((state) => state.timeline.visibleArea);
	const indicatorsRef = useRef(null);

	const createPauzinhoMaiorComTempoEmcima = useCallback(
		(timeInterval, pauzinhoNumber) => {
			return (
				<>
					<span
						style={{
							bottom: 20,
							position: 'absolute',
							marginLeft: pauzinhoNumber * calculatedMargin - 35 + 'px',
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
							marginLeft: calculatedMargin * pauzinhoNumber + 'px',
						}}
					></div>
				</>
			);
		},
		[calculatedMargin]
	);

	const createPauzinhoMenor = useCallback(
		(pauzinhoNumber) => {
			return (
				<div
					className={styles['timer-vertical-whitebar']}
					style={{
						marginLeft: calculatedMargin * pauzinhoNumber + 'px',
					}}
				></div>
			);
		},
		[calculatedMargin]
	);

	const createPauzinhoMaiorSemTempo = (pauzinhoNumber) => {
		return (
			<div
				className={cx(
					styles['timer-vertical-whitebar--big'],
					styles['timer-vertical-whitebar']
				)}
				style={{
					marginLeft: calculatedMargin * pauzinhoNumber + 'px',
				}}
			></div>
		);
	};

	const pauzinhos = useMemo(() => {
		let qttPauzinhosGrandes = getNumberOfMainIndicators(zoomLevel, duration);

		const numberOfSubIndicatorsBetweenEachMain =
			Number(zoomLevel) === ZOOM_MAX ? 24 : 9;
		const qttPauzinhosMenores =
			qttPauzinhosGrandes * numberOfSubIndicatorsBetweenEachMain;

		const timeInterval = duration / qttPauzinhosGrandes;

		let arrayOfWhiteBarsAndTimers = [];

		const spaceBetweenBiggerIndicator =
			numberOfSubIndicatorsBetweenEachMain + 1;

		const totalOfIndicators = qttPauzinhosGrandes + qttPauzinhosMenores;

		for (let i = 0; i <= totalOfIndicators; i++) {
			const margin = i * calculatedMargin;
			if (margin < scrollLeft - 100 || margin > scrollLeft + visibleArea + 100)
				continue;

			let tag;
			if (
				i !== 0 &&
				i !== totalOfIndicators &&
				i % spaceBetweenBiggerIndicator === 0
			) {
				const intervalOffset = i / spaceBetweenBiggerIndicator;
				tag = createPauzinhoMaiorComTempoEmcima(
					timeInterval * intervalOffset,
					i
				);
			} else if (i === 0 || i === totalOfIndicators) {
				tag = createPauzinhoMaiorSemTempo(i);
			} else {
				tag = createPauzinhoMenor(i);
			}
			arrayOfWhiteBarsAndTimers.push(tag);
		}

		return React.Children.toArray(arrayOfWhiteBarsAndTimers);
	}, [
		calculatedMargin,
		createPauzinhoMaiorComTempoEmcima,
		createPauzinhoMenor,
		duration,
		scrollLeft,
		visibleArea,
		zoomLevel,
	]);

	return (
		<div className={styles['timeIndicator__container']} ref={indicatorsRef}>
			{pauzinhos}
		</div>
	);
};

export default TimeIndicator;
