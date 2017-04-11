let initialState = {
	center: [44.2906, 4.842],
	zoom: 12
};

export function viewReducer(state = initialState, action) {
	switch (action.type) {
		case 'VIEW_MOVE_TO':
			return {
				center: action.center,
				zoom: state.zoom
			};
		case 'VIEW_ZOOM_TO':
			return {
				center: action.center,
				zoom: action.zoom
			};
		default:
			return state;
	}
}