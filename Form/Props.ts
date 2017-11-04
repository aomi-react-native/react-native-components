import * as React from 'react';
import Form from './index';
import { StyleProp, ViewStyle } from 'react-native';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */
export interface Props {
  renderChildren: (form: Form) => React.ReactNode;
  style?: StyleProp<ViewStyle>;
}
