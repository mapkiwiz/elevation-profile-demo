import React from 'react';
import {Link} from 'react-router';
import {MenuLink} from './menu.link';
import {getProjects, removeProject} from '../shared/project';
import _ from 'lodash';

export function ProjectOpenPanel(props, context) {

  let projects = _.values(getProjects()).map(project => {
    return (
      <li key={ project.id }>
        <Link to="/project/open"
              className="btn btn-default pull-right"
              onClick={ () => removeProject(project.id) }>
          Supprimer
        </Link>
        <a href={ '?p=' + project.id }>{ project.title || 'Sans titre' }</a>
        <span className="help-block">{ project.description || 'Pas de description' }</span>
      </li>
    );
  });

  return (
    <div className="col-md-4 col-md-offset-8 panel-container">
      <h3>
        Ouvrir un projet existant
        <MenuLink />
      </h3>
      <hr/>
      <ul className="list">
        <li key="open-project-file">
          <Link to="/project/import">Importer un fichier projet</Link>
        </li>
        { projects }
      </ul>
    </div>
  );

}
