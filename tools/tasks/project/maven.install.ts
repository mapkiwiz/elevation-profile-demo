import * as gulp from 'gulp';
const maven = require('gulp-maven-deploy');
const zip = require('gulp-zip');
const packageInfo = require('../../../package.json');
const argv = require('yargs').argv;

export = () => {
  gulp.src('./target/**/*')
    .pipe(zip(packageInfo.name + '.jar'))
    .pipe(maven.install({
          'groupId': argv['groupId'] || 'com.github.mapkiwiz',
          'artifactId': packageInfo.name,
          'version': argv['version'] || packageInfo.version
      })
    );
}
