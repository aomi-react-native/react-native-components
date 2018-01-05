import * as React from 'react';
import AbstractComponent from '../../AbstractComponent';
import { View, Animated, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Input from '../../Input';
import Picker from '../../Picker';

import { Props } from './Props';
import { getStyles } from './styles';


/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/12/20
 */
export default class TextField extends AbstractComponent<Props> {

  static defaultProps = {
    underlineShow: true
  };

  state;

  // refs
  input;

  constructor(props) {
    super(props);
    this.state = {};
    if (props.underlineShow) {
      this.state.focus = props.autoFocus;
      this.state.borderValue = new Animated.Value(this.getBorderStartValue());
    }
  }

  focus() {
    this.input && this.input.focus();
  }

  getBorderStartValue() {
    const style: StyleProp<ViewStyle> = [getStyles().underline, this.props.underlineStyle];
    return StyleSheet.flatten(style).borderWidth || 0.5;
  }

  getBorderEndValue() {
    const style: StyleProp<ViewStyle> = [getStyles().underlineFocus, this.props.underlineFocusStyle];
    return StyleSheet.flatten(style).borderWidth || 1;
  }

  handleFocus() {
    const {onFocus, underlineShow} = this.props;
    if (underlineShow) {
      this.setState({focus: true}, () => Animated.timing(this.state.borderValue, {
        toValue: this.getBorderEndValue()
      }).start());
    }
    onFocus && onFocus();
  }

  handleBlur() {
    const {onBlur, underlineShow} = this.props;
    if (underlineShow) {
      this.setState({focus: false}, () => Animated.timing(this.state.borderValue, {
        toValue: this.getBorderStartValue()
      }).start());
    }
    onBlur && onBlur();
  }

  renderFloatingLabel() {
    const {
      floatingLabelText,
      floatingLabelStyle,
      floatingLabelFocusStyle
    } = this.props;
    const style = [];
    style.push(getStyles().floatingLabel);
    style.push(floatingLabelStyle);

    if (this.state.focus) {
      style.push(getStyles().floatingLabelFocus);
      style.push(floatingLabelFocusStyle);
    }

    return (
      <Animated.Text style={style}>
        {floatingLabelText}
      </Animated.Text>
    )
  }

  renderUnderline() {
    const {underlineShow, underlineStyle} = this.props;
    if (!underlineShow) {
      return null;
    }
    const style = [];
    const {
      editable,
      underlineDisabledStyle,
      underlineFocusStyle
    } = this.props;

    style.push(getStyles().underline);
    style.push(underlineStyle);
    if (editable && !editable) {
      style.push(getStyles().underlineDisabled);
      style.push(underlineDisabledStyle);
    }

    if (this.state.focus) {
      style.push(getStyles().underlineFocus);
      style.push(underlineFocusStyle);
    }
    return (
      <Animated.View style={[style, {borderWidth: this.state.borderValue}]}/>
    )
  }

  render() {

    const {
      containerStyle,
      type,
      children,
      ...props
    } = this.props;

    let comp: any = (
      <Input {...props}
             children={children}
             ref={input => this.input = input}
             onBlur={this.handleBlur}
             onFocus={this.handleFocus}
             style={getStyles().input}
      />
    );
    if (type === 'select') {
      comp = (
        <Picker {...props}
                style={getStyles().input}
        >
          {children}
        </Picker>
      );
    } else if (children) {
      comp = children;
    }

    return (
      <View style={[getStyles().container, containerStyle]}>
        {this.renderFloatingLabel()}
        {comp}
        {this.renderUnderline()}
      </View>
    );
  }

}
