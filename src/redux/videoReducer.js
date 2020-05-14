const initialState = {
	duration: 10,
	currentTime: 0,
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
		default:
			return state;
	}
};
