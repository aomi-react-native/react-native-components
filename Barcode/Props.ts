import { ReactNodeFunction, Size } from '../Global';
import { StyleProp, ViewStyle } from 'react-native';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */
export default interface Props {
  barCodeTypes?: string[];
  renderBottom?: ReactNodeFunction;
  renderTop?: ReactNodeFunction;
  scanLineStyle?: StyleProp<ViewStyle>;
  windowSize?: Size;
  onSuccess?: (data:any) => void;
}
