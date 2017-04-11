import {generateUniqueProjectId} from '../shared/project';

let initialState = {
  id: generateUniqueProjectId(),
  title: '',
  description: '',
  settings: {
    'export.region.key': 'REGION',
    'export.enquete.key': 'ENQUETE',
    'export.orge.delimiter': ';'
  },
  defaults: {
    'worker.capacity': 20,
    'worker.reach': 20000,
    'worker.reach.type': 'distance_m'
  }
};

export function projectReducer(state = initialState, action) {
  switch (action.type) {
    case 'PROJECT_DESCRIBE':
          return { ...state,
            project: {
              title: action.title || state.project.title,
              description: action.description || state.project.description
            }
          };
    case 'PROJECT_SET_DEFAULTS':
          return { ...state, defaults: action.defaults };
    default:
          return state;
  }
}
