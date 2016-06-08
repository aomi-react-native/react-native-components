import React, {
  Component,
  PropTypes,
  Children,
  isValidElement,
  cloneElement
} from 'react';
import { View } from 'react-native';
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
   * @type {Array}
   */
  errorFields = {};

  /**
   * 缺失字段
   * @type {Array}
   */
  missFields = {};

  /**
   * 表单数据
   * @type {{}}
   */
  formValue = {};

  formFields = {};

  putFormValue(name, value) {
    this.formValue[name] = value;
  }

  putErrorField(name) {
    this.errorFields[name] = name;
  }

  putMissField(name) {
    this.missFields[name] = name;
  }

  /**
   * 删除表单错误字段
   * @param name 字段名字
   */
  deleteErrOrMissField(name) {
    this.errorFields[name] = null;
    this.missFields[name] = null;
  }

  /**
   * 获取表单数据
   * @returns {{}}
   */
  getFormValue() {
    return this.formValue;
  }

  /**
   * 获取表单错误字段信息
   * @returns {{miss: Array, error: Array}}
   */
  getErrorFields() {
    return {
      miss: Object.keys(this.missFields).filter(key => this.missFields[key] !== null),
      error: Object.keys(this.errorFields).filter(key => this.errorFields[key] !== null)
    };
  }

  /**
   * 校验表单是否正确
   * @returns {boolean}
   */
  isValid() {
    Object.keys(this.formFields).forEach(field => {
      this.formFields[field].valid && this.formFields[field].valid();
    });

    let miss = Object.keys(this.missFields).filter(key => this.missFields[key] !== null);
    let error = Object.keys(this.errorFields).filter(key => this.errorFields[key] !== null);

    return miss.length === 0 && error.length === 0;
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
        newProps.ref = field => {
          this.formFields[fieldName] = field;
          child.ref && child.ref(field);
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
