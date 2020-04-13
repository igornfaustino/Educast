export const tryToEnterFullscreen = async (elem) => {
	try {
		if (elem.requestFullscreen) {
			await elem.requestFullscreen();
		} else if (elem.mozRequestFullScreen) {
			await elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
			await elem.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) {
			await elem.msRequestFullscreen();
		} else {
			return false;
		}
		return true;
	} catch (error) {
		return false;
	}
};
