const initialState = {
	duration: 10,
	currentTime: 0,
	isReady: false,
	isPlaying: false,
};

export const videoReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_CURRENT_TIME':
			return Object.assign({}, state, {
				currentTime: action.currentTime,
			});
		case 'SET_DURATION':
			return Object.assign({}, state, {
				duration: action.duration,
			});
		case 'SET_IS_READY':
			return Object.assign({}, state, {
				isReady: action.isReady,
			});
		case 'SET_IS_PLAYING':
			return Object.assign({}, state, {
				isPlaying: action.isPlaying,
			});
		default:
			return state;
	}
};
