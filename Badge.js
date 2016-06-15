import React, { PropTypes } from 'react';
import Component from './AbstractComponent';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

const radius = 12;
const radius2x = Math.floor(2 * radius);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingTop: radius2x,
    paddingRight: radius2x,
    paddingBottom: radius,
    paddingLeft: radius
  },
  badgeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    width: radius2x,
    height: radius2x,
    borderRadius: 50,
    backgroundColor: 'rgb(255, 64, 129)'
  },
  badgeStyle: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: radius
  }
});

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/6/13
 */
class Badge extends Component {

  static propTypes = {
    badgeContainerStyle: View.propTypes.style,
    badgeContent: PropTypes.node,
    badgeStyle: Text.propTypes.style,
    children: PropTypes.node
  };

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

export default Badge;
