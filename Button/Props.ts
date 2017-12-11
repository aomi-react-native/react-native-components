import { ReactElement } from 'react';
import { GestureResponderEvent, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { BaseProps } from '../Global';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */
export default interface Props extends BaseProps {
  Comp?: any;
  after?: ReactElement<any>;
  autoDismissKeyboard?: boolean;
  before?: ReactElement<any>;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  disabledStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  type?: 'primary' | 'success' | 'info' | 'warn' | 'danger' | 'link' | 'default';
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
}
