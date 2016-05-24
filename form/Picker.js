import React, {
  PropTypes
} from 'react';

import {
  Picker as RNPicker,
  Text
} from 'react-native';

import AbstractFormComponent from './AbstractFormComponent';
import PickerContainer from './PickerContainer';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/8
 */
class Picker extends AbstractFormComponent {

  static propTypes = {
    children: PropTypes.node,
    selectedValue: PropTypes.string
  };

  static defaultProps = {
    selectedValue: ''
  };

  constructor(props) {
    super(props);
    let {form, name} = props;
    name && form && form.putFormValue(name, props.selectedValue);
    ['onValueChange'].forEach(f => this[f] = this[f].bind(this));
  }

  state = {
    selectedValue: this.props.selectedValue
  };

  onValueChange(selectedValue) {
    this.setState({selectedValue});
    let {form, name} = this.props;
    name && form && form.putFormValue(name, selectedValue);
  }

  getValue() {
    return this.state.selectedValue;
  }

  valid() {
    return false;
  }

  render() {
    let {children} = this.props;
    return (
      <PickerContainer>
        <RNPicker onValueChange={this.onValueChange}
                  selectedValue={this.state.selectedValue}>
          {children}
        </RNPicker>
      </PickerContainer>
    );
  }


}

Picker.Item = RNPicker.Item;

export default Picker;
