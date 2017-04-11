import * as React from 'react';
import {ListItem} from './list.item.component.tsx';
const tween = require('tween.js');

interface ListProps<T> {
  actionPrefix: string,
  items: Array<T>;
  renderItem: Function;
  mapState: Function;
  scrollDelta: number;
  multiselection: boolean;
}

interface ListState {
  items: Array,
  selected: Array,
  scrollIndex: number
}

export class List<T> extends React.Component<ListProps<T>, ListState> {

  static defaultProps = {
    items: [],
    renderItem: (item: any) => item,
    mapState: (state: any) => state,
    scrollDelta: 10,
    multiselection: false
  };

  static contextTypes = {
    store: React.PropTypes.object
  };

  static childContextTypes = {
    store: React.PropTypes.object,
    state: React.PropTypes.func
  };

  container: any;
  dispose: Function;
  context: any;

  constructor(props: ListProps<T>, context: any) {
    super(props, context);
    this.state = this.mapContextToState();
  }

  getChildContext() {
    return {
      state: () => this.mapContextToState(),
      store: this.context.store
    };
  }

  mapContextToState(): ListState {
    return this.props.mapState(this.context.store.getState());
  }

  dispatch(action: any) {
    this.context.store.dispatch(action);
  }

  scrollTo(id: number) {
    let toElement: any = undefined;
    this.state.items.forEach((item, idx) => {
      if (item.id == id) {
        toElement = this.container.children[idx];
      }
    });
    if (toElement !== undefined) {
      let newScroll =
        toElement.offsetTop -
        // toElement.offsetHeight -
        this.props.scrollDelta -
        this.container.parentElement.offsetTop;
      console.log('Scroll to ' + newScroll);
      new tween.Tween(this.container.parentElement)
        .to({ scrollTop: newScroll }, 100)
        .start();
      let animate = () => {
        window.requestAnimationFrame(animate);
        tween.update();
      };
      animate();
      // this.container.parentElement.scrollTop = newScroll;
    }
  }

  componentDidMount() {
    this.dispose =
      this.context.store.subscribe(() => {
        let state = this.mapContextToState();
        if (this.state.items != state.items) {
          this.setState(state);
        }
        if (state.scrollIndex && state.scrollIndex != this.state.scrollIndex)
          this.state.scrollIndex = state.scrollIndex;
          this.scrollTo(state.scrollIndex);
      });
    // this.dockHeader();
  }

  componentDidUpdate() {
    // this.dockHeader();
  }

  componentWillUnmount() {
    this.dispose();
  }

  dockHeader() {
    let target: any = this.container.previousSibling;
    target.style.width = (target.clientWidth + 1) + 'px';
    target.style.position = 'absolute';
    this.container.style.marginTop = (target.clientHeight + 17) + 'px';
  }

  undockHeader() {
    let target: any = this.container.previousSibling;
    target.style.width = '';
    target.style.position = '';
    this.container.style.marginTop = '';
  }

  render() {
    let items = this.state.items.map(item => {
      return (
        <ListItem key={ item.id }
                  id={ item.id }
                  item={ item }
                  multiselection={ this.props.multiselection }
                  actionPrefix={ this.props.actionPrefix }
                  renderItem={ this.props.renderItem }>
        </ListItem>
      );
    });
    return (
      <div className="list-container">
        { this.props.children }
        <ul className="list" ref={ (ref) => this.container = ref }>
          { items }
        </ul>
      </div>
    );
  }

}
