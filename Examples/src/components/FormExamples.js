import React, {Component} from 'react';

import {
    TextInput,
    Switch,
    SliderIOS,
    PickerIOS,
    DatePickerIOS,
    Text
} from 'react-native';

import Form from 'react-native-components/form';
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
            <Form ref="form">
                <TextInput name="name"/>
                <Switch name="switch"/>

                <Button bsStyle="primary"
                        onPress={this.getFormData}>
                    Get Form Data
                </Button>

                <Text>{this.state.formData}</Text>
            </Form>
        );
    }
}

export default FormExamples;
