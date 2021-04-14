import { StyleSheet } from 'react-native';
import { Colors } from '../styles/color';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2018/1/31
 */

export const primary = {
  borderLeftColor: Colors.primary
};
export const success = {
  borderLeftColor: Colors.success
};
export const info = {
  borderLeftColor: Colors.info
};
export const warn = {
  borderLeftColor: Colors.warning
};
export const danger = {
  borderLeftColor: Colors.danger
};

export const container = {
  borderWidth: StyleSheet.hairlineWidth,
  borderLeftWidth: 4,
  borderRadius: 3,
  borderColor: '#eee',
  borderLeftColor: Colors.separator,
  paddingVertical: 10,
  paddingHorizontal: 15
};

export const titleText: any = {
  fontSize: 16,
  fontWeight: '500',
  marginBottom: 5
};
