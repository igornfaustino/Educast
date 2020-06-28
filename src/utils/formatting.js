// Always returns two digit number to match time format.
const pad = (number) => {
	return ('0' + number).slice(-2);
};

// Helper for formatting time label (returns 'hh:mm:ss' given chapter position in range [0..1] and full video length in seconds).
// Inputs: chapterPosition: chapter position in range [0..1]
//				 fullVideoLength: full video length in seconds
// Output: 'hh:mm:ss' time format.
export const timeFormatter = (chapterPosition, fullVideoLength) => {
	let chapterPositionInSeconds = Math.floor(chapterPosition * fullVideoLength);
	let inMinutes = Math.floor(chapterPositionInSeconds / 60);
	chapterPositionInSeconds = chapterPositionInSeconds % 60;
	let inHours = Math.floor(inMinutes / 60);
	inMinutes = inMinutes % 60;
	return `${pad(inHours)}:${pad(inMinutes)}:${pad(chapterPositionInSeconds)}`;
};
