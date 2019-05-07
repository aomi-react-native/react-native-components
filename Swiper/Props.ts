/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */
import { StyleProp, ViewStyle } from 'react-native';
import { ReactNode } from 'react';

export interface Props {
  autoPlay?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  duration?: number,
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  inactiveColor?: string;
  activeColor?: string;
}
