import React from 'react';
import {Link} from 'react-router-dom';
import {MessagePanel} from './message.panel';

export class MenuPanel extends React.Component {

  static contextTypes = {
    store: React.PropTypes.object
  }

  toggleElevationPanel(event) {
    event.preventDefault();
    this.context.store.dispatch({ type: 'elevation.toggle' });
  };

  render() {
      return (
        <div className="col-md-4 col-md-offset-8 panel-container">
          <h3>Demo</h3>
          <hr/>
          <MessagePanel></MessagePanel>
          <ul className="list">
            <li><a href="#" onClick={ (e) => this.toggleElevationPanel(e) }>Profil en travers</a></li>
            <li><Link to="/layers">Affichage</Link></li>
            <li><Link to="/about">À propos</Link></li>
          </ul>
        </div>
      );
  }

}
