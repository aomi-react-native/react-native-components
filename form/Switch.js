import React from 'react';
import PropTypes from 'prop-types';
import { Switch as RNSwitch } from 'react-native';
import AbstractFormComponent from './AbstractFormComponent';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/7
 */
class Switch extends AbstractFormComponent {

  static propTypes = {
    form: PropTypes.object,
    name: PropTypes.string,
    onValueChange: PropTypes.func
  };

  static displayName = 'Switch';

  constructor(props) {
    super(props);
    ['onValueChange'].forEach(f => this[f] = this[f].bind(this));
    let {name, form} = this.props;
    name && form && form.putFormValue(name, this.props.value);
    this.state = {
      value: this.props.value
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.value) {
      this.setState({value: nextProps.value});
    }
  }

  onValueChange(value) {
    this.setState({value});
    let {onValueChange, form, name} = this.props;
    form && name && form.putFormValue(name, value);
    onValueChange && onValueChange(value);
  }

  valid() {
    return true;
  }

  render() {
    return (
      <RNSwitch {...this.props}
                onValueChange={this.onValueChange}
                value={this.state.value}
      />
    );
  }
}

export default Switch;
