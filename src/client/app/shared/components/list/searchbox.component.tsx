import * as React from 'react';

export interface  SearchBoxProps {
  search: Function
}

export class SearchBox extends React.Component<SearchBoxProps, {}> {

  searchItems(e) {
    e.persist();
    console.log(e.target.value);
    this.props.search(e.target.value);
  }

  render() {
    return (
      <div className="form-inline">
        <div className="input-group">
          <input className="form-control"
                 name="search" type="text"
                 placeholder="Rechercher ..."
                 autoComplete="off"
                 onChange={ e => this.searchItems(e) } />
          <div className="input-group-addon">
            <span className="glyphicon glyphicon-search"></span>
          </div>
        </div>
      </div>
    );
  }

}
