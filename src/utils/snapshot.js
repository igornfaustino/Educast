export const getSnapshot = (video) => {
	if (!video) return;
	const canvas = document.createElement('canvas');
	canvas.width = 640;
	canvas.height = 480;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
	var dataURI = canvas.toDataURL('image/jpeg');
	return dataURI;
};
