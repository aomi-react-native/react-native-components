import React from 'react';
import {
    View
} from 'react-native';
import AbstractComponent from './AbstractComponent';

import Input from 'react-native-components/form/Input';
import Button from 'react-native-components/bootstrap/Button';

let dataSource = [{
    placeholder: 'Default Input'
}, {
    placeholder: 'Custom Style',
    style: {
        height: 30,
        borderRadius: 5
    }
}, {
    placeholder: 'Icon Input',
    before: 'user',
    after: 'plus',
    style: {
        height: 30,
        borderRadius: 5
    }
}, {
    placeholder: 'Input with Button',
    after: (
        <Button beforeIcon="search"
                bsStyle="link"
                style={{justifyContent: 'center', alignItems: 'center', width: 30}}
        />
    )
}, {
    placeholder: 'secureTextEntry',
    secureTextEntry: true
}];

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/5
 */
class InputExamples extends AbstractComponent {

    constructor(props) {
        super(props, dataSource);
    }

    renderRow(input) {
        return (
            <View style={{marginTop: 10}}>
                <Input {...input} />
            </View>
        );
    }
}

export default InputExamples;