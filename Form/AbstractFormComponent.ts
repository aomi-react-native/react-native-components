import Component from '../AbstractComponent';
import Form from './index';

export interface BaseFormPropTypes {
  name?: string;
  form?: Form;
  value?: any;
}

/**
 * Form 组件接口定义
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/8
 */
export default abstract class AbstractFormComponent<P extends BaseFormPropTypes,S> extends Component<P,S> {

  /**
   * 获取表单组件的值
   */
  abstract getValue(): any;

  /**
   * 值是否有效
   */
  abstract isValid(): boolean;

  putFormValue(currentValue): void {
    const {name, form, value} = this.props;
    name && form && form.putFormValue(name, currentValue || value);
  }
}

