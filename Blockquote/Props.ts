import { StyleProp, TextStyle, ViewProperties } from 'react-native';
import { ReactNode } from 'react';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2018/1/31
 */
export interface Props extends ViewProperties {
  type?:
    | 'primary'
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'link'
    | 'default';
  title?: ReactNode;
  titleStyle?: StyleProp<TextStyle>;
}
