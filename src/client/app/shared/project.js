import LZString from 'lz-string';
import slug from 'slug/slug-browser';
import _ from 'lodash';

export function generateUniqueProjectId() {

  let projectList = getProjects();
  let uniqueId;

  do {
    uniqueId = getRandomString(8);
  } while (projectList.hasOwnProperty(uniqueId));

  return uniqueId;

}

export function getRandomString(length) {

  let result = '';
  let choices = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for(var i=0; i < length; i++ )
    result += choices.charAt(Math.floor(Math.random() * choices.length));

  return result;

}

export function getProjects() {
  let projectList = window.localStorage.getItem('sectorisation.projects');
  if (projectList) {
    return JSON.parse(projectList);
  } else {
    return {};
  }
}

export function loadProject(projectId) {
  if (projectId) {
    let projectData = window.localStorage.getItem(projectId);
    if (projectData) {
      return JSON.parse(LZString.decompressFromUTF16(projectData));
    }
  }
  return undefined;
}

export function saveProject(state) {
  let projectData = LZString.compressToUTF16(JSON.stringify(state));
  window.localStorage.setItem(state.project.id, projectData);
  let projectList = getProjects();
  projectList[state.project.id] = {
    id: state.project.id,
    title: state.project.title,
    description: state.project.description
  };
  window.localStorage.setItem('sectorisation.projects', JSON.stringify(projectList));
}

export function openProjectFile(data) {
  let uncompressed = LZString.decompressFromUTF16(data);
  let state = JSON.parse(uncompressed);
  console.log(state);
  saveProject(state);
  return state;
}

export function saveProjectAs(state) {
  let projectData = LZString.compressToUTF16(JSON.stringify(state));
  triggerDownload(
    projectData,
    slug(state.project.title || 'Sans titre') + '-' + state.project.id + '.projet',
    'application/vnd.sectorisation.project');
}

export function removeProject(projectId) {
  let projectList = getProjects();
  if (projectList.hasOwnProperty(projectId)) {
    delete projectList[projectId];
    window.localStorage.setItem('sectorisation.projects', JSON.stringify(projectList));
  }
}

export function exportProject(state) {

  const REG_KEY = state.project.settings['export.region.key'];
  const ENQ_KEY = state.project.settings['export.enquete.key'];
  const DELIMITER = state.project.settings['export.orge.delimiter'];

  let data = [[ 'REG', 'ENQ', 'US', 'ENQTR' ].join(DELIMITER) + '\n'];
  _.each(state.tasks.items, (task) => {
    console.log(task);
    let row = [
      task.properties[REG_KEY],
      task.properties[ENQ_KEY],
      task.id,
      state.assignments.tasks[task.id]];
    data.push(row.join(DELIMITER) + '\n');
  });

  triggerDownload(
    data.join(''),
    slug(state.project.title || 'Sans titre') + '-' + state.project.id + '.csv',
    'text/csv');

}

export function exportAsGeoJSON(state) {
  let collection = {
    type: 'FeatureCollection',
    crs: {
      type: 'name',
      properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' }
    }
  };
  collection.features = state.groups.items.map(group => {
    let workerId = state.assignments.groups[group.id];
    let worker = _.find(state.workers.items, o => (o.id == workerId ));
    return {
      type: 'Feature',
      properties: {
        ...group.properties,
        enqueteur_id: worker.id,
        enqueteur: worker.label,
        nb_us: group.tasks.length
      },
      geometry: group.geometry
    };
  });
  triggerDownload(
    JSON.stringify(collection),
    slug(state.project.title || 'Sans titre') + '-' + state.project.id + '.geojson',
    'application/json'
  );
}

function triggerDownload(data, filename, mimeType) {

  let blob = new Blob([ data ], {
    type: mimeType
  });

  if (window.navigator.msSaveOrOpenBlob) {

    window.navigator.msSaveBlob(blob, filename);

  } else {

    let downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

  }

}
