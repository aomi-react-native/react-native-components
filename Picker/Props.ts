/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */
import { ReactNode } from 'react';
import { ReactNodeFunction } from '../Global';
import { StyleProp, ViewStyle } from 'react-native';
import { BaseFormPropTypes } from '../Form/AbstractFormComponent';

export default interface Props extends BaseFormPropTypes {
  editable?: boolean;
  cancelText?: ReactNode;
  confirmText?: ReactNode;
  defaultSelected?: any;
  selectedValue?: any;
  /**
   * On Android, specifies how to display the selection items when the user taps on the picker:
   *
   *   - 'dialog': Show a modal dialog. This is the default.
   *   - 'dropdown': Shows a dropdown anchored to the picker view
   *
   * @platform android
   */
  mode?: 'dialog' | 'dropdown';
  title?: string;
  onValueChange?: (value: any) => void;
  renderHeader?: ReactNodeFunction;
  style?: StyleProp<ViewStyle>;
}
