import {logger} from '../../../logging.coffee';

export class LayerRegistry {

  map;
  layers = {};
  baselayers = [];
  overlays = [];

  addLayer(key, layer) {
    this.layers[key] = layer;
    if (layer.options.baselayer === true) {
      this.baselayers.push(key)
    } else {
      this.overlays.push(key);
    }
  }

  addTo(map) {
    this.map = map;
  }

  showLayer(key) {
    // TODO handle group
    let layer = this.layers[key];
    logger.debug('Display layer ' + key);
    this.map.addLayer(layer);
    if (layer.options.baselayer === true) {
      layer.bringToBack();
    }
  }

  hideLayer(key) {
    // TODO handle group
    this.map.removeLayer(this.layers[key]);
    logger.debug('Hide layer ' + key);
  }

  setLayerOpacity(key, opacity) {
    this.layers[key].setOpacity(opacity);
  }

}