import _ from 'lodash';
import fetch from 'isomorphic-fetch';
import parse from 'csv-parse';

function PostcodeGeocoder(code) {
  return PostcodeGeocoder.refs[code];
};
PostcodeGeocoder.refs = {};
PostcodeGeocoder.ready = false;

function rowToGeoJSON(header, row) {
  let properties = _.zipObject(header, row);
  return {
    type: 'Feature',
    id: properties.CODE_POSTAL,
    label: properties.COMMUNE,
    geometry: { type: 'Point', coordinates: [ +properties.LONGITUDE, +properties.LATITUDE ] },
    properties: _.omit(properties, [ 'LONGITUDE', 'LATITUDE' ])
  };
}

export function PostcodeGeocoderFactory(callback) {

  if (PostcodeGeocoder.ready) {
    callback(PostcodeGeocoder);
    return;
  }

  fetch('data/postcodes.csv').then(response => {
    if (response.status >= 400) throw new Error('Bad response');
    return response.text();
  }).then(data => {

    // Parse data as CSV with delimiter SEMICOLON
    parse(data, {delimiter: ';'}, (err, rows) => {
      // Skip header line
      let header = rows.shift();
      // Read rows
      _.each(rows, row => {
        let ref = rowToGeoJSON(header, row);
        PostcodeGeocoder.refs[ref.id] = ref;
      });
      console.log('PostcodeGeocoder data has loaded');
      PostcodeGeocoder.ready = true;
      callback(PostcodeGeocoder);
    });

  });
}

export function BatchPostcodeGeocoder(file, data, codedLocationProperty, callback) {

  PostcodeGeocoderFactory(geocoder => {

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
