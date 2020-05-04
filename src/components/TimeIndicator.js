import React, { useState, useEffect, useMemo } from 'react';
import styles from './TimeIndicator.module.scss';
import cx from 'classnames';
import moment from 'moment';

import { ZOOM_MAX } from '../utils/constants';

const TimeIndicator = ({ videoLength, zoomLevel }) => {
	const createPauzinhoMaiorComTempoEmcima = (timeInterval, pauzinhoNumber) => {
		return (
			<>
				<span
					style={{
						bottom: 20,
						position: 'absolute',
						marginLeft: pauzinhoNumber * 10.5 - 21 + 'px',
						zIndex: 50,
					}}
				>
					{moment.utc(timeInterval * 1000).format('HH:mm:ss')}
				</span>
				<div
					className={cx(
						styles['timer-vertical-whitebar--big'],
						styles['timer-vertical-whitebar']
					)}
					style={{
						marginLeft: pauzinhoNumber * 10.5 + 'px',
					}}
				></div>
			</>
		);
	};

	const createPauzinhoMenor = (pauzinhoNumber) => {
		return (
			<div
				className={styles['timer-vertical-whitebar']}
				style={{
					marginLeft: pauzinhoNumber * 10.5 + 'px',
				}}
			></div>
		);
	};

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

	const pauzinhos = useMemo(() => {
		let qttPauzinhosGrandes = zoomLevel * 10;

		const qttPauzinhosMenores = zoomLevel * 90;

		const timeInterval = videoLength / (qttPauzinhosGrandes * zoomLevel);

		let arrayOfWhiteBarsAndTimers = [];

		if (Number(zoomLevel) === ZOOM_MAX) {
			qttPauzinhosGrandes = videoLength / zoomLevel;
			console.log('Qtt de pauzinhos de grandes: ' + qttPauzinhosGrandes);
			console.log('-->', qttPauzinhosGrandes + qttPauzinhosGrandes * 24);
			// console.log({ arrayOfWhiteBarsAndTimers });
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
	}, [videoLength, zoomLevel]);

	return (
		<div
			className={styles['timeIndicator__container']}
			// style={{ width: videoLength * 10 + "px" }}
		>
			{/* {generateVerticalWhiteBarsAndTimers(videoLength)} */}
			{pauzinhos}
		</div>
	);
};

export default TimeIndicator;
