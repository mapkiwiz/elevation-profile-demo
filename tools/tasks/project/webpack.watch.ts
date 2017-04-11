const config = require('../../../webpack.config');

export = (done: any) => {
  config.watch = true;
  done();
};
