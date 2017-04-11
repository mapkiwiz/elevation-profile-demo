import _ from 'lodash';
import fetch from 'isomorphic-fetch';

function CommuneGeocoder(code) {
  return CommuneGeocoder.refs[code];
};

CommuneGeocoder.refs = {};
CommuneGeocoder.ready = false;

export function CommuneGeocoderFactory(callback) {

  if (CommuneGeocoder.ready) {
    callback(CommuneGeocoder);
    return;
  }

  fetch('data/communes_fla_p.geojson').then(response => {
    if (response.status >= 400) throw new Error('Bad response');
    return response.json();
  }).then(data => {
    _.each(data.features, ref => {
      ref.id = ref.properties.INSEE_COM;
      CommuneGeocoder.refs[ref.id] = ref;
    });
  }).then(() => {
    console.log('CommuneGeocoder data has loaded');
    CommuneGeocoder.ready = true;
  }).then(() => {
    callback(CommuneGeocoder);
  });

}

export function BatchCommuneGeocoder(file, data, codedLocationProperty, callback) {

  CommuneGeocoderFactory(geocoder => {

    let geocoded_items = _.map(data, item => {
      let code = item[codedLocationProperty];
      let location = geocoder(code);
      return {
        ...item,
        location: location
      };
    });

    callback(geocoded_items);

  });

}
