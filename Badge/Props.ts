import * as React from 'react';
import { StyleProp, ViewProperties, ViewStyle } from 'react-native';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */

export default interface Props extends ViewProperties {
  badgeContainerStyle?: StyleProp<ViewStyle>;
  badgeContent?: React.ReactNode;
  badgeStyle?: StyleProp<ViewStyle>;
}
