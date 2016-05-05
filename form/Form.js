import React, {Component, PropTypes, Children, isValidElement, cloneElement} from 'react';
import {
    View
} from 'react-native';

const allowedFieldTypes = {
    'TextInput': {
        defaultValueProp: 'defaultValue',
        cb: 'onChangeText'
    },
    'Switch': {
        defaultValueProp: 'value',
        cb: 'onValueChange'
    },
    'SliderIOS': {
        defaultValueProp: 'value',
        cb: 'onSlidingComplete'
    },
    'PickerIOS': {
        defaultValueProp: 'selectedValue',
        cb: 'onValueChange'
    },
    'DatePickerIOS': {
        defaultValueProp: 'date',
        cb: 'onDateChange'
    }
};

/**
 * Form 表单组件
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/5
 */
class Form extends Component {
    static propTypes = {
        children: PropTypes.node
    };

    /**
     * 全部表单字段
     * @type {Array}
     */
    fields = [];

    /**
     * 错误表单字段
     * @type {Array}
     */
    errorFields = [];

    /**
     * 表单数据
     * @type {{}}
     */
    formData = {};

    isValid() {
        this.errorFields = [];
        this.fields.forEach(field => {
            let {required, name, pattern} = field.props;

            let value = this.formData[name];
            if (required) {
                if (!value || value.trim() === '') {
                    this.errorFields.push({
                        name,
                        valueMissing: true
                    });
                }
            }

            if (pattern) {
                let reg = new RegExp(pattern);
                if (!reg.test(value)) {
                    this.errorFields.push({
                        name,
                        patternMismatch: true
                    });
                }
            }

        });
    }

    getFormData() {
        return this.formData;
    }

    renderChildren(children) {
        return Children.map(children, (child, index) => {
            if (!isValidElement(child)) {
                return child;
            }
            let fieldType = child.type.displayName;
            let fieldName = child.props.name;
            let allowedField = allowedFieldTypes[fieldType];
            let isFormField = fieldName && allowedField;

            let newProps = {
                key: index
            };

            if (isFormField) {
                this.fields.push(child);
                //记录字段默认值
                this.formData[fieldName] = child.props[allowedField.defaultValueProp] || child.props.value || '';
                //设置回调函数当字段更改时设置新的表单值
                newProps[allowedField.cb] = value => {
                    this.formData[fieldName] = value;
                    child.props[allowedField.cb] && child.props[allowedField.cb](value);
                };
            }

            newProps.children = this.renderChildren(child.props.children);

            return cloneElement(child, newProps);
        });
    }

    render() {
        let {children, ...other} = this.props;
        return (
            <View {...other}
                ref="form">
                {this.renderChildren(children)}
            </View>
        );
    }
}

export default Form;
