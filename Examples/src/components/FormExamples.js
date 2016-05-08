import React, {Component} from 'react';

import {
    Text
} from 'react-native';

import Form, {Input, Switch, Slider, Picker} from 'react-native-components/form';
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
