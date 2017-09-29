import Component from '../AbstractComponent';

/**
 * Form 组件接口定义
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/8
 */
class AbstractFormComponent extends Component {

  getValue() {
  }

  valid() {
  }

  putFormValue(currentValue) {
    const {name, form, value} = this.props;
    name && form && form.putFormValue(name, currentValue || value);
  }
}

export default AbstractFormComponent;
