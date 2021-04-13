import { StyleSheet } from 'react-native';
import { Colors, separatorHeight } from '../styles';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */

const height = 50;

export default StyleSheet.create<any>({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.4)',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    margin: 10,
  },
  content: {
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  title: {
    height,
    justifyContent: 'center',
    borderColor: Colors.separator,
    borderBottomWidth: separatorHeight,
  },
  titleText: {
    color: '#8F8F91',
    textAlign: 'center',
    fontSize: 16,
  },
  button: {
    borderRadius: 0,
    height,
    borderColor: Colors.separator,
    borderBottomWidth: separatorHeight,
  },
  cancel: {
    marginTop: 10,
    height,
    justifyContent: 'center',
    borderWidth: 0,
  },
  cancelText: {
    fontWeight: '700',
    color: '#0977FF',
    fontSize: 18,
  },
});
