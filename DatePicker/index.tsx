import * as React from 'react';

import { DatePickerAndroid, DatePickerIOS, Platform } from 'react-native';

import AbstractFormComponent from '../Form/AbstractFormComponent';
import Input from '../Input';
import Button from '../Button/index';
import Props from './Props';


/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/9
 */
class DatePicker extends AbstractFormComponent<Props, any> {


  static defaultProps = {
    editable: false,
    value: new Date()
  };

  baseProps;
  state;
  Comp = null;

  constructor(props) {
    super(props);
    let {name, form, maxDate, minDate, value} = this.props;
    this.state = {
      value
    };
    name && form && form.putFormValue(name, value);
    switch (Platform.OS) {
      case 'ios':
        this.Comp = DatePickerIOS;
        this.baseProps = {
          maximumDate: maxDate,
          minimumDate: minDate
        };
        break;
      case 'android':
        this.Comp = Input;
        this.baseProps.editable = false;
        this.baseProps.after = (
          <Button containerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            width: 30
          }}
                  onPress={this.showPicker}
                  type="link"
          />
        );
        break;
    }
  }

  getValue() {
    return this.state.value;
  }

  isValid(): boolean {
    return true;
  }

  async showPicker() {
    const {minDate, maxDate} = this.props;
    const result: any = await DatePickerAndroid.open({
      date: this.state.value,
      minDate,
      maxDate
    });

    if (result.action === DatePickerAndroid.dateSetAction) {
      this.onDateChange(new Date(result.year, result.month, result.day));
    }
  }

  onDateChange(value) {
    this.setState({value});
    let {onDateChange, name, form} = this.props;
    name && form && form.putFormValue(name, value);
    onDateChange && onDateChange(value);
  }

  render() {
    let {...other} = this.props;
    let Comp = this.Comp;
    return (
      <Comp {...other}
            {...this.baseProps}
            date={this.state.value}
            onDateChange={this.onDateChange}
            value={this.state.value.toLocaleDateString()}
      />
    );
  }

}

export default DatePicker;
