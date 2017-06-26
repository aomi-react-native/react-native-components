import React from 'react';
import PropTypes from 'prop-types';
import AbstractFormComponent from './AbstractFormComponent';

import { Slider as RNSlider } from 'react-native';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/7
 */
class Slider extends AbstractFormComponent {

  static propTypes = {
    form: PropTypes.object,
    name: PropTypes.string,
    onValueChange: PropTypes.func,
    value: PropTypes.number
  };

  static defaultProps = {
    value: 0
  };

  static displayName = 'Slider';

  constructor(props) {
    super(props);
    ['onValueChange'].forEach(f => this[f] = this[f].bind(this));
  }

  state = {
    value: this.props.value
  };

  getValue() {
    return this.state.value;
  }

  valid() {
    return false;
  }

  onValueChange(value) {
    this.setState({value});
    let {onValueChange, name, form} = this.props;
    name && form && form.putFormValue(name, value);
    onValueChange && onValueChange(value);
  }

  render() {
    let {name, form, ...other} = this.props;
    name && form && form.putFormValue(name, this.state.value);
    return (
      <RNSlider {...other}
                onValueChange={this.onValueChange}
      />
    );
  }

}

export default Slider;
