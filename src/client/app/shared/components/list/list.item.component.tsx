import * as React from 'react';

export interface  ListItemProps<T> {
  id: number;
  item: T;
  renderItem: Function;
  actionPrefix: string;
  multiselection: boolean;
}

export interface ListItemState {
  selected: boolean;
}

export class ListItem<T> extends React.Component<ListItemProps<T>, ListItemState> {

  static contextTypes = {
    store: React.PropTypes.object,
    state: React.PropTypes.func
  };

  context: any;
  dispose: Function;

  constructor(props: ListItemProps<T>, context: any) {
    super(props, context);
    this.state = this.mapContextToState();
  }

  mapContextToState() {
    let selected = this.context.state().selected.includes(this.props.id);
    if (this.state && selected === this.state.selected) {
      return this.state;
    } else {
      return { selected: selected };
    }
  }

  click(e: React.MouseEvent) {
    e.preventDefault();
    if (this.state.selected) {
      this.doAction(this.unselect());
    } else {
      if (this.props.multiselection) {
        this.doAction(this.select());
      } else {
        this.doAction(this.selectOne());
      }
    }
  }

  dblclick(e: React.MouseEvent){
    e.preventDefault();
    if (this.state.selected) {
      this.doAction(this.unselect());
    } else {
      this.doAction(this.selectOne());
    }
  }

  doAction(action: {}) {
    this.context.store.dispatch(action);
  }

  select() {
    return { type: this.props.actionPrefix + 'SELECT', id: this.props.id };
  }

  unselect() {
    return { type: this.props.actionPrefix + 'UNSELECT', id: this.props.id };
  }

  selectOne() {
    return { type: this.props.actionPrefix + 'SELECT_ONE', id: this.props.id };
  }

  componentDidMount() {
    this.dispose = this.context.store.subscribe(() => {
      // let selected = this.context.store.getState().selected.filter(i => (i == this.props.id)).length > 0;
      // let selected = this.context.store.getState().selected.includes(this.props.id);
      // if (selected !== this.state.selected)
      //   this.setState({ selected: selected });
      this.setState(this.mapContextToState());
    });
  }

  componentWillUnmount() {
    this.dispose();
  }

  render() {
    let renderedItem = this.props.renderItem(this.props.item);
    return (
      <li className={ (this.state.selected)? 'selected':'' } onClick={ e => this.click(e) } onDoubleClick={ e => this.dblclick(e) }>
        <span class="glyphicon glyphicon-map-marker"></span>
        { renderedItem }
      </li>
    );
  }

}
