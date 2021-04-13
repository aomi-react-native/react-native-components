import * as React from 'react';
import AbstractFormComponent from '../Form/AbstractFormComponent';

import { Slider as RNSlider } from 'react-native';
import Props from './Props';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/7
 */
export default class Slider extends AbstractFormComponent<Props, any> {
  static defaultProps = {
    value: 0,
  };

  state = {
    value: this.props.value,
  };

  getValue() {
    return this.state.value;
  }

  isValid() {
    return false;
  }

  onValueChange(value) {
    this.setState({ value });
    let { onValueChange, name, form } = this.props;
    name && form && form.putFormValue(name, value);
    onValueChange && onValueChange(value);
  }

  render() {
    let { name, form, ...other } = this.props;
    name && form && form.putFormValue(name, this.state.value);
    return <RNSlider {...other} onValueChange={this.onValueChange} />;
  }
}
