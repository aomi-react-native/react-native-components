/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */
import { ViewProperties } from 'react-native';
import { EmptyFunction } from '../Global';

export default interface Props extends ViewProperties {
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
