export const getPositionInPx = (percent, timerDivWidth) =>
	percent * timerDivWidth;

export const getPositionInPercent = (px, timerDivWidth) => px / timerDivWidth;

export const getNumberOfMainIndicators = (zoomLevel, duration) => {
	return ((zoomLevel - 1) / 9) * (duration - 10) + 10;
};
