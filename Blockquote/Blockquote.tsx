import * as React from 'react';
import Component from '../AbstractComponent';
import { Text, View } from 'react-native';
import { Props } from './Props';

import * as styles from './styles';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2018/1/31
 */
export class Blockquote extends Component<Props> {

  render() {
    const {style, type, title, titleStyle, children} = this.props;

    return (
      <View style={[styles.container, styles[type], style]}>
        {title && (
          <Text style={[
            styles.titleText,
            {color: (styles[type] || {}).borderLeftColor},
            titleStyle
          ]}
          >
            {title}
          </Text>
        )}
        {children}
      </View>
    );
  }

}
