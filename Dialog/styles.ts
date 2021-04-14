import { StyleSheet } from 'react-native';
import { style } from '../styles/style';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */

export default StyleSheet.create<any>({
  container: {
    ...style.fullScreenAbsolute
  },
  loadingStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.4)'
  },
  content: {
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  text: {
    marginTop: 5,
    color: '#FFF'
  }
});
