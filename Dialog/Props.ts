/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */
import { ViewProps } from 'react-native';
import { EmptyFunction } from '../Global';

export default interface Props extends ViewProps {
  activeOpacity?: number;
  autoHardwareBackPress?: boolean;
  hideAnimation?: any;
  loadingDialog?: boolean;
  loadingProps?: any;
  showAnimation?: any;
  statusBarAutoHidden?: boolean;
  visible?: boolean;
  onPress?: EmptyFunction;
}
