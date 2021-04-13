import * as React from 'react';
import Component from '../AbstractComponent';
import { View } from 'react-native';
import { BodyProps } from './Props';

const styles = {
  container: {
    flex: 1,
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
    paddingHorizontal: 10,
    paddingTop: 15,
  },
};

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/3/30
 */
export default class Body extends Component<BodyProps> {
  render() {
    const { style, children } = this.props;
    return <View style={[styles.container, style]}>{children}</View>;
  }
}
