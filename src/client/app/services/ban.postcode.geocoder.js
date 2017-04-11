import {config} from '../../config/index';
import URLSearchParams from 'url-search-params';
import fetch from 'isomorphic-fetch';
import _ from 'lodash';

let url = config.ban.url;

export function geocoder(key, postcode, city) {

  let params = new URLSearchParams();
  params.set('postcode', postcode);
  params.set('q', city);
  
  return fetch(url + "?" + params.toString()).then(response => {
    if (response.status >= 400) throw new Error('Bad Response');
    return response.json();
  }).then(data => {
    let value = _.find(data.features, o => {
      return o.properties.type == 'village' ||
        o.properties.type == 'town' ||
        o.properties.type == 'city';
    });
    return { key: key, value: value};
  });

  // TODO catch error

}
