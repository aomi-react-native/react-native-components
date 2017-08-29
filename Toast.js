/**
 * @author Sean sean.snow@live.com
 */

import React from 'react';
import PropTypes from 'prop-types';
import Component from './AbstractComponent';
import { Platform, StyleSheet, Text, ToastAndroid } from 'react-native';
import RootSiblings from 'react-native-root-siblings';
import { View } from 'react-native-animatable';

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

class ToastIOS extends Component {

  static propTypes = {
    duration: PropTypes.number,
    msg: PropTypes.string,
    show: PropTypes.bool
  };

  static defaultProps = {
    msg: '',
    show: true
  };

  constructor(props) {
    super(props);
    this.state = {
      show: props.show
    };
  }

  state = {};

  componentDidMount() {
    this.closeTask = setTimeout(() => {
      this.setState({show: false});
      setTimeout(() => {
        this.props.manager.destroy();
      }, 600);
    }, this.props.duration);
  }

  componentWillUnmount() {
    this.closeTask && clearTimeout(this.closeTask);
  }

  closeTask;

  showAnimation = {
    animation: 'fadeIn',
    duration: 500
  };

  hideAnimation = {
    animation: 'fadeOut',
    duration: 500
  };

  render() {
    const {msg} = this.props;
    let animatable = this.state.show ? this.showAnimation : this.hideAnimation;
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

export default function show(msg, duration) {

  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, duration || config.duration);
    return;
  }

  if (Platform.OS === 'ios') {
    const toast = new RootSiblings(<View/>);
    toast.update(
      <ToastIOS duration={duration || config.duration}
                manager={toast}
                msg={msg}
      />
    );
  }

}

export function setDefaultDuration(duration) {
  config.duration = duration;
}

export function toastWithComponent(ToastComponent, props) {
  const toast = new RootSiblings(<View/>);
  toast.update(
    <ToastComponent {...props}
                    manager={toast}
    />
  );
}

