import { ReactNode } from 'react';
import {
  FlatListProperties,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */

export interface Row {
  header?: ReactNode;
  body: ReactNode;
  footer?: ReactNode;
  rightArrow?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default interface Props extends FlatListProperties<Row> {
  header?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  rightArrow?: ReactNode;

  fullSeparator?: boolean;
  separatorColor?: string;
  onItemPress?: (row: Row) => void;

  itemStyle?: StyleProp<ViewStyle>;
  headerTextStyle?: StyleProp<TextStyle>;
  bodyTextStyle?: StyleProp<TextStyle>;
  footerTextStyle?: StyleProp<TextStyle>;
}
