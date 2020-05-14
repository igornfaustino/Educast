const initialState = {
	scrollLeft: 0,
	visibleArea: 0,
};

export const timelineReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_SCROLL_LEFT':
			return Object.assign({}, state, {
				scrollLeft: action.scrollLeft,
			});
		case 'SET_VISIBLE_AREA':
			return Object.assign({}, state, {
				visibleArea: action.visibleArea,
			});
		default:
			return state;
	}
};
