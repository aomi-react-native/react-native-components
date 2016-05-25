import React, {
  PropTypes
} from 'react';

import AbstractFormComponent from './AbstractFormComponent';

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
  'underlineColorAndroid',
  'name'
];
class Input extends AbstractFormComponent {

  static propTypes = {
    /**
     * Input 之后,如果为String  则显示Icon
     */
    after: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    /**
     * Input 之前,如果为String 则显示Icon
     */
    before: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    /**
     * 自定义value验证
     */
    customValid: PropTypes.func,
    /**
     * input 默认值
     */
    defaultValue: PropTypes.string,
    /**
     * Input 所属表单
     */
    form: PropTypes.object,
    /**
     * 图标属性
     */
    iconProps: PropTypes.object,
    /**
     * 图标样式
     */
    iconStyle: View.propTypes.style,
    /**
     * 输入框样式
     */
    inputStyle: TextInput.propTypes.style,
    /**
     * 字段名字,用于提交表单获取值
     */
    name: PropTypes.string,
    /**
     * input 值更改回调函数
     */
    onChangeText: PropTypes.func,
    /**
     * input value 验证正则表达式
     */
    pattern: PropTypes.string,
    /**
     * 表明表单的值是必须的
     */
    required: PropTypes.bool,
    /**
     * container 样式
     */
    style: View.propTypes.style,
    /**
     * Android input 下划线
     */
    underlineColorAndroid: PropTypes.string,
    /**
     * 是否验证input的值
     */
    validate: PropTypes.bool,
    /**
     * input 值
     */
    value: PropTypes.string
  };

  static defaultProps = {
    defaultValue: '',
    iconProps: {},
    underlineColorAndroid: 'transparent',
    validate: true,
    value: ''
  };

  constructor(props) {
    super(props);
    ['onChangeText'].forEach(f => this[f] = this[f].bind(this));
    let {name, form} = props;
    name && form && form.putFormValue(name, props.value || props.defaultValue);
  }

  state = {
    value: this.props.value || this.props.defaultValue
  };

  componentWillUpdate(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.onChangeText(nextProps.value);
    }
  }

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

  getValue() {
    return this.state.value;
  }

  valid() {
    let {validate, customValid, pattern, required, name, form} = this.props;
    if (validate) {
      if (customValid) {
        let result = customValid(this.state.value);
        this.setFormFieldInfo(result);
        return result;
      }

      if (required) {
        if (this.state.value === '') {
          name && form && form.putMissField(name);
          return false;
        } else {
          name && form && form.deleteErrOrMissField(name);
          return true;
        }
      }

      if (pattern) {
        let reg = new RegExp(pattern);
        let result = reg.test(this.state.value);
        this.setFormFieldInfo(result);
        return result;
      }
    }

    return true;
  }

  setFormFieldInfo(result) {
    let {name, form} = this.props;
    if (result) {
      name && form && form.deleteErrOrMissField(name);
    } else {
      name && form && form.putErrorField(name);
    }
  }

  onChangeText(value) {
    this.setState({value});
    let {onChangeText, name, form} = this.props;
    name && form && form.putFormValue(name, value);
    onChangeText && onChangeText(value);
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
          onChangeText={this.onChangeText}
          style={[styles.input, style, inputStyle]}
          value={this.state.value}
        />
        {this.getComp(after)}
      </View>
    );
  }

}

export default Input;
