import InputProps from '../../Input/Props';
import { StyleProp, ViewStyle } from 'react-native';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/12/20
 */
export interface Props extends InputProps {
  /**
   * Override the inline-styles of the TextField's underline element when disabled.
   */
  underlineDisabledStyle?: StyleProp<ViewStyle>
  /**
   * Override the inline-styles of the TextField's underline element when focussed.
   */
  underlineFocusStyle?: StyleProp<ViewStyle>
  /**
   * Override the inline-styles of the TextField's underline element.
   */
  underlineStyle?: StyleProp<ViewStyle>,
  /**
   * If true, shows the underline for the text field.
   */
  underlineShow?: boolean
}
