import * as React from 'react';
import { ActivityIndicator, BackHandler, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import Component from '../AbstractComponent';
import { View as AnimatableView } from 'react-native-animatable';
import createRootNode from '../createRootNode/index';
import RootManager from '../createRootNode/RootManager';
import Props from './Props';

import styles from './styles';


function handleAndroidBackPress() {
  return true;
}

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/24
 */
export class AbstractDialog extends Component<Props> {

  static defaultProps = {
    autoDisableAndroidBackPress: true,
    activeOpacity: 1,
    visible: false,
    statusBarAutoHidden: true
  };

  state = {
    animating: false,
    visible: false
  };

  mounted = true;
  statusBarHidden = false;

  componentWillMount() {
    this.handleHardwareBackPress();
  }

  componentWillReceiveProps() {
    this.handleHardwareBackPress();
  }

  shounldComponentUpdate() {
    return !this.state.animating;
  }

  componentWillUnmount() {
    if (this.statusBarHidden) {
      StatusBar.setHidden(false);
    }
    this.mounted = false;
  }

  handleHardwareBackPress() {
    if (this.state.visible) {
      BackHandler.addEventListener('hardwareBackPress', handleAndroidBackPress);
    } else {
      BackHandler.removeEventListener('hardwareBackPress', handleAndroidBackPress);
    }
  }

  handlePress() {
    let {onPress} = this.props;
    onPress && onPress();
  }

  handleAnimationBegin() {
    this.setState({animating: true});
  }

  handleAnimationEnd() {
    if (!this.mounted) {
      return;
    }
    let {
      visible,
      statusBarAutoHidden
    } = this.props;

    if (visible) {
      if (statusBarAutoHidden) {
        this.statusBarHidden = true;
        StatusBar.setHidden(true);
      }
    } else if (this.statusBarHidden) {
      this.statusBarHidden = false;
      StatusBar.setHidden(false);
    }

    this.setState({
      visible,
      animating: false
    });

  }

  renderLoading({children, loadingProps}) {
    let child;
    if (typeof children === 'string') {
      child = <Text style={styles.text}>{children}</Text>;
    } else if (Array.isArray(children) && typeof children[0] === 'string') {
      child = <Text style={styles.text}>{children}</Text>;
    } else {
      child = children;
    }
    return (
      <View style={styles.content}>
        <ActivityIndicator {...loadingProps}/>
        {child}
      </View>
    );
  }


  render() {

    let {
      children,
      activeOpacity,
      visible,
      style,
      showAnimation,
      hideAnimation,
      loadingDialog,
      loadingProps
    } = this.props;

    if (!visible && !this.state.visible) {
      return <View/>;
    }

    let animation = visible ? showAnimation : hideAnimation;

    let tmp = loadingDialog ? styles.loadingStyle : null;

    return (
      <AnimatableView {...animation}
                      onAnimationBegin={this.handleAnimationBegin}
                      onAnimationEnd={this.handleAnimationEnd}
                      style={[styles.container, tmp, style]}
      >
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={this.handlePress}
          style={styles.container}
        />
        {loadingDialog ? this.renderLoading({
          children,
          loadingProps
        }) : children}
      </AnimatableView>
    );
  }
}

export default createRootNode(AbstractDialog);
