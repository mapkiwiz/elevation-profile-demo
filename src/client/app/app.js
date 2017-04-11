import React from 'react';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import {MapContainer} from './map';
import {MenuPanel} from './panels/menu.panel';
import {LayerSwitcherPanel} from './panels/layerswitcher.panel';
import {AboutPanel} from './panels/about.panel';
import {LayerRegistry} from './shared/components/leaflet/layerregistry';
import {ElevationProfilePanel} from './panels/elevation.panel.js';

function RootPanel(props, context) {
  return (
    <div className="container-fluid root-panel">
      <div className="row" style={{ width: '100%' }}>
          <Route exact path="/" component={ MenuPanel } />
          <Route path="/layers" component={ LayerSwitcherPanel } />
          <Route path="/about" component={ AboutPanel } />
      </div>
    </div>
  );
}

export class App extends React.Component {

  static propTypes = {
    messenger: React.PropTypes.object
  };

  static childContextTypes = {
    messenger: React.PropTypes.object,
    registry: React.PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.registry = new LayerRegistry();
  }

  getChildContext() {
    return {
      messenger: this.props.messenger,
      registry: this.registry
    };
  }

  render() {
    return (
      <div>
        <MapContainer />
        <Router >
          <Route path="/" component={ RootPanel } />
        </Router>
        <ElevationProfilePanel title='Profil en travers'>
        </ElevationProfilePanel>
      </div>
    );
  }

}
