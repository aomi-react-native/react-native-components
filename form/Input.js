import React, {
    Component,
    PropTypes
} from 'react';

import {
    TextInput,
    View,
    StyleSheet
} from 'react-native';

import Icon from '../Icon';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#CCC'
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 35
    },
    input: {
        flex: 1,
        height: 35,
        padding: 4
    }
});
const INPUT_PROPS_KEYS = [
    'autoCapitalize',
    'autoCorrect',
    'autoFocus',
    'defaultValue',
    'editable',
    'keyboardType',
    'maxLength',
    'multiline',
    'onBlur',
    'onChange',
    'onChangeText',
    'onEndEditing',
    'onFocus',
    'onSubmitEditing',
    'placeholder',
    'placeholderTextColor',
    'secureTextEntry',
    'value',
    'blurOnSubmit',
    'clearButtonMode',
    'clearTextOnFocus',
    'enablesReturnKeyAutomatically',
    'keyboardAppearance',
    'numberOfLines',
    'onKeyPress',
    'returnKeyType',
    'selectTextOnFocus',
    'selectionState',
    'textAlign',
    'underlineColorAndroid'
];
class Input extends Component {

    static propTypes = {
        after: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        before: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        iconProps: PropTypes.object,
        iconStyle: View.propTypes.style,
        inputStyle: TextInput.propTypes.style,
        style: View.propTypes.style,
        underlineColorAndroid: PropTypes.string
    };

    static defaultProps = {
        iconProps: {},
        underlineColorAndroid: 'transparent'
    };

    getComp(name) {
        let {iconProps, iconStyle} = this.props;
        if (name) {
            if (typeof name === 'string') {
                return (
                    <View style={[styles.icon,iconStyle]}>
                        <Icon {...iconProps}
                            name={name}
                        />
                    </View>
                );
            }

            return name;
        }
        return null;
    }

    render() {
        let {before, after, style, inputStyle, ...other} = this.props;

        let newInputProps = {},
            newProps = Object.assign({}, other);

        INPUT_PROPS_KEYS.forEach(key => {
            newInputProps[key] = this.props[key];
            newProps[key] && delete newProps[key];
        });


        return (
            <View {...newProps}
                style={[styles.container, style]}>
                {this.getComp(before)}
                <TextInput {...newInputProps}
                    style={[styles.input, style, inputStyle]}
                />
                {this.getComp(after)}
            </View>
        );
    }

}

export default Input;
