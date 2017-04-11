import L from 'leaflet'
import LeafletDraw from 'leaflet-draw'
require './index.css'

L.Polyline.Measure = L.Draw.Polyline.extend
    
    addHooks: ->

        L.Draw.Polyline.prototype.addHooks.call(this)

        if @_map
            @_markerGroup = new L.LayerGroup()
            @_map.addLayer @_markerGroup
            @_markers = []
            @_map.doubleClickZoom.disable()
            @_map.on 'click', @_onClick, this
            @_startShape()

        return

    removeHooks: ->

        L.Draw.Polyline.prototype.removeHooks.call(this);
        @_clearHideErrorTimeout()

        # !\ Still useful when control is disabled before any drawing (refactor needed?)
        @_map
        .off 'pointermove', @_onMouseMove, this
        .off 'mousemove', @_onMouseMove, this
        .off 'click', @_onClick, this

        @_clearGuides()
        @_container.style.cursor = ''
        @_removeShape()
        @_map.doubleClickZoom.enable()

        return

    _onMouseMove: (e) ->

        if @_drawing
            L.Draw.Polyline.prototype._onMouseMove.call this, e
        return

    _startShape: ->

        @_drawing = true
        @_poly = new L.Polyline [], @options.shapeOptions
        # this is added as a placeholder, if leaflet doesn't recieve
        # this when the tool is turned off all onclick events are removed
        @_poly._onClick = ->
            return
        @_container.style.cursor = 'crosshair'
        @_updateTooltip()
        @_map
        .on 'pointermove', @_onMouseMove, this
        .on 'mousemove', @_onMouseMove, this
        
        return

    _finishShape: ->

        @_drawing = false
        @_cleanUpShape()
        @_clearGuides()
        @_updateTooltip()
        @_fireCreatedEvent()
        @_map
        .off 'pointermove', @_onMouseMove, this
        .off 'mousemove', @_onMouseMove, this
        @_container.style.cursor = ''

        # console.log('Done finish shape ...')
        
        return

    _removeShape: ->

        if !@_poly
            return

        @_map.removeLayer @_poly
        delete @_poly
        @_markers.splice 0
        @_markerGroup.clearLayers()
        
        return

    _onClick: ->

        if !@_drawing
            @_removeShape()
            @_startShape()
            @fire('draw:reset', {});
        
        return

    _getTooltipText: ->
      
        labelText = L.Draw.Polyline.prototype._getTooltipText.call this
        if !@_drawing
            labelText.text = ''
        labelText

L.Control.MeasureControl = L.Control.extend

    statics:
        TITLE: 'Measure distances'

    options:
        position: 'topleft'
        handler: {}

    toggle: ->
        if @handler.enabled()
            @handler.disable.call @handler
        else
            @handler.enable.call @handler

    onAdd: (map) ->
      
        link = null
        className = 'leaflet-control-draw'
        @_container = L.DomUtil.create 'div', 'leaflet-bar'
        @handler = new L.Polyline.Measure map, @options.handler

        on_enabled = ->
            @enabled = true
            L.DomUtil.addClass @_container, 'enabled'
            return
        @handler.on 'enabled',  on_enabled, this

        on_disabled = ->
            delete @enabled
            L.DomUtil.removeClass @_container, 'enabled'
            return
        @handler.on 'disabled', on_disabled, this

        link = L.DomUtil.create 'a', className + '-measure', @_container
        link.href = '#'
        link.title = L.Control.MeasureControl.TITLE

        L.DomEvent
        .addListener link, 'click', L.DomEvent.stopPropagation
        .addListener link, 'click', L.DomEvent.preventDefault
        .addListener link, 'click', @toggle, this

        @_container

L.Map.mergeOptions
    
    measureControl: false

L.Map.addInitHook ->

    if @options.measureControl
        @measureControl = L.Control.measureControl().addTo(this)
    return

L.Control.measureControl = (options) ->
    
    new L.Control.MeasureControl options

# http://stackoverflow.com/questions/4214731/how-do-i-define-global-variables-in-coffeescript
root = exports ? this
root.PolylineMeasureHandler = L.Polyline.Measure
root.MeasureControl = L.Control.MeasureControl