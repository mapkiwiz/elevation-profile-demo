import * as gulp from 'gulp';
import {DEV_DEST} from '../../config';
const packageInfo = require('../../../package.json');
const argv = require('yargs').argv;

export = () => {
  let version = argv['version'] || packageInfo.version;
  return gulp.src(DEV_DEST + '/**/*')
    .pipe(gulp.dest('target/META-INF/resources/webjars/' + packageInfo.name + '/' + version));
}
