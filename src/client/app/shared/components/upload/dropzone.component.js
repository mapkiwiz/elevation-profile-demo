// based on https://github.com/paramaggarwal/react-dropzone, adds image preview
// based on http://stackoverflow.com/questions/28750489/upload-file-component-with-reactjs
import React from 'react';
import _ from 'lodash';

export class DropZone extends React.Component {

  fileInput;

  static propTypes = {
    onDrop: React.PropTypes.func.isRequired,
    width: React.PropTypes.string,
    height: React.PropTypes.string,
    style: React.PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isDragActive: false
    };
  }

  onDragLeave(e) {

    this.setState({
      isDragActive: false
    });

  }

  onDragOver(e) {

    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    this.setState({
      isDragActive: true
    });

  }

  onDrop(e) {

    e.preventDefault();
    this.setState({
      isDragActive: false
    });

    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    // _.each(files, this._createPreview);

    _.each(files, file => {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.props.onDrop(file, e.target.result);
      };
      reader.readAsText(file);
    });

  }

  onClick(e) {

    // don't e.preventDefault()
    // browser will open file picker dialog only on user click
    // (for security sake)
    this.fileInput.click();

  }

  // _createPreview(file) {
  //   var self = this
  //     , newFile
  //     , reader = new FileReader();
  //
  //   reader.onloadend = function(e){
  //     newFile = {file:file, imageUrl:e.target.result};
  //     if (self.props.onDrop) {
  //       self.props.onDrop(newFile);
  //     }
  //   };
  //
  //   reader.readAsDataURL(file);
  // }

  render() {

    let className = 'dropzone';
    if (this.state.isDragActive) {
      className += ' active';
    };

    let style = {
      width: this.props.width || '100%',
      height: this.props.height || '100px',
      // backgroundColor: 'lightgrey',
      border: this.state.isDragActive ? '1px solid darkgrey' : '1px dashed lightgrey'
    };

    return (
      <div className={className}
           style={style}
           onClick={e => this.onClick(e) }
           onDragLeave={e => this.onDragLeave(e) }
           onDragOver={e => this.onDragOver(e) }
           onDrop={e => this.onDrop(e) }>
        <input style={{display: 'none' }}
               type='file'
               ref={ ref => this.fileInput = ref }
               onChange={e => this.onDrop(e) } />
        {this.props.children}
      </div>
    );

  }

}
