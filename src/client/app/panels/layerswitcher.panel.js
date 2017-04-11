import React from 'react';
import {MenuLink} from './menu.link';
import {LayerSwitcher} from '../shared/components/leaflet/layerswitcher.component';

export function LayerSwitcherPanel(props, context) {
  let baselayers = [
    'stamen-toner-lite',
    'bd-ortho-ign'
  ];
  let overlays = [
    'style_fluvial',
    'edh'
  ];
  return (
    <div className="col-md-4 col-md-offset-8 panel-container">
      <h3>
        Affichage
        <MenuLink />
      </h3>
      <hr/>
      <div>
        <LayerSwitcher title={'Données'} layers={overlays} />
        <LayerSwitcher title={'Fonds de plan'} layers={baselayers} />
      </div>
    </div>
  );
}
