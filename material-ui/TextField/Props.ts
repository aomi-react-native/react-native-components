import InputProps from '../../Input/Props';
import { StyleProp, ViewStyle } from 'react-native';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/12/20
 */
export interface Props extends InputProps {
  /**
   * root View style
   */
  containerStyle?: StyleProp<ViewStyle>

  /**
   * If true, the floating label will float even when there is no value.
   */
  floatingLabelFixed?: boolean

  /**
   * The style object to use to override floating label styles when focused.
   */
  floatingLabelFocusStyle?: StyleProp<ViewStyle>

  /**
   * The style object to use to override floating label styles when shrunk.
   */
  floatingLabelShrinkStyle?: StyleProp<ViewStyle>

  /**
   * The style object to use to override floating label styles.
   */
  floatingLabelStyle?: StyleProp<ViewStyle>

  /**
   * The content to use for the floating label element.
   */
  floatingLabelText?: string

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
