const path = require('path');

const DIST_DIR = "dist";
const DEV_DEST = "dist/dev";
const PROD_DEST = "dist/prod";
const TMP_DIR = "dist/tmp";
const TOOLS_DIR = "tools";
const SEED_TASKS_DIR = path.join(process.cwd(), this.TOOLS_DIR, 'tasks', 'seed');
const PROJECT_TASKS_DIR = path.join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

export { DIST_DIR, DEV_DEST, PROD_DEST, TMP_DIR, TOOLS_DIR, SEED_TASKS_DIR, PROJECT_TASKS_DIR };
