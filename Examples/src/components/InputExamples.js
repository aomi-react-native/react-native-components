import React, {Component} from 'react';
import {
    View
} from 'react-native';
import Input from 'react-native-components/form/Input';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/5
 */


class InputExamples extends Component {

    render() {
        return (
            <View style={{flex: 1,paddingTop: 15}}>
                <Input />
                <View style={{height: 10}}/>
                <Input style={{height: 30,borderRadius: 5}}/>

                <Input afterIcon="plus"
                       beforeIcon="user"
                       style={{height: 30,borderRadius: 5}}
                />
            </View>
        );
    }

}

export default InputExamples;