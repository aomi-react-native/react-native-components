import { Platform, StyleSheet } from 'react-native';
import { cyan } from '../colors/cyan';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/12/20
 */
const store = {
  styles: StyleSheet.create<any>({
    container: {
      position: 'relative',
      paddingBottom: 10
    },
    input: {
      borderWidth: 0,
      backgroundColor: 'transparent'
    },
    underline: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 7,
      borderWidth: 0.5,
      borderColor: '#e0e0e0',
      ...Platform.select({
        ios: {
          bottom: 4
        },
        android: {
          bottom: 7
        }
      })
    },
    underlineDisabled: {},
    underlineFocus: {
      borderColor: cyan['500'],
      borderWidth: 1
    },
    floatingLabel: {
      color: 'rgba(0, 0, 0, 0.3)'
    },
    floatingLabelFocus: {
      color: cyan['500']
    }
  })
};

export function getStyles() {
  return store.styles;
}

export function setStyles(styles) {
  store.styles = {
    ...store.styles,
    ...styles
  };
}
