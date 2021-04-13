import { Platform, StyleSheet } from 'react-native';
import { cyan } from '../colors/cyan';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/12/20
 */
const store = {
  styles: StyleSheet.create<any>({
    container: {},
    input: {
      borderWidth: 0,
      backgroundColor: 'transparent',
    },
    underline: {
      marginTop: 3,
      height: 0.5,
      backgroundColor: '#e0e0e0',
    },
    underlineDisabled: {},
    underlineFocus: {
      backgroundColor: cyan['500'],
      height: 1,
    },
    floatingLabel: {
      color: 'rgba(0, 0, 0, 0.3)',
    },
    floatingLabelFocus: {
      color: cyan['500'],
    },
  }),
};

export function getStyles() {
  return store.styles;
}

export function setStyles(styles) {
  store.styles = {
    ...store.styles,
    ...styles,
  };
}
