import * as React from 'react';
import Component from '../AbstractComponent';
import { View } from 'react-native';
import { Props } from './Props';


export const FormContext = React.createContext({});

/**
 * Form 表单组件
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/5
 */
export default class Form extends Component<Props> {

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
      this.formFields[field].isValid && this.formFields[field].isValid();
    });

    let miss = Object.keys(this.missFields).filter(key => this.missFields[key] !== null);
    let error = Object.keys(this.errorFields).filter(key => this.errorFields[key] !== null);

    return miss.length === 0 && error.length === 0;
  }

  render() {
    const {children, ...props} = this.props;
    return (
      <FormContext.Provider value={{form: this}}>
        <View {...props}>
          {children}
        </View>
      </FormContext.Provider>
    );
  }
}
