import { StyleSheet } from 'react-native';
import { style } from '../styles/style';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */

const borderStyle = {
  position: 'absolute',
  width: 40,
  height: 40,
  borderColor: '#46b8da'
};
export default StyleSheet.create<any>({
  container: {
    flex: 1,
    position: 'relative'
  },
  captureWindow: {
    ...style.fullScreenAbsolute
  },
  cell: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  cellBg: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  window: {
    backgroundColor: 'transparent',
    position: 'relative'
  },
  windowStyle: {
    ...style.fullScreenAbsolute,
    borderWidth: 5,
    borderColor: 'rgba(0, 0, 0, 0.5)'
  },
  top: {
    ...borderStyle,
    top: 1,
    left: 1,
    borderTopWidth: 5,
    borderLeftWidth: 5
  },
  right: {
    ...borderStyle,
    top: 1,
    right: 1,
    borderTopWidth: 5,
    borderRightWidth: 5
  },
  bottom: {
    ...borderStyle,
    bottom: 1,
    right: 1,
    borderBottomWidth: 5,
    borderRightWidth: 5
  },
  left: {
    ...borderStyle,
    bottom: 1,
    left: 1,
    borderBottomWidth: 5,
    borderLeftWidth: 5
  }
});
