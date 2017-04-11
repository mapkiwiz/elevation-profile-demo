import * as gulp from 'gulp';
import {PROD_DEST} from '../../config';
const packageInfo = require('../../../package.json');
const argv = require('yargs').argv;

export = () => {
  let version = argv['version'] || packageInfo.version;
  return gulp.src(PROD_DEST + '/**/*')
    .pipe(gulp.dest('target/META-INF/resources/webjars/' + packageInfo.name + '/' + version));
}
