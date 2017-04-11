import React from 'react';
import {MenuLink} from './menu.link';
import {DropZone} from '../shared/components/upload/dropzone.component';
import {openProjectFile} from '../shared/project';

export class ProjectImportPanel extends React.Component {

  accept(file, data) {
    let state = openProjectFile(data);
    window.location = '?p=' + state.project.id;
  }

  render() {
    return (
      <div className="col-md-4 col-md-offset-8 panel-container">
        <h3>
          Importer un fichier projet
          <MenuLink />
        </h3>
        <hr/>
        <DropZone width="100%"
                  height="50px"
                  onDrop={ (file, data) => this.accept(file, data) } />
        <div className="help-block">
          Cliquer ou faites glisser un fichier projet dans cette zone
        </div>
      </div>
    );
  }

}
