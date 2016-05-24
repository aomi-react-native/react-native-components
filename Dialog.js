import React, {
  Component,
  PropTypes
} from 'react';
import  {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity
} from 'react-native';

import AbstractComponent from './AbstractComponent';
import { View as AnimatableView } from 'react-native-animatable';


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }
});

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/24
 */
class Dialog extends AbstractComponent {

  static propTypes = {
    style: View.propTypes.style,
    visible: PropTypes.bool,
    hideAnimation: PropTypes.object,
    showAnimation: PropTypes.object,
    statusBarAutoHidden: PropTypes.bool,
    onPress: PropTypes.func
  };

  static defaultProps = {
    activeOpacity: 1,
    visible: false,
    statusBarAutoHidden: true
  };

  state = {
    animating: false,
    visible: false
  };

  shounldComponentUpdate() {
    return !this.state.animating;
  }

  handlePress() {
    let {onPress} = this.props;
    onPress && onPress();
  }

  handleAnimationBegin() {
    this.setState({animating: true});
  }

  handleAnimationEnd() {
    let {
      visible,
      statusBarAutoHidden,
    } = this.props;

    if (visible) {
      if (statusBarAutoHidden) {
        this.statusBarHidden = true;
        StatusBar.setHidden(true)
      }
    } else {
      if (this.statusBarHidden) {
        this.statusBarHidden = false;
        StatusBar.setHidden(false)
      }
    }

    this.setState({
      visible,
      animating: false
    });

  }

  render() {

    let {
      children,
      activeOpacity,
      visible,
      style,
      showAnimation,
      hideAnimation,
    } = this.props;

    if (!visible && !this.state.visible) {
      return <View />
    }

    let animation = visible ? showAnimation : hideAnimation;

    return (
      <AnimatableView
        {...animation}
        style={[styles.container, style]}
        onAnimationBegin={this.handleAnimationBegin}
        onAnimationEnd={this.handleAnimationEnd}
      >
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={this.handlePress}
          style={styles.container}
        />
        {children}
      </AnimatableView>
    )

  }
}

export default Dialog;
