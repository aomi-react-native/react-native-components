import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Colors } from '../styles';

const styles = StyleSheet.create<any>({
  tags: {
    flexDirection: 'row',
    marginHorizontal: -5,
  },
  container: {
    borderRadius: 50,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tag: {
    fontSize: 12,
    color: Colors.white,
  },
});

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/10/18
 */
export class Tag extends React.Component<any> {
  static defaultProps = {
    color: '#666',
  };

  render() {
    const { children, color, style, ...props } = this.props;

    const fontColor = {
      color,
    };

    return (
      <View style={[styles.container]}>
        <Text {...props} style={[styles.tag, fontColor, style]}>
          {children}
        </Text>
      </View>
    );
  }
}

export default class Tags extends React.Component<any> {
  render() {
    const { children } = this.props;
    return <View style={[styles.tags]}>{children}</View>;
  }
}
