import * as React from 'react';
import { Switch as RNSwitch } from 'react-native';
import AbstractFormComponent from '../Form/AbstractFormComponent';
import Props from './Props';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/7
 */
export default class Switch extends AbstractFormComponent<Props, any> {

  state;

  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
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

  getValue(): any {
    return this.state.value;
  }

  isValid() {
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

