import React, { useState, useEffect, useMemo } from 'react';
import styles from './TimeIndicator.module.scss';
import cx from 'classnames';
import moment from 'moment';

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
		const qttPauzinhosGrandes = zoomLevel * 10;

		const qttPauzinhosMenores = zoomLevel * 90;

		const timeInterval = videoLength / (qttPauzinhosGrandes * zoomLevel);

		let arrayOfWhiteBarsAndTimers = [];

		console.log('limite for: ', qttPauzinhosGrandes + qttPauzinhosMenores);

		for (let i = 0; i <= qttPauzinhosGrandes + qttPauzinhosMenores; i++) {
			let tag;
			if (i !== 0 && i % 10 === 0) {
				console.log((timeInterval * i) / 10);
				tag = createPauzinhoMaiorComTempoEmcima((timeInterval * i) / 10, i);
			} else if (i === 0) {
				tag = createPauzinhoMaiorSemTempo();
			} else {
				tag = createPauzinhoMenor(i);
			}
			arrayOfWhiteBarsAndTimers.push(tag);
		}

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
