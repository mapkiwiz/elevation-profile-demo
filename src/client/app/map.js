import React from 'react';
import {Map} from './shared/components/leaflet/map.component';
import L from 'leaflet';
import {registerLayer, showLayer} from './actions/layers';
import _ from 'lodash';
import {layers} from '../layers';
import {logger} from './logging.coffee';
import {elevationControlFactory} from './tools/elevation.coffee';
import {mapboxGL} from '../lib/Leaflet.MapBoxGL';
import {WMTSLayer} from '../lib/Leaflet.WMTS';
import {Html5History} from '../lib/Leaflet.Html5History';
import {VisualClick} from '../lib/Leaflet.VisualClick';

export class MapContainer extends React.Component {

  static contextTypes = {
    store: React.PropTypes.object,
    registry: React.PropTypes.object
  };

  _configureLayer(config, initial_state, baselayer) {

    let layer = undefined, options, url;
    options = Object.assign(config, initial_state, { baselayer: baselayer });
    
    switch (config.type) {

      case 'xyz':
        options = _.omit(options, [ 'tiles', 'bounds', 'center', 'visible' ]);
        url = config.tiles[0];
        layer = L.tileLayer(url, options);
        break;

      case 'wmts':
        options = _.omit(options, [ 'url', 'visible' ]);
        // options.crs = options.crs || Leaflet.CRS.EPSG3857;
        url = L.Util.template(config.url, options);
        logger.debug(url);
        layer = L.tileLayer.wmts(url, options);
        break;

      case 'gl':
        layer = mapboxGL({
          id: config.id,
          title: config.title,
          style: config.style,
          accessToken: config.accessToken,
          attribution: config.attribution
        });
        logger.debug(layer);
        break;

      default:
        break;

    }

    this.registerLayer(layer, initial_state, baselayer);

    return layer;

  }

  registerLayer(layer, initial_state, baselayer) {

    if (layer !== undefined) {
      this.context.registry.addLayer(layer.options.id, layer);
      this.context.store.dispatch(registerLayer(layer.options.id,
        {
          baselayer: baselayer,
          visible: initial_state.visible
        })
      );
    }

  }

  configureBaseLayer(config, initial_state) {

    return this._configureLayer(config, initial_state, true);

  }

  configureLayer(config, initial_state) {

    return this._configureLayer(config, initial_state, false);

  }

  showVisibleLayers() {

    let registry = this.context.registry;
    let layer_status = this.context.store.getState().layers.layers;

    registry.baselayers.some(key => {
      if (layer_status[key].visible) {
        this.context.store.dispatch(showLayer(key));
        registry.showLayer(key);
        return true;
      } else {
        return false;
      }
    });

    registry.overlays.forEach(key => {
      if (layer_status[key].visible) {
        this.context.store.dispatch(showLayer(key));
        registry.showLayer(key);
      }
    });

  }

  configureLayers() {

    layers.baselayers.forEach((layer) => {
      this.configureBaseLayer(layer.config, layer.state);
    });

    layers.overlays.forEach((layer) => {
      this.configureLayer(layer.config, layer.state);
    });

  }

  configureControls(map) {

    let control = elevationControlFactory(map, this.context.store.dispatch);
    let history = new Html5History();
    history.addTo(map);

  }

  componentDidMount() {
    let map = this.context.registry.map;
    this.configureLayers();
    this.configureControls(map);
    this.showVisibleLayers();
  }

  componentWillUnmount() {

  }

  render() {
    let view = this.context.store.getState().view;
    return (
      <Map id="map" className="full-screen-map" view={{ ...view }}>
      </Map>
    );
  }

}