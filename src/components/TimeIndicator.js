import React, { useMemo, useCallback } from 'react';

import cx from 'classnames';
import moment from 'moment';
import { useSelector } from 'react-redux';

import styles from './TimeIndicator.module.scss';
import { ZOOM_MAX } from '../utils/constants';
import { getNumberOfMainIndicators } from '../utils/conversions';

const TimeIndicator = ({ videoLength, zoomLevel, calculatedMargin }) => {
	const duration = useSelector((state) => state.video.duration);

	const createPauzinhoMaiorComTempoEmcima = useCallback(
		(timeInterval, pauzinhoNumber) => {
			return (
				<>
					<span
						style={{
							bottom: 20,
							position: 'absolute',
							marginLeft: pauzinhoNumber * calculatedMargin - 21 + 'px',
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

	const createPauzinhoMaiorSemTempo = () => {
		return (
			<div
				className={cx(
					styles['timer-vertical-whitebar--big'],
					styles['timer-vertical-whitebar']
				)}
				style={{
					marginLeft: 0 + 'px',
				}}
			></div>
		);
	};

	const getNumberOfMainIndicators = (zoomLevel, duration) => {
		return ((zoomLevel - 1) / 9) * (duration - 10) + 10;
	};

	const pauzinhos = useMemo(() => {
		let qttPauzinhosGrandes = getNumberOfMainIndicators(zoomLevel, duration);

		const qttPauzinhosMenores = qttPauzinhosGrandes * 9;

		const timeInterval = duration / qttPauzinhosGrandes;

		let arrayOfWhiteBarsAndTimers = [];

		if (Number(zoomLevel) === ZOOM_MAX) {
			qttPauzinhosGrandes = duration;

			for (
				let i = 0;
				i <= qttPauzinhosGrandes + qttPauzinhosGrandes * 24;
				i++
			) {
				let tag;
				if (i !== 0 && i % 25 === 0) {
					tag = createPauzinhoMaiorComTempoEmcima(i / 25, i);
				} else if (i === 0) {
					tag = createPauzinhoMaiorSemTempo();
				} else {
					tag = createPauzinhoMenor(i);
				}
				arrayOfWhiteBarsAndTimers.push(tag);
			}
		} else {
			for (let i = 0; i <= qttPauzinhosGrandes + qttPauzinhosMenores; i++) {
				let tag;
				const spaceBetweenBiggerIndicator = 10;
				if (i !== 0 && i % spaceBetweenBiggerIndicator === 0) {
					const intervalOffset = i / spaceBetweenBiggerIndicator;
					tag = createPauzinhoMaiorComTempoEmcima(
						timeInterval * intervalOffset,
						i
					);
				} else if (i === 0) {
					tag = createPauzinhoMaiorSemTempo();
				} else {
					tag = createPauzinhoMenor(i);
				}
				arrayOfWhiteBarsAndTimers.push(tag);
			}
		}
		// console.log({ length: arrayOfWhiteBarsAndTimers.length });
		return React.Children.toArray(arrayOfWhiteBarsAndTimers);
	}, [
		createPauzinhoMaiorComTempoEmcima,
		createPauzinhoMenor,
		duration,
		zoomLevel,
	]);

	return <div className={styles['timeIndicator__container']}>{pauzinhos}</div>;
};

export default TimeIndicator;
