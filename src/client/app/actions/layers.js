export function showLayer(layer_id) {
	return {
		type: showLayer.ACTION_TYPE,
		layer_id: layer_id
	};
}
showLayer.ACTION_TYPE = 'layer.show';

export function hideLayer(layer_id) {
	return {
		type: hideLayer.ACTION_TYPE,
		layer_id: layer_id
	};
}
hideLayer.ACTION_TYPE = 'layer.hide';

export function setLayerOpacity(layer_id, opacity) {
	return {
		type: setLayerOpacity.ACTION_TYPE,
		layer_id: layer_id
	};
}
setLayerOpacity.ACTION_TYPE = 'layer.set_opacity';

export function registerLayer(layer_id, options) {
	return {
		type: registerLayer.ACTION_TYPE,
		layer_id: layer_id,
		options: options
	};
}
registerLayer.ACTION_TYPE = 'layer.register';

export function setBaseLayer(layer_id) {
	return {
		type: setBaseLayer.ACTION_TYPE,
		layer_id: layer_id
	};
}
setBaseLayer.ACTION_TYPE = 'layer.show';