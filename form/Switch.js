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

  state = {
    value: false
  };

  constructor(props) {
    super(props);
    ['onValueChange'].forEach(f => this[f] = this[f].bind(this));
    this.state.value = props.value;
    this.putFormValue();
  }

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.value === 'boolean') {
      this.putFormValue();
      this.setState({value: nextProps.value});
    }
  }

  onValueChange(value) {
    if (typeof this.props.value === 'boolean') {
      this.putFormValue();
      this.setState({value: this.props.value});
    } else {
      this.putFormValue(value);
      this.setState({value});
    }
    let {onValueChange} = this.props;
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
