import * as config_default from './config.default';

let config;

if (process.env.NODE_ENV == 'production') {
  let config_prod = require('./config.prod');
  config = Object.assign({}, config_default, config_prod);
} else {
  let config_dev = require('./config.dev');
  config = Object.assign({}, config_default, config_dev);
}

export {config};
