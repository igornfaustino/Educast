import { useEffect, useState, useCallback } from 'react';

export function useVideoHeigth(maxWidth, maxHeight, size1, size2) {
	const [heigth, setHeigth] = useState(0);
	const [width1, setWidth1] = useState(maxWidth / 2);
	const [width2, setWidth2] = useState(maxWidth / 2);

	const getNewHeight = useCallback((originalSize, width) => {
		return parseInt((width * originalSize.height) / originalSize.width);
	}, []);

	const getNewWidth = useCallback((originalSize, height) => {
		return parseInt((height * originalSize.width) / originalSize.height);
	}, []);

	const tryToFitVideosInMaxHeight = useCallback(
		(maxHeight, maxWidth, size1, size2) => {
			const w1 = getNewWidth(size1, maxHeight);
			const w2 = getNewWidth(size2, maxHeight);
			const totalWidth = w1 + w2;
			if (totalWidth >= maxWidth) {
				return false;
			}
			setHeigth(maxHeight);
			setWidth1(w1);
			setWidth2(w2);
			return true;
		},
		[getNewWidth]
	);

	const fitVideoHeightAsPossible = useCallback(
		(maxWidth, size1, size2) => {
			let videoWidht = parseInt(maxWidth / 2);
			let h1 = getNewHeight(size1, videoWidht);
			let h2 = getNewHeight(size2, videoWidht);
			let _size1 = size1;
			let _size2 = size2;
			let inverse = false;

			if (!h1 || !h2) return;

			if (h2 < h1) {
				inverse = true;
				[h1, h2] = [h2, h1];
				[_size1, _size2] = [_size2, _size1];
			}

			while (h1 < h2) {
				videoWidht++;
				h1 = getNewHeight(_size1, videoWidht);
				h2 = getNewHeight(_size2, maxWidth - videoWidht);
				console.log({ h1, h2 });
			}
			if (inverse) {
				setWidth1(maxWidth - videoWidht);
				setWidth2(videoWidht);
			} else {
				setWidth1(videoWidht);
				setWidth2(maxWidth - videoWidht);
			}
			setHeigth(Math.max(h1, h2));
		},
		[getNewHeight]
	);

	useEffect(() => {
		const isVideoFitInMaxHeight = tryToFitVideosInMaxHeight(
			maxHeight,
			maxWidth,
			size1,
			size2
		);
		if (!isVideoFitInMaxHeight)
			fitVideoHeightAsPossible(maxWidth, size1, size2);
	}, [
		fitVideoHeightAsPossible,
		getNewHeight,
		maxHeight,
		maxWidth,
		size1,
		size2,
		tryToFitVideosInMaxHeight,
	]);

	return { heigth, width1, width2 };
}
