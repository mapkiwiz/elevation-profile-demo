import React from 'react';
import {LayerEntry} from './layerentry.component';

export class LayerSwitcher extends React.Component {

    static contextTypes = {
        store: React.PropTypes.object,
        registry: React.PropTypes.object
    };

    // componentDidMount() {
    //     let registry = this.context.registry;
    //     if (registry.baselayers) {
    //       this.context.store.dispatch(showLayer(registry.baselayers[0]));
    //     }
    //     registry.overlays.forEach(key => {
    //       // console.log(key);
    //       // console.log(this.layers[key]);
    //       this.context.store.dispatch(showLayer(key));
    //     });
    // }

    render() {
        let items = this.props.layers.map((layer_id) => {
                let layer = this.context.registry.layers[layer_id];
                if (layer !== undefined) {
                    return (
                        <LayerEntry key={layer_id} id={layer.options.id} title={layer.options.title} baselayer={layer.options.baselayer} />
                    );
                } else {
                    return null;
                }
            });
        return (
            <div>
                <h4>{this.props.title}</h4>
                <ul className="list">
                    {items}
                </ul>
            </div>
        );
    }

}