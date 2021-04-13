import { StyleSheet } from 'react-native';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */

const radius = 12;
const radius2x = Math.floor(2 * radius);

export default StyleSheet.create<any>({
  container: {
    position: 'relative',
    paddingTop: radius2x,
    paddingRight: radius2x,
    paddingBottom: radius,
    paddingLeft: radius,
  },
  badgeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    width: radius2x,
    height: radius2x,
    borderRadius: 50,
    backgroundColor: 'rgb(255, 64, 129)',
  },
  badgeStyle: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: radius,
  },
});
