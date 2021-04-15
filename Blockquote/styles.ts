import { StyleSheet } from 'react-native';
import { colors } from '../styles/color';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2018/1/31
 */

export const primary = {
  borderLeftColor: colors.primary
};
export const success = {
  borderLeftColor: colors.success
};
export const info = {
  borderLeftColor: colors.info
};
export const warn = {
  borderLeftColor: colors.warn
};
export const danger = {
  borderLeftColor: colors.danger
};

export const container = {
  borderWidth: StyleSheet.hairlineWidth,
  borderLeftWidth: 4,
  borderRadius: 3,
  borderColor: '#eee',
  borderLeftColor: colors.separator,
  paddingVertical: 10,
  paddingHorizontal: 15
};

export const titleText: any = {
  fontSize: 16,
  fontWeight: '500',
  marginBottom: 5
};
