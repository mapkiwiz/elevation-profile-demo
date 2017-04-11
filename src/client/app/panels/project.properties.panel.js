import React from 'react';
import {MenuLink} from './menu.link';
import {ProjectPropertiesForm} from '../forms/project.properties.form';

export function ProjectPropertiesPanel(props, context) {
  return (
    <div className="col-md-6 col-md-offset-6 panel-container">
      <h3>
        Propriétés du projet
        <MenuLink />
      </h3>
      <hr/>
      <ProjectPropertiesForm />
    </div>
  );
}
