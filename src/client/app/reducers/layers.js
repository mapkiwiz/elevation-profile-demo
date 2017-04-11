let baselayer_group = '__baselayers__';
let overlay_group = '__overlay__';

let initialLayerState = {
	opacity: 1.0,
	visible: true,
	baselayer: false
};

let initialGroupState = {
	visible: true,
	visible_layer: undefined,
	exclusive: true
}

let initialState = {
	groups: {
		[baselayer_group]: {
			...initialGroupState,
			exclusive: true,
			layers: []
		},
		[overlay_group]: {
			...initialGroupState,
			layers: []
		}
	},
	layers: {},
	tree: [ baselayer_group, overlay_group ],
	activelayer: undefined
};

function setLayerVisibility(state, layer_id, visible) {

	let group = state.layers[layer_id].group;

	return {
			...state,
			layers: {
				...state.layers,
				[layer_id]: {
					...state.layers[layer_id],
					visible: visible
				}
			},
			groups: {
				...state.groups,
				[group]: {
					...state.groups[group],
					visible_layer: (visible) ? layer_id : undefined
				}
			}
		};

}

function toggleGroupLayer(state, layer_id) {

	let group = state.layers[layer_id].group;
	let visible_layer_id = state.groups[group].visible_layer;

	if (visible_layer_id === layer_id) {

		return state;

	} else if (visible_layer_id === undefined) {

		return {
			...state,
			layers: {
				...state.layers,
				[layer_id]: {
					...state.layers[layer_id],
					visible: true
				},
			},
			groups: {
				...state.groups,
				[group]: {
					...state.groups[group],
					visible_layer: layer_id
				}
			}
		};

	} else {

		return {
			...state,
			layers: {
				...state.layers,
				[visible_layer_id]: {
					...state.layers[visible_layer_id],
					visible: false
				},
				[layer_id]: {
					...state.layers[layer_id],
					visible: true
				},
			},
			groups: {
				...state.groups,
				[group]: {
					...state.groups[group],
					visible_layer: layer_id
				}
			}
		};

	}
}

function isLayerGroupExclusive(state, layer_id) {

	let group = state.layers[layer_id].group;
	return state.groups[group].exclusive;

}

export function layerStatusReducer(state = initialState, action) {
	
	let current_layer_state;
	let new_state;
	let group;
	let current_layer_id;
	let baselayer_current_id;

	switch (action.type) {
		
		case 'layer.register':
		
			baselayer_current_id = state.groups[baselayer_group].visible_layer;
			if (action.options.baselayer) {
				if (baselayer_current_id === undefined) {
					state.groups[baselayer_group].visible_layer = action.layer_id;
				} else {
					action.options.visible = false;
				}
				group = baselayer_group;
			} else {
				group = action.group || overlay_group;
			}
			if (!state.groups.hasOwnProperty(group)) {
				group = overlay_group;
			}
			new_state = {
				...state,
				layers: {
					...state.layers,
					[action.layer_id]: {
						...initialLayerState,
						...action.options,
						group: group
					}
				}
			};
			new_state.groups[group].layers.push(action.layer_id);
			return new_state;

		case 'layer.show':
			
			if (isLayerGroupExclusive(state, action.layer_id)) {
				return toggleGroupLayer(state, action.layer_id);
			} else {
				return setLayerVisibility(state, action.layer_id, true);
			}

		case 'layer.hide':
			// current_layer_state = state.layers[action.layer_id];
			// baselayer_current_id = state.groups[baselayer_group].visible_layer;
			// if (baselayer_current_id === action.layer_id) {
			// 	return state;
			// }
			return setLayerVisibility(state, action.layer_id, false);

		case 'layer.set_opacity':
		
			current_layer_state = state.layers[action.layer_id];
			return {
				...state,
				layers: {
					...state.layers,
					[action.layer_id]: {
						...current_layer_state,
						opacity: action.opacity
					}
				}
			};

		case 'layer.set_baselayer': // LAYER_SET_BASELAYER
			
			return toggleGroupLayer(state, action.layer_id);

		default:
			return state;
	}
}