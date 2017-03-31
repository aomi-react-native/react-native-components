import React from 'react';
import Component from '../AbstractComponent';
import { View } from 'react-native';
import { Colors, separatorHeight } from '../styles';

// noinspection JSSuspiciousNameCombination
const styles = {
  container: {
    flexDirection: 'column',
    borderWidth: separatorHeight,
    borderColor: Colors.separator,
    borderRadius: 7,
    backgroundColor: '#FFF'
  }
};

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/3/30
 */
export default class Card extends Component {

  static propTypes = {
    style: View.propTypes.style
  };

  render() {
    const {style, children, ...other} = this.props;
    return (
      <View {...other}
            style={[styles.container, style]}
      >
        {children}
      </View>
    );
  }

}
