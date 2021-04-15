import * as React from 'react';
import Component from '../AbstractComponent';
import { View } from 'react-native';
import { CardProps } from './Props';
import { separatorHeight } from '../styles/util';
import { colors } from '../styles/color';

// noinspection JSSuspiciousNameCombination
const styles: any = {
  container: {
    flexDirection: 'column',
    borderWidth: separatorHeight,
    borderColor: colors.separator,
    borderRadius: 7,
    backgroundColor: '#FFF'
  }
};

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/3/30
 */
export default class Card extends Component<CardProps> {
  render() {
    const { style, children, ...other } = this.props;
    return (
      <View {...other} style={[styles.container, style]}>
        {children}
      </View>
    );
  }
}
