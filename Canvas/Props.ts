/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */
import { GestureResponderEvent, PanResponderGestureState } from 'react-native';

export default interface Props {
  touchStart?: (
    e: GestureResponderEvent,
    gestureState: PanResponderGestureState
  ) => void;
  touchMove?: (
    e: GestureResponderEvent,
    gestureState: PanResponderGestureState
  ) => void;
}
