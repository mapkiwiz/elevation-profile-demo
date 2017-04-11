import React from 'react';
import template from './switch.component.rt';

export class SwitchInput extends React.Component {

  static propTypes = {
    name: React.PropTypes.string,
    size: React.PropTypes.oneOf([ 'mini', 'small', 'large' ]),
    width: React.PropTypes.number,
    style: React.PropTypes.oneOf([ 'primary', 'info', 'success', 'warning', 'danger' ]),
    value: React.PropTypes.bool,
    labelOn: React.PropTypes.string,
    labelOff: React.PropTypes.string,
    onChange: React.PropTypes.func
  };

  static defaultProps = {
    style : 'primary',
    size: 'small',
    labelOn: 'ON',
    labelOff: 'OFF',
    value: false,
    width: 66
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      value: !!props.value
    };
  }

  toggle(e) {
    let new_value = !this.state.value;
    if (this.props.onChange) {
      this.props.onChange({ target: { name: this.props.name, value: new_value }});
      e.stopPropagation();
    }
    this.setState({ value: new_value });
  }

  render() {
    return template.call(this);
  }

}
