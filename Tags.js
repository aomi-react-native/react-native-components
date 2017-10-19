import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Colors } from './styles';

const styles = {
  tags: {
    flexDirection: 'row',
    marginHorizontal: -5
  },
  container: {
    borderRadius: 50,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tag: {
    fontSize: 12,
    color: Colors.white
  }
};

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/10/18
 */
export class Tag extends Component {

  static defaultProps = {
    color: '#666'
  };

  render() {
    const {children, color, style, ...props} = this.props;

    const fontColor = {
      color
    };

    return (
      <View style={[styles.container]}>
        <Text {...props}
              style={[styles.tag, fontColor, style]}
        >
          {children}
        </Text>
      </View>
    );
  }

}

export default class Tags extends Component {

  render() {
    const {children} = this.props;
    return (
      <View style={[styles.tags]}>
        {children}
      </View>
    );
  }

}
