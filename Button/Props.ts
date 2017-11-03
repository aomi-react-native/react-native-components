import { ReactNode } from 'react';
import { StyleProp, TextStyle, TouchableHighlightProperties, TouchableNativeFeedbackProperties, TouchableOpacityProperties, ViewStyle } from 'react-native';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */
export default interface Props extends TouchableNativeFeedbackProperties, TouchableOpacityProperties, TouchableHighlightProperties {
  Comp?: any;
  after?: ReactNode;
  autoDismissKeyboard?: boolean;
  before?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  disabledStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  type: 'primary' | 'success' | 'info' | 'warn' | 'danger' | 'link' | 'default';
}
