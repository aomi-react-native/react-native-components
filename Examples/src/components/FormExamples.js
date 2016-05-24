import React, {
  Component,
  PropTypes
} from 'react';

import {
  Text,
  View,
  StyleSheet
} from 'react-native';

import Form, {
  Input,
  Switch,
  Slider,
  Picker,
  DatePicker
} from 'react-native-components/form';
import Button from 'react-native-components/bootstrap/Button';

let styles = StyleSheet.create({
  defaultModalStyle: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  }
});

/**
 * 表单使用示例
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/5
 */
class FormExamples extends Component {

  constructor(props) {
    super(props);
    ['getFormData'].forEach(f => this[f] = this[f].bind(this));
  }

  state = {
    formData: '',
    modalVisible: false
  };

  form = {};

  getFormData() {
    this.setState({formData: JSON.stringify(this.form.getFormData()), modalVisible: true});
  }

  render() {

    let style = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      transform: [{
        translateX: 0,
        translateY: 200,
      }]
    };

    return (
      <View style={{flex: 1}}>
        <Form ref={(form):Object => this.form = form}
              style={{flex: 1,padding: 15}}>
          <Input name="name"/>
          <Switch name="switch"
                  value={true}
          />
          <Slider name="slider"/>
          <Picker name="picker">
            <Picker.Item label="Java"
                         value="java"
            />
            <Picker.Item label="JavaScript"
                         value="js"
            />
          </Picker>
          <DatePicker name="datePicker"/>

          <Button bsStyle="primary"
                  onPress={this.getFormData}
                  style={{marginTop: 20}}>
            Get Form Data
          </Button>
          <View style={style}>
            <Text>{this.state.formData}</Text>
          </View>
        </Form>
      </View>
    );
  }
}

export default FormExamples;
