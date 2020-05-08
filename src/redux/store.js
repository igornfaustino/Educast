import { createStore } from 'redux';

const initialState = {
	video: {
		duration: 10,
		currentTime: 0,
	},
};

const videoReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_CURRENT_TIME':
			return Object.assign({}, state, {
				video: {
					...state.video,
					currentTime: action.currentTime,
				},
			});
		case 'SET_DURATION':
			return Object.assign({}, state, {
				video: {
					...state.video,
					duration: action.duration,
				},
			});
		default:
			return state;
	}
};

export const store = createStore(
	videoReducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
