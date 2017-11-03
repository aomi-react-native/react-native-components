import * as React from 'react';
import Component from '../AbstractComponent';
import { Text, View } from 'react-native';

import Props from './Props';
import styles from './styles';


/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/6/13
 */
export class Badge extends Component<Props> {


  renderBadge(badgeContent, badgeContainerStyle, badgeStyle) {

    if (!badgeContent || badgeContent === 0) {
      return null;
    }

    let children;
    if (badgeContent instanceof Component) {
      children = badgeContent;
    } else {
      children = (
        <Text style={[styles.badgeStyle, badgeStyle]}>
          {badgeContent}
        </Text>
      );
    }
    return (
      <View style={[styles.badgeContainer, badgeContainerStyle]}>
        {children}
      </View>
    );
  }

  render() {

    const {
      badgeContainerStyle,
      badgeContent,
      badgeStyle,
      children,
      style,
      ...other
    } = this.props;

    return (
      <View {...other}
            style={[styles.container, style]}
      >
        {children}
        {this.renderBadge(badgeContent, badgeContainerStyle, badgeStyle)}
      </View>
    );
  }
}

