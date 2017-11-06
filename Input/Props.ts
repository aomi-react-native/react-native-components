import { BaseFormPropTypes } from "../Form/AbstractFormComponent";
import { TextInputProperties } from 'react-native';
import { ReactNode } from 'react';

/**
 * @author Sean sean.snow@live.com createAt 2017/11/3
 */
export default interface PropTypes extends BaseFormPropTypes, TextInputProperties {

  after?: ReactNode;

  before?: ReactNode;

  /**
   * input 默认值
   */
  defaultValue?: string;

  pattern?: RegExp;

  required?: boolean;

  value?: string;

  /**
   * 是否启用表单验证,默认为true
   */
  validate?: boolean;

  /**
   * 验证字段的值是否正确
   * @param {string} text input 的值
   * @returns {boolean} 是否符合预期值
   */
  valid?: (text: string) => boolean;

  inputStyle?: any;

  style?: any;

  onChangeText?: (text: string) => void
}
