// import {logger} from '../logging.coffee';

let messages = {
	default: "Saisir l'axe du profil sur la carte avec l'outil de dessin",
	pending: "Requête en cours ..."
};

let initialState = {
	visible: false,
	axis: undefined,
	profile: undefined,
	top: 100,
	left: 150,
	width: 400,
	height: 350,
	message: messages.default,
	status: 'idle'
};

export const elevationReducer = function(state = initialState, action) {

	switch (action.type) {
		case "elevation.show":
			return {
				...state,
				visible: true,
				initial_top: state.top,
				initial_left: state.left
			};
		case "elevation.close":
			return {
				...state,
				visible: false
			};
		case "elevation.toggle":
			return {
				...state,
				visible: !state.visible,
				initial_top: state.top,
				initial_left: state.left
			};
		case "elevation.clear":
			return {
				...state,
				axis: undefined,
				profile: undefined,
				message: messages.default,
				status: 'idle'
			};
		case "elevation.query":
			return {
				...state,
				axis: action.geometry,
				message: messages.pending,
				status: 'info'
			};
		case "elevation.set_profile":
			return {
				...state,
				profile: action.profile,
				message: undefined,
				status: 'idle'
			};
		case "elevation.message":
			return {
				...state,
				message: action.message,
				status: action.status
			};
		case 'elevation.resize':
			return {
				...state,
				width: action.size.width,
				height: action.size.height
			};
		case 'elevation.drag':
			return {
				...state,
				top: action.data.y,
				left: action.data.x
			};
		default:
			return state;
	}

}