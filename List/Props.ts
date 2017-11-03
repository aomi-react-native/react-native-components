import { ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */

export interface Row {
  header?: ReactNode;
  body: ReactNode;
  footer?: ReactNode;
  displayRightArrow?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default interface Props {
  data: Array<Row>;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  displayRightArrow?: boolean;

  fullSeparator?: boolean;
  separatorColor?: string;
  onItemPress?: (row: Row) => void;

  itemStyle?: StyleProp<ViewStyle>;
  headerTextStyle?: StyleProp<TextStyle>;
  bodyTextStyle?: StyleProp<TextStyle>;
  footerTextStyle?: StyleProp<TextStyle>;
}
