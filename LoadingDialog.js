import React, { PropTypes } from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  ProgressBarAndroid,
  ActivityIndicatorIOS
} from 'react-native';
import AbstractComponent from './AbstractComponent';
import Dialog from './Dialog';

const styles = StyleSheet.create({
  content: {
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  text: {
    color: '#FFF'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.4)'
  }
});

/**
 * 全屏加载弹出框
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/24
 */
class LoadingDialog extends AbstractComponent {

  static propTypes = {
    children: PropTypes.node,
    hideAnimation: PropTypes.object,
    loadProps: PropTypes.object,
    minShowTime: PropTypes.number,
    showAnimation: PropTypes.object,
    statusBarAutoHidden: PropTypes.bool,
    style: View.propTypes.style
  };

  static defaultProps = {
    children: 'loading ...',
    hideAnimation: {
      animation: 'fadeOut'
    },
    minShowTime: 1500,
    loadProps: {
      color: '#FFF'
    },
    showAnimation: {
      animation: 'fadeIn'
    },
    statusBarAutoHidden: false
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible
    };

    setTimeout(()=> {
      this.canClose = true;
    }, props.minShowTime);
  }

  state = {};

  taskId;
  canClose = false;


  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible) {
      if (nextProps.visible) {
        this.setState({visible: true});
      } else {
        this.close();
      }
    }
  }

  componentWillUnmount() {
    this.taskId && clearTimeout(this.taskId);
  }

  close() {
    if (this.canClose) {
      this.setState({visible: false});
    }
  }

  renderLoading() {
    let content = null;
    const {loadProps, children} = this.props;
    if (Platform.OS === 'android') {
      content = (
        <ProgressBarAndroid {...loadProps} />
      );
    }
    if (Platform.OS === 'ios') {
      content = (
        <ActivityIndicatorIOS {...loadProps}/>
      );
    }
    return (
      <View style={[styles.content]}>
        {content}
        <View style={{height: 5}}/>
        {
          typeof children === 'string' ? (
            <Text style={styles.text}>
              {children}
            </Text>
          ) : children
        }
      </View>
    );


  }

  handlePress() {
    console.log('loading dialog press');
  }

  render() {
    let {style, ...other} = this.props;

    return (
      <Dialog {...other}
        onPress={this.handlePress}
        style={[styles.container, style]}
        visible={this.state.visible}
      >
        {this.renderLoading()}
      </Dialog>
    );
  }
}

export default LoadingDialog;
