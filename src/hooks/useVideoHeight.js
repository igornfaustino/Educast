import { useEffect, useState, useCallback } from 'react';

export function useVideoHeigth(maxWidth, size1, size2) {
	const [heigth, setHeigth] = useState(0);
	const [width1, setWidth1] = useState(maxWidth / 2);
	const [width2, setWidth2] = useState(maxWidth / 2);

	const getNewHeight = useCallback((originalSize, width) => {
		return parseInt((width * originalSize.height) / originalSize.width);
	}, []);

	useEffect(() => {
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
	}, [getNewHeight, maxWidth, size1, size2]);

	return { heigth, width1, width2 };
}
