import { createStore, combineReducers } from 'redux';
import { videoReducer } from './videoReducer';
import { timelineReducer } from './timelineReducer';
import { sceneAndChaptersReducer } from './scenesAndChaptersReducer';

export const store = createStore(
	combineReducers({
		video: videoReducer,
		timeline: timelineReducer,
		sceneChapters: sceneAndChaptersReducer,
	}),
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
