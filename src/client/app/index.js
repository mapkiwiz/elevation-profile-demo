import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './app';
import {Provider} from 'react-redux';
import {reducer} from './reducers/index';
import {loadProject, saveProject} from './shared/project';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import URLSearchParams from 'url-search-params';
import {logger} from './logging.coffee';

class Messenger {

  message;

  getMessage() {
    return this.message;
  }

  setMessage(text, type) {
    this.message = {
      text: text,
      type: type
    };
  }

  clearMessages() {
    this.message = undefined;
  }

}

(function() {

  let store;
  let messenger = new Messenger();
  logger.set_level('debug');

  if (window.location.search) {
    let params = new URLSearchParams(window.location.search.slice(1));
    let projectId = params.get('p');
    if (projectId) {
      let state = loadProject(projectId);
      store = createStore(reducer, state, applyMiddleware(thunk));
      messenger.setMessage('Projet ouvert : ' + (state.project.title || 'Sans titre'), 'success');
    } else {
      store = createStore(reducer, applyMiddleware(thunk));
      // messenger.setMessage('Nouveau projet', 'success');
    }
  } else {
    store = createStore(reducer, applyMiddleware(thunk));
    // messenger.setMessage('Nouveau projet', 'success');
  }

  ReactDOM.render(
    <Provider store={ store }>
      <App messenger={ messenger }></App>
    </Provider>,
    document.getElementById('main')
  );

  // window.onbeforeunload = function (e) {

  //   // TODO saveProject(store.getState());
  //   console.log(e);

  //   let message = "Voulez-vous vraiment quitter l'application ?";
  //   e = e || window.event;

  //   // For IE and Firefox
  //   if (e) {
  //     console.log(e);
  //     e.returnValue = message;
  //   }
  //   // For Safari
  //   return message;

  // };

})();
