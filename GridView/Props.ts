/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */
import { StyleProp, ViewStyle } from 'react-native';

export default interface Props {
  cells: Array<any>;

  renderCell?: (data: { cell: any; cellId: number }) => void;

  autoWidth?: boolean;

  cellStyle?: StyleProp<ViewStyle>;

  cols?: number;

  containerStyle?: StyleProp<ViewStyle>;

  horizontalSpacing?: number;

  verticalSpacing?: number;

  style?: StyleProp<ViewStyle>;
}
