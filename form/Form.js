import React, {Component, PropTypes, Children, isValidElement, cloneElement} from 'react';
import {
    View
} from 'react-native';

import AbstractFormComponent from './AbstractFormComponent';

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
     * 错误字段
     * @type {{}}
     */
    errorFields = {};

    /**
     * 缺失字段
     * @type {{}}
     */
    missFields = {};

    /**
     * 表单数据
     * @type {{}}
     */
    formData = {};

    formFields = {};

    putFormValue(name, value) {
        this.formData[name] = value;
    }

    putErrorField(name) {
        this.errorFields[name] = null;
    }

    putMissField(name) {
        this.missFields[name] = null;
    }

    /**
     * 删除表单错误字段
     * @param name 字段名字
     */
    deleteErrOrMissField(name) {
        this.errorFields[name] && delete this.errorFields[name];
        this.missFields[name] && delete this.missFields[name];
    }

    /**
     * 获取表单数据
     * @returns {{}}
     */
    getFormData() {
        return this.formData;
    }

    /**
     * 校验表单是否正确
     * @returns {boolean}
     */
    isValid() {
        Object.keys(this.formFields).forEach(field => {
            this.formFields[field].valid && this.formFields[field].valid();
        });

        return Object.keys(this.missFields).length === 0 && Object.keys(this.errorFields).length === 0;
    }


    renderChildren(children) {
        return Children.map(children, (child, index) => {
            if (!isValidElement(child)) {
                return child;
            }
            let fieldName = child.props.name;

            let newProps = {
                key: index
            };
            if (fieldName && child.type.__proto__ === AbstractFormComponent) {
                newProps.form = this;
                this.formFields[fieldName] = child;
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
