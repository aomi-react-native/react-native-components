import * as React from 'react';
import AbstractComponent from '../../AbstractComponent';
import { View, Animated, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Input from '../../Input/index';

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

  constructor(props) {
    super(props);
    this.state = {};
    if (props.underlineShow) {
      this.state.focus = props.autoFocus;
      this.state.borderValue = new Animated.Value(this.getBorderStartValue());
    }
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
      ...props
    } = this.props;

    return (
      <View style={getStyles().container}>
        <Input {...props}
               onBlur={this.handleBlur}
               onFocus={this.handleFocus}
               style={getStyles().input}
        />
        {this.renderUnderline()}
      </View>
    );
  }

}
