import { Dimensions, Platform, StyleSheet } from 'react-native';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/7/20
 */

export const Colors = {
  separator: '#bbbbbb',
  underlay: '#f5f5f9',
  white: '#FFF',
  primary: '#337ab7',
  success: '#5cb85c',
  info: '#5bc0de',
  warning: '#f0ad4e',
  danger: '#d9534f',
  fontColor: '#1a1a1a',
};

export const fontSize = 17;

// noinspection JSSuspiciousNameCombination
export const separatorHeight = StyleSheet.hairlineWidth;

export const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

export const STATUSBAR_HEIGHT = Platform.select({
  ios: getWindowSize().height === 812 ? 44 : 20,
  android: 0,
});

export const HEADER_HEIGHT = APPBAR_HEIGHT + STATUSBAR_HEIGHT;

export function getWindowSize() {
  const { width, height } = Dimensions.get('window');
  return {
    width,
    height,
  };
}

export default {
  fullScreenAbsolute: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
  },
  flexColumn: {
    flex: 1,
    flexDirection: 'column',
  },
};
