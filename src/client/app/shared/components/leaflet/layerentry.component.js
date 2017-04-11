import React from 'react';
import {showLayer, hideLayer, setBaseLayer} from '../../../actions/layers';
// import {logger} from '../../../logging.coffee';

export class LayerEntry extends React.Component {

    static contextTypes = {
        store: React.PropTypes.object,
        registry: React.PropTypes.object
    };

    constructor(props, context) {
        super(props, context);
        this.state = this.context.store.getState().layers.layers[this.props.id];
    }

    componentDidMount() {
        this.unsubscribe = this.context.store.subscribe(() => {
            let current_state = this.context.store.getState().layers.layers[this.props.id];
            if (this.state !== current_state) {
                if (this.state.visible !== current_state.visible) {
                    if (current_state.visible) {
                        this.context.registry.showLayer(this.props.id);
                    } else {
                        this.context.registry.hideLayer(this.props.id);
                    }
                }
                if (this.state.opacity !== current_state.opacity) {
                    this.context.registry.setLayerOpacity(this.props.id, current_state.opacity);
                }
                this.setState(current_state);
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    select(e) {
        e.preventDefault();
        // this.props.onSelect(this.props.value);
        if (this.props.baselayer) {
            this.context.store.dispatch(setBaseLayer(this.props.id));
        } else {
            this.context.store.dispatch(showLayer(this.props.id));
        }
    }

    unselect(e) {
        e.preventDefault();
        this.context.store.dispatch(hideLayer(this.props.id));
    }

    render() {
        if (this.state.visible) {
            return (
                <li className='selected' onClick={(e) => this.unselect(e)} >
                    {this.props.title}
                    &nbsp;
                    <span className="glyphicon glyphicon-ok"></span>
                </li>
            );
        } else {
            return (
                <li onClick={(e) => this.select(e)} >
                    {this.props.title}
                </li>
            );
        }
    }

}