import {combineReducers} from 'redux';
import {viewReducer} from './view';
import {layerStatusReducer} from './layers';
import {elevationReducer} from './elevation';

let reducer = combineReducers({
  view: viewReducer,
  layers: layerStatusReducer,
  elevation: elevationReducer
});

export {reducer};
