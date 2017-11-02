import React from 'react';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import Component from './AbstractComponent';
import { Keyboard, Text, View, ViewPropTypes } from 'react-native';
import { createRootView } from './createRootNode';
import { AbstractDialog } from './Dialog';
import Button from './Button';
import { Colors, fontSize } from './styles';

const styles = {
  mask: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.4)'
  },
  container: {
    marginHorizontal: 15,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 0.1,
    minHeight: 100,
    overflow: 'hidden'
  },
  content: {
    paddingHorizontal: 10
  },
  title: {
    textAlign: 'center',
    fontSize,
    padding: 15
  },
  buttonGroup: {
    marginTop: 15
  },
  twoButton: {
    flexDirection: 'row'
  },
  buttonStyle: {
    flex: 1
  },
  button: {
    borderRadius: 0
  }
};

const popupShowAnimation = {
  animation: 'slideInUp',
  duration: 300
};

const popupHideAnimation = {
  animation: 'slideOutDown',
  duration: 300
};

class SceneModal extends Component {

  static propTypes = {
    /**
     * 按钮组,属性参考Button props
     */
    buttons: PropTypes.array,
    /**
     * 内容
     */
    content: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    /**
     * 内容容器样式
     */
    contentStyle: ViewPropTypes.style,
    /**
     * 隐藏时候的动画
     */
    hideAnimation: PropTypes.object,
    /**
     * 蒙版样式
     */
    maskStyle: ViewPropTypes.style,
    /**
     * 显示动画
     */
    showAnimation: PropTypes.object,
    /**
     * 标题
     */
    title: PropTypes.string,
    /**
     * 背景层点击
     */
    onDismiss: PropTypes.func,
  };

  static defaultProps = {
    buttons: []
  };

  static childContextTypes = {
    destroy: PropTypes.func
  };

  getChildContext() {
    return {
      destroy: this.handleClose
    };
  }

  state = {};

  constructor(props) {
    super(props);
    const {showAnimation, scene} = props;
    let animation = {};
    switch (scene) {
      case 'popup':
        animation = showAnimation || popupShowAnimation;
        break;
      default:
        break;
    }
    this.state = {
      visible: true,
      isShow: true,
      animation
    };
  }

  handlePress(onPress) {
    return () => {
      const result = onPress && onPress();
      console.log(result, result !== true);
      this.handleClose(result);
    };
  }

  handleDismiss() {
    const {onDismiss} = this.props;
    Keyboard.dismiss();
    const result = onDismiss && onDismiss();
    this.handleClose(result);
  }

  handleClose(result) {
    if (result !== true) {
      const {hideAnimation, scene} = this.props;
      let animation;
      switch (scene) {
        case 'popup':
          animation = hideAnimation || popupHideAnimation;
          break;
        default:
          break;
      }
      this.setState({
        animation,
        isShow: false
      });
      if (!animation) {
        this.setState({visible: false});
      }

    }
  }

  handleAnimationEnd() {
    if (!this.state.isShow) {
      this.setState({visible: false});
    }
  }

  render() {
    const {
      maskStyle,
      containerStyle,
      contentStyle,
      title, content,
      buttons
    } = this.props;

    const {animation, visible} = this.state;

    return (
      <AbstractDialog onPress={this.handleDismiss}
                      style={[styles.mask, maskStyle]}
                      visible={visible}
      >
        <Animatable.View {...animation}
                         onAnimationEnd={this.handleAnimationEnd}
                         style={[styles.container, containerStyle]}
        >
          {typeof title === 'string' ? (
            <Text style={styles.title}>{title}</Text>
          ) : title}
          <View style={[styles.content, contentStyle]}>
            {typeof content === 'string' ? (
              <Text>{content}</Text>
            ) : content}
          </View>
          {buttons && buttons.length > 0 && (
            <View style={[styles.buttonGroup, buttons.length === 2 && styles.twoButton]}>
              {buttons.map(({onPress, containerStyle, style, ...props}, index) => (
                <Button {...props}
                        containerStyle={[styles.button, containerStyle]}
                        key={index}
                        onPress={this.handlePress(onPress)}
                        style={[styles.buttonStyle, style]}
                />
              ))}
            </View>
          )}
        </Animatable.View>
      </AbstractDialog>
    );
  }
}

/**
 * 情景模态框
 */
function sceneModal(props) {
  return createRootView(SceneModal, props);
}

export default (args) => {
  return sceneModal(args);
};

/**
 * 消息模态框
 */
export function info(args) {
  return sceneModal({
    ...args,
    scene: 'info'
  });
}

/**
 * 成功模态框
 */
export function success(args) {
  return sceneModal({
    ...args,
    scene: 'success'
  });
}

/**
 * 错误模态框
 */
export function error(args) {
  return sceneModal({
    ...args,
    scene: 'error'
  });
}

/**
 * 警告模态框
 */
export function warn(args) {
  return sceneModal({
    ...args,
    scene: 'warn'
  });
}

/**
 */
export function confirm(args) {
  return sceneModal({
    ...args,
    scene: 'confirm'
  });
}

export function popup(args) {
  return sceneModal({
    ...args,
    scene: 'popup'
  });
}
