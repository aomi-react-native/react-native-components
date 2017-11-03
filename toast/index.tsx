/**
 * @author Sean sean.snow@live.com
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import Component from '../AbstractComponent';
import { Platform, StyleSheet, Text, ToastAndroid } from 'react-native';
import { View } from 'react-native-animatable';
import { createRootView } from '../createRootNode/index';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    minHeight: 40,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3A3A3A',
    borderRadius: 25,
    paddingHorizontal: 20
  },
  msg: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16
  }
});

export interface ToastProps {
  msg?: string;
  show?: boolean;
}

class ToastIOS extends Component<ToastProps> {

  static propTypes = {
    msg: PropTypes.string,
    show: PropTypes.bool
  };

  static defaultProps = {
    msg: '',
    show: true
  };

  state = {};

  showAnimation = {
    animation: 'fadeIn',
    duration: 500
  };

  hideAnimation = {
    animation: 'fadeOut',
    duration: 500
  };

  render() {
    const {msg, show} = this.props;
    const animatable = show ? this.showAnimation : this.hideAnimation;
    return (
      <View {...animatable}
            style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.msg}>{msg}</Text>
        </View>
      </View>
    );
  }

}

export const SHORT = Platform.OS === 'android' ? ToastAndroid.SHORT : 2500;
export const LONG = Platform.OS === 'android' ? ToastAndroid.LONG : 5000;

const config = {
  duration: SHORT
};


/**
 * 显示一个默认的toast弹框
 * @param msg 问题消息
 * @param duration 持续时间
 */
export default function show(msg, duration) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, duration || config.duration);
    return;
  }

  if (Platform.OS === 'ios') {
    const manager = createRootView(ToastIOS, {});
    const args: any = {
      msg,
      manager
    };
    manager.update(args);
    setTimeout(() => {
      args.show = false;
      manager.update(args);
      setTimeout(manager.destroy, 600);
    }, duration || config.duration);
  }

}

/**
 * 设置关闭时间
 * @param duration 关闭时间,毫秒
 */
export function setDuration(duration) {
  config.duration = duration;
}
