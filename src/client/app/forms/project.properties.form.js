import React from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import template from './project.properties.form.rt';
import {saveProject} from '../shared/project';

let ProjectPropertiesForm = React.createClass({

  mixins: [ LinkedStateMixin ],

  contextTypes: {
    store: React.PropTypes.object,
    messenger: React.PropTypes.object,
    router: React.PropTypes.object
  },

  getInitialState: function() {
    let project = this.context.store.getState().project;
    return {
      'title': project.title,
      'description': project.description,
      'default.worker.capacity': project.defaults['worker.capacity'],
      'default.worker.reach': project.defaults['worker.reach'],
    };
  },

  submit: function(e) {
    e.preventDefault();
    this.save();
    this.context.router.push('/project');
  },

  save: function() {
    let state = this.context.store.getState();
    let project = state.project;
    project.title = this.state['title'];
    project.description = this.state['description'];
    project.defaults['worker.capacity'] = this.state['default.worker.capacity'];
    project.defaults['worker.reach'] = this.state['default.worker.reach'];
    saveProject(state);
    this.context.messenger.setMessage('Propriétés du projet enregistrées', 'success');
  },

  render: function() {
    return template.call(this);
  }

});

export {ProjectPropertiesForm}
