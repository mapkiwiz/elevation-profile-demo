import L from 'leaflet';
import fetch from 'isomorphic-fetch';

let VecTileLayer = L.TileLayer.extend({

        onAdd: function(map) {
            var self = this;
            L.TileLayer.prototype.onAdd.call(this, map);
            this.container = L.featureGroup().addTo(map);
            this.on("tileunload", function(d) {
                if (d.tile.xhr) {
                    d.tile.xhr.abort();
                    d.tile.xhr = null;
                }
                if (d.tile.featureGroup) {
                    // d.tile.featureGroup.getLayers().forEach(function(layer) {
                    //     d.tile.featureGroup.removeLayer(layer);
                    // });
                    self.container.removeLayer(d.tile.featureGroup);
                    d.tile.featureGroup = null;
                }
            });
        },

        _loadTile: function(tile, tilePoint) {
            var url, self = this;
            this._adjustTilePoint(tilePoint);
            url = this.getTileUrl(tilePoint);
            if (!tile.xhr) {
                tile.xhr = fetch(url).then(response => {
                  if (response.status >= 400) throw new Error('Bad response');
                  return response.json();
                }).then(data => {
                    tile.featureGroup = L.geoJson(data, {
                        style: function(feature) {
                          return {
                            weight: 2,
                            color: '#f00'
                          }
                        },
                        onEachFeature: function(feature, marker) {
                            if (self.options.onEachFeature) {
                                self.options.onEachFeature.apply(this, [feature, marker]);
                            }
                        }
                    });
                    tile.featureGroup.addTo(self.container);
                    tile.xhr = null;
                });
            }
        }

    });

L.vectileLayer = function(template_url, options) {
    var layer = new VecTileLayer(template_url, options);
    return layer;
};

exports = VecTileLayer;

