import React, { PropTypes } from 'react';
import AbstractFormComponent from './AbstractFormComponent';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import Icon from '../Icon';
import Form from './Form';
import commonStyle, { Colors, separatorHeight } from '../styles';
import { findAllParent } from '../domUtils';

// noinspection JSSuspiciousNameCombination
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: separatorHeight,
    borderColor: Colors.separator,
    backgroundColor: Colors.white
  },
  icon: {
    ...commonStyle.center,
    width: 25
  },
  input: {
    flex: 1,
    height: 40,
    marginTop: Platform.OS === 'ios' ? 2 : 0
  },
  label: {
    justifyContent: 'center'
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
    ...TextInput.propTypes,
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
     * input label
     */
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    /**
     * label props
     */
    labelProps: PropTypes.object,
    /**
     * 字段名字,用于提交表单获取值
     */
    name: PropTypes.string,
    /**
     * input value 验证正则表达式
     */
    pattern: PropTypes.instanceOf(RegExp),
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
    value: PropTypes.string,
    /**
     * input 值更改回调函数
     */
    onChangeText: PropTypes.func,
  };

  static defaultProps = {
    defaultValue: '',
    iconProps: {},
    underlineColorAndroid: 'transparent',
    validate: true
  };

  state = {};

  // refs
  textInput;

  constructor(props) {
    super(props);
    this.state.value = props.defaultValue || '';
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultValue !== this.props.defaultValue) {
      this.handleChangeText(nextProps.defaultValue);
    }
  }

  componentDidUpdate() {
    this.putFormField();
  }

  componentDidMount() {
    const {name} = this.props;
    const form = this.getForm();
    name && form && form.putFormValue(name, this.props.defaultValue);
    this.putFormField();
  }

  putFormField() {
    const {name} = this.props;
    const form = this.getForm();
    if (name && form) {
      form.formFields[name] = this;
    }
  }

  getForm() {
    return (findAllParent(this, Form) || [])[0];
  }

  getComp(name, isLabel) {
    let {iconProps, iconStyle, label, labelProps} = this.props;
    if (name) {
      if (typeof name === 'string') {
        return (
          <View style={[styles.icon, iconStyle]}>
            <Icon {...iconProps}
                  name={name}
            />
          </View>
        );
      }
      return name;
    } else if (label && isLabel) {
      if (typeof label === 'string') {
        return (
          <View style={styles.label}>
            <Text {...labelProps}>
              {label}
            </Text>
          </View>
        );
      }
      return label;
    }
    return null;
  }

  getValue() {
    return this.state.value;
  }

  valid() {
    let {validate, customValid, pattern, required, name} = this.props;
    const form = this.getForm();
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
        }
        name && form && form.deleteErrOrMissField(name);
        return true;
      }

      if (pattern) {
        let result = pattern.test(this.state.value);
        this.setFormFieldInfo(result);
        return result;
      }
    }

    return true;
  }

  setFormFieldInfo(result) {
    const {name} = this.props;
    const form = this.getForm();
    if (result) {
      name && form && form.deleteErrOrMissField(name);
    } else {
      name && form && form.putErrorField(name);
    }
  }

  handleChangeText(value) {
    this.setState({value});
    const {onChangeText, name} = this.props;
    const form = this.getForm();
    name && form && form.putFormValue(name, value);
    onChangeText && onChangeText(value);
  }

  render() {
    let {before, after, style, inputStyle, ...other} = this.props;

    let newInputProps = {};
    let newProps = Object.assign({}, other);

    INPUT_PROPS_KEYS.forEach(key => {
      newInputProps[key] = this.props[key];
      newProps[key] && Reflect.deleteProperty(newProps, key);
    });

    return (
      <View {...newProps}
            style={[styles.container, style]}
      >
        {this.getComp(before, true)}
        <TextInput {...newInputProps}
                   onChangeText={this.handleChangeText}
                   ref={textInput => this.textInput = textInput}
                   style={[styles.input, inputStyle]}
        />
        {this.getComp(after)}
      </View>
    );
  }

}

export default Input;
