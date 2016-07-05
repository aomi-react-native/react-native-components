import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import Component from './AbstractComponent';
import { View as AnimatableView } from 'react-native-animatable';


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  loadingStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.4)'
  },
  content: {
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  text: {
    color: '#FFF'
  }
});

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/24
 */
class Dialog extends Component {

  static propTypes = {
    hideAnimation: PropTypes.object,
    loadProps: PropTypes.object,
    loading: PropTypes.bool,
    loadChildren: PropTypes.node,
    showAnimation: PropTypes.object,
    statusBarAutoHidden: PropTypes.bool,
    style: View.propTypes.style,
    visible: PropTypes.bool,
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

  componentWillUnmount() {
    if (this.statusBarHidden) {
      StatusBar.setHidden(false);
    }
    this.mounted = false;
  }

  mounted = true;

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
    } else {
      if (this.statusBarHidden) {
        this.statusBarHidden = false;
        StatusBar.setHidden(false);
      }
    }

    this.setState({
      visible,
      animating: false
    });

  }

  renderLoading(loadProps, loadChildren) {
    return (
      <View style={styles.content}>
        <ActivityIndicator {...loadProps}/>
        <View style={{height: 5}}/>
        {
          typeof loadChildren === 'string' ? (
            <Text style={styles.text}>
              {loadChildren}
            </Text>
          ) : loadChildren
        }
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
      loading,
      loadProps,
      loadChildren
    } = this.props;

    if (!visible && !this.state.visible) {
      return <View />;
    }

    let animation = visible ? showAnimation : hideAnimation;

    let tmp = loading ? styles.loadingStyle : null;

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
        {loading ? this.renderLoading(loadProps, loadChildren) : children}
      </AnimatableView>
    );
  }
}

export default Dialog;
