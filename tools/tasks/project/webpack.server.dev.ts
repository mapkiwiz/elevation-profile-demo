const gutil = require('gulp-util');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../../../webpack.config');

export = () => {

  let options = {
    contentBase: 'dist/dev',
    colors: true,
    progress: true,
    watch: true,
    stats: {
      colors: true,
      progress: true
    }
  };

  new WebpackDevServer(webpack(config), options)
    .listen(
      config.devServer.port,
      config.devServer.host,
      (err: any) => {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        // Server listening
        gutil.log(
          "[webpack-dev-server]",
          "http://" + config.devServer.host + ":" + config.devServer.port + "/webpack-dev-server/index.html");

        // keep the server alive or continue?
        // callback();

      });

};
