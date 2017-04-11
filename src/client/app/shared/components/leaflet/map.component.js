import React from 'react';
import Leaflet from 'leaflet';
import {showLayer, hideLayer, setBaseLayer} from '../../../actions/layers';

Leaflet.Icon.Default.imagePath = 'images';

export class Map extends React.Component {

  map;

  static propTypes = {
    id: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    view: React.PropTypes.shape({
        center: React.PropTypes.arrayOf(React.PropTypes.number),
        zoom: React.PropTypes.number
      }).isRequired
  };

  static contextTypes = {
    store: React.PropTypes.object,
    registry: React.PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      view: this.props.view
    };
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    this.map = Leaflet.map(this.props.id).setView(this.state.view.center, this.state.view.zoom);
    let registry = this.context.registry;
    let layer_status = this.context.store.getState().layers.layers;
    registry.addTo(this.map);
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return (
      <div id={ this.props.id } className={ this.props.className } >
        { this.props.children }
      </div>
    );
  }

}
