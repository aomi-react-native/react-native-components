import React, { PropTypes } from 'react';
import AbstractComponent from './AbstractComponent';
import Dialog from './Dialog';

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
    statusBarAutoHidden: PropTypes.bool
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

  render() {
    let {children, ...other} = this.props;
    return (
      <Dialog {...other}
        loadChildren={children}
        loading
        visible={this.state.visible}
      />
    );
  }
}

export default LoadingDialog;
