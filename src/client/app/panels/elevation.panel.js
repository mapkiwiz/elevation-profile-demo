import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {template} from './elevation.panel.rt';
// import {logger} from '../logging.coffee';
import L from 'leaflet';

let actions = {
	close: () => { return { type:  'elevation.close' }; },
	resize: (size) => { return { type: 'elevation.resize', size: size }},
	drag: (data) => { return { type: 'elevation.drag', data: data }; }
};

class _elevationProfilePanel extends React.Component {

	static contextTypes = {
		registry: React.PropTypes.object
	};

	constructor(props, context) {
		super(props, context);
	}

	componentDidMount() {
		this.actions = bindActionCreators(actions, this.props.dispatch);
	}

	getMap() {
		return this.context.registry.map;
	}
	
	worldToMapTransform() {
		var map = this.context.registry.map;
		return function(x,y) {
			return map.latLngToLayerPoint(new L.LatLng(y, x));
		};
	}

	close(event) {
		event.preventDefault();
		this.actions.close();
	}

	resize(size) {
		// logger.debug(size);
		this.actions.resize(size);
	}

	dragTo(position) {
		// logger.debug(position);
		// this.actions.drag(position);
	}

	render() {
		return template.call(this);
	}

}

export const ElevationProfilePanel =  connect((state, ownProps) => {
	return state.elevation;
})(_elevationProfilePanel);