import {MeasureControl} from '../../lib/Leaflet.MeasureLine/index.coffee'
import {logger} from '../logging.coffee'
import L from 'leaflet'
import fetch from 'isomorphic-fetch'

factory = (map, dispatch) ->

    control = new MeasureControl
        handler:
            metric: true
            feet: false

    control.addTo map

    onCreated = (e) ->
      
      dispatch
        type: 'elevation.query'
        geometry: e.layer.toGeoJSON().geometry
      
      dispatch (dispatch) ->
        fetch 'https://api.mapkiwiz.fr/api/v1/elevation',
            method: 'POST'
            headers:
              'Content-Type': 'application/json'
            body: JSON.stringify
                query: e.layer.toGeoJSON().geometry
        .then (response) ->
            response.json()
        .then (profile) ->
            logger.debug profile
            dispatch
                type: 'elevation.set_profile'
                profile: profile
        .catch (error) ->
            logger.error error
            dispatch
                type: 'elevation.message'
                message: "Une erreur est survenue lors de l'interrogation du service distant : #{error}"
                status: 'error'
    
    map.on L.Draw.Event.CREATED, onCreated, map

    onHandlerReset = (e) ->
      dispatch
        type: 'elevation.clear'

    control.handler.on 'draw:reset', onHandlerReset, map
    control.handler.on 'disabled', onHandlerReset, map

    return control

root = exports ? window
root.elevationControlFactory = factory