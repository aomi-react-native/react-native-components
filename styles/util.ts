import { Dimensions, Platform, StyleSheet } from 'react-native';

export function getWindowSize() {
  const { width, height } = Dimensions.get('window');
  return {
    width,
    height
  };
}

// noinspection JSSuspiciousNameCombination
export const separatorHeight = StyleSheet.hairlineWidth;

export const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

export const STATUSBAR_HEIGHT = Platform.select({
  ios: getWindowSize().height === 812 ? 44 : 20,
  android: 0
});

export const HEADER_HEIGHT = APPBAR_HEIGHT + STATUSBAR_HEIGHT;
