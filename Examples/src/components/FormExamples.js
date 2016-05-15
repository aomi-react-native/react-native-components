import React, {Component} from 'react';

import {
    ScrollView,
    Text,
    View
} from 'react-native';

import Form, {Input, Switch, Slider, Picker, DatePicker} from 'react-native-components/form';
import Button from 'react-native-components/bootstrap/Button';

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
        formData: ''
    };

    getFormData() {
        this.setState({formData: JSON.stringify(this.refs.form.getFormData())});
    }

    render() {

        return (
            <ScrollView style={{flex: 1}}>
                <Form ref="form"
                      style={{flex: 1,padding: 15}}>
                    <Input name="name"/>
                    <Switch name="switch"/>
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
                    <Text>{this.state.formData}</Text>
                </Form>
            </ScrollView>
        );
    }
}

export default FormExamples;
