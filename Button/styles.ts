import { Colors, fontSize, separatorHeight } from '../styles';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */
export default {
  button: {
    borderRadius: 5,
    borderWidth: separatorHeight,
    borderColor: 'transparent',
    borderStyle: 'solid',
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 12,
    paddingRight: 12,
    overflow: 'hidden'
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerDefault: {
    borderColor: Colors.separator,
    backgroundColor: Colors.white
  },
  textDefault: {
    color: '#333',
    fontSize
  },
  textOther: {
    color: '#FFF',
    fontSize
  },
  textDisabled: {
    color: '#bcbcbc'
  },
  disabledStyle: {
    backgroundColor: '#dddddd'
  }
};
