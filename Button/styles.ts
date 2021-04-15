/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */
import { separatorHeight } from '../styles/util';
import { colors } from '../styles/color';

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
    borderColor: colors.separator,
    backgroundColor: colors.white
  },
  textDefault: {
    color: '#333'
    // fontSize
  },
  textOther: {
    color: '#FFF'
    // fontSize
  },
  textDisabled: {
    color: '#bcbcbc'
  },
  disabledStyle: {
    backgroundColor: '#dddddd'
  }
};
