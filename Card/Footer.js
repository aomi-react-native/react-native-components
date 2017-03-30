import React from 'react';
import Component from '../AbstractComponent';
import { View } from 'react-native';

const styles = {
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10
  }
};

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/3/30
 */
export default class Footer extends Component {

  render() {
    const {children} = this.props;
    return (
      <View style={styles.container}>
        {children}
      </View>
    );
  }

}
