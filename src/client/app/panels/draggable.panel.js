import React from 'react';
import Draggable from 'react-draggable';

export class DraggablePanel extends React.Component {

  render() {
    return (
      <Draggable handle=".handle" defaultPosition={{ x: 150, y: 100 }}>
        <div className="panel-container handle" style={{ width: '350px', height: '200px' }}>
          <h3 ref={ (elt) => { this.handle = elt; } }>{ this.props.title }</h3>
          <hr/>
          { this.props.children }
        </div>
      </Draggable>
    );
  }

}
