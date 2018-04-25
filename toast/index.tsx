/**
 * @author Sean sean.snow@live.com
 */

import * as React from 'react';
import Component from '../AbstractComponent';
import { Platform, StyleProp, StyleSheet, Text, ToastAndroid, ViewStyle } from 'react-native';
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
  msg?: string
  show?: boolean
  containerStyle?: StyleProp<ViewStyle>
  contentStyle?: StyleProp<ViewStyle>
}

export class Toast extends Component<ToastProps> {

  static defaultProps = {
    children: '',
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
    const {children, show, containerStyle, contentStyle} = this.props;
    const animatable = show ? this.showAnimation : this.hideAnimation;
    let newChildren = children;
    if (typeof children === 'string') {
      newChildren = (
        <Text style={styles.msg}>{children}</Text>
      );
    }
    return (
      <View {...animatable}
            style={[styles.container, containerStyle]}
      >
        <View style={[styles.content, contentStyle]}>
          {newChildren}
        </View>
      </View>
    );
  }

}

export const SHORT = Platform.OS === 'android' ? ToastAndroid.SHORT : 2500;
export const LONG = Platform.OS === 'android' ? ToastAndroid.LONG : 3500;

const config = {
  duration: SHORT
};


/**
 * 显示一个默认的toast弹框
 * @param msg 问题消息
 * @param duration 持续时间
 */
export default function show(msg, duration?) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, duration || config.duration);
    return;
  }

  if (Platform.OS === 'ios') {
    toast({children: msg, duration});
  }

}

/**
 * 使用自定义UI的toast
 */
export function toast({duration, ...props}: any = {}) {
  const manager = createRootView(Toast, {});
  const args: any = {
    ...props,
    manager
  };
  manager.update(args);
  setTimeout(() => {
    args.show = false;
    manager.update(args);
    setTimeout(manager.destroy, 600);
  }, duration || config.duration);
}

/**
 * 设置关闭时间
 * @param duration 关闭时间,毫秒
 */
export function setDuration(duration) {
  config.duration = duration;
}
