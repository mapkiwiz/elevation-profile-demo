import * as gulp from 'gulp';
import * as runSequence from 'run-sequence';
import {loadTasks} from './tools/utils';
import {SEED_TASKS_DIR, PROJECT_TASKS_DIR, TMP_DIR} from './tools/config';

loadTasks(SEED_TASKS_DIR);
loadTasks(PROJECT_TASKS_DIR);

gulp.task('clean', (done: any) => {
  runSequence(
    'clean.target',
    'clean.dev',
    'clean.prod',
    done
  );
});

gulp.task('maven.install.prod', (done: any) => {
  runSequence(
    'clean.target',
    'clean.prod',
    'webpack.prod',
    'maven.copy.prod',
    'maven.install',
    done);
});
