import L from 'leaflet';

let Popover = (L.Layer ? L.Layer : L.Class).extend({

  includes: L.Mixin.Events,

  options: {
    className: '',
    clickable: false,
    closeable: false,
    direction: 'right',
    noHide: false,
    offset: {
      left: 8,
      right: 8,
      top: -28,
      bottom: 0 },
    opacity: 1,
    zoomAnimation: true
  },

  initialize: function (options, source) {
    L.setOptions(this, options);

    this._source = source;
    this._animated = L.Browser.any3d && this.options.zoomAnimation;
    this._isOpen = false;

    if (options.closeable) {
      this.options.clickable = true;
      this.on("click", this.close);
    }

  },

  addTo: function(map) {
    map.addLayer(this);
  },

  onAdd: function (map) {
    this._map = map;

    this._pane = this.options.pane ? map._panes[this.options.pane] :
      this._source instanceof L.Marker ? map._panes.markerPane : map._panes.popupPane;

    if (!this._container) {
      this._initLayout();
    }

    this._pane.appendChild(this._container);

    this._initInteraction();

    this._update();

    this.setOpacity(this.options.opacity);

    map
      .on('moveend', this._onMoveEnd, this)
      .on('viewreset', this._onViewReset, this);

    if (this._animated) {
      map.on('zoomanim', this._zoomAnimation, this);
    }

    if (L.Browser.touch && !this.options.noHide) {
      L.DomEvent.on(this._container, 'click', this.close, this);
      map.on('click', this.close, this);
    }
  },

  onRemove: function (map) {
    this._pane.removeChild(this._container);

    map.off({
      zoomanim: this._zoomAnimation,
      moveend: this._onMoveEnd,
      viewreset: this._onViewReset
    }, this);

    this._removeInteraction();

    this._map = null;
  },

  setLatLng: function (latlng) {
    this._latlng = L.latLng(latlng);
    if (this._map) {
      this._updatePosition();
    }
    return this;
  },

  setTitle: function(title) {
    this._title = title;
  },

  setContent: function (content) {
    // Backup previous content and store new content
    this._previousContent = this._content;
    this._content = content;

    this._updateContent();

    return this;
  },

  close: function () {
    var map = this._map;

    if (map) {
      if (L.Browser.touch && !this.options.noHide) {
        L.DomEvent.off(this._container, 'click', this.close);
        map.off('click', this.close, this);
      }

      map.removeLayer(this);
    }
  },

  updateZIndex: function (zIndex) {
    this._zIndex = zIndex;

    if (this._container && this._zIndex) {
      this._container.style.zIndex = zIndex;
    }
  },

  setOpacity: function (opacity) {
    this.options.opacity = opacity;

    if (this._container) {
      L.DomUtil.setOpacity(this._container, opacity);
    }
  },

  _initLayout: function () {
    this._container = L.DomUtil.create('div', 'leaflet-popover popover ' + this.options.direction + ' ' + this.options.className + ' leaflet-zoom-animated');
    L.DomUtil.create('div', 'arrow', this._container);
    this._titleNode = L.DomUtil.create('h3', 'popover-title', this._container);
    this._contentNode = L.DomUtil.create('div', 'popover-content', this._container);
    this.updateZIndex(this._zIndex);
  },

  _update: function () {
    if (!this._map) { return; }

    this._container.style.visibility = 'hidden';

    this._updateContent();
    this._updatePosition();

    this._container.style.visibility = '';
  },

  _updateContent: function () {
    if (!this._content || !this._map || this._prevContent === this._content) {
      return;
    }

    if (typeof this._content === 'string') {

      if (typeof this._title === 'string') {
        if (this.options.closeable) {
          this._titleNode.innerHTML =
            '<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
            this._title;
        } else {
          this._titleNode.innerHTML = this._title;
        }
        this._titleNode.style.visibility = '';
      } else {
        this._titleNode.style.visibility = 'hidden';
      }

      this._contentNode.innerHTML = this._content;

      this._prevContent = this._content;

      this._labelWidth = this._container.offsetWidth;
      this._labelHeight = this._container.offsetHeight;

    }
  },

  _updatePosition: function () {
    var pos = this._map.latLngToLayerPoint(this._latlng);

    this._setPosition(pos);
  },

  _setPosition: function (pos) {
    var map = this._map,
      container = this._container,
      centerPoint = map.latLngToContainerPoint(map.getCenter()),
      labelPoint = map.layerPointToContainerPoint(pos),
      direction = this.options.direction,
      labelWidth = this._labelWidth,
      labelHeight = this._labelHeight,
      offset = this.options.offset;

    // position to the right (right or auto & needs to)
    // if (direction === 'right' || direction === 'auto' && labelPoint.x < centerPoint.x) {
    // 	L.DomUtil.addClass(container, 'leaflet-label-right');
    // 	L.DomUtil.removeClass(container, 'leaflet-label-left');

    // 	pos = pos.add(offset);
    // } else { // position to the left
    // 	L.DomUtil.addClass(container, 'leaflet-label-left');
    // 	L.DomUtil.removeClass(container, 'leaflet-label-right');

    // 	pos = pos.add(L.point(-offset.x - labelWidth / 2, offset.y - labelHeight));
    // }

    switch (direction) {
      case 'auto':
      case 'left':
        pos = pos.add(L.point(-offset.left - labelWidth, offset.top - labelHeight / 2));
        break;
      case 'right':
        pos = pos.add(L.point(offset.right, offset.top - labelHeight / 2));
        break;
      case 'top':
        pos = pos.add(L.point(-labelWidth / 2, offset.top - labelHeight));
        break;
      case 'bottom':
        pos = pos.add(L.point(-labelWidth / 2, offset.bottom));
        break;
    };

    L.DomUtil.setPosition(container, pos);
  },

  _zoomAnimation: function (opt) {
    var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();

    this._setPosition(pos);
  },

  _onMoveEnd: function () {
    if (!this._animated || this.options.direction === 'auto') {
      this._updatePosition();
    }
  },

  _onViewReset: function (e) {
    /* if map resets hard, we must update the label */
    if (e && e.hard) {
      this._update();
    }
  },

  _initInteraction: function () {
    if (!this.options.clickable) { return; }

    var container = this._container,
      events = ['dblclick', 'mousedown', 'mouseover', 'mouseout', 'contextmenu'];

    L.DomUtil.addClass(container, 'leaflet-clickable');
    L.DomEvent.on(container, 'click', this._onMouseClick, this);

    for (var i = 0; i < events.length; i++) {
      L.DomEvent.on(container, events[i], this._fireMouseEvent, this);
    }
  },

  _removeInteraction: function () {
    if (!this.options.clickable) { return; }

    var container = this._container,
      events = ['dblclick', 'mousedown', 'mouseover', 'mouseout', 'contextmenu'];

    L.DomUtil.removeClass(container, 'leaflet-clickable');
    L.DomEvent.off(container, 'click', this._onMouseClick, this);

    for (var i = 0; i < events.length; i++) {
      L.DomEvent.off(container, events[i], this._fireMouseEvent, this);
    }
  },

  _onMouseClick: function (e) {
    if (this.hasEventListeners(e.type)) {
      L.DomEvent.stopPropagation(e);
    }

    this.fire(e.type, {
      originalEvent: e
    });
  },

  _fireMouseEvent: function (e) {
    this.fire(e.type, {
      originalEvent: e
    });

    // TODO proper custom event propagation
    // this line will always be called if marker is in a FeatureGroup
    if (e.type === 'contextmenu' && this.hasEventListeners(e.type)) {
      L.DomEvent.preventDefault(e);
    }
    if (e.type !== 'mousedown') {
      L.DomEvent.stopPropagation(e);
    } else {
      L.DomEvent.preventDefault(e);
    }
  }
});

L.Popover = Popover;

export {Popover};
