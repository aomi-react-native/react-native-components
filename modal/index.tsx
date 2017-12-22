import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import Component from '../AbstractComponent';
import { Keyboard, Text, View, StyleSheet } from 'react-native';
import { createRootView } from '../createRootNode/index';
import RootManager from '../createRootNode/RootManager';
import { AbstractDialog } from '../Dialog/index';
import Button from '../Button/index';
import { Colors, fontSize } from '../styles';
import Props from './Props';

const styles = StyleSheet.create<any>({
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
});

const popupShowAnimation = {
  animation: 'slideInUp',
  duration: 300
};

const popupHideAnimation = {
  animation: 'slideOutDown',
  duration: 300
};

class SceneModal extends Component<Props> {

  static defaultProps = {
    buttons: []
  };

  static contextTypes = {
    manager: PropTypes.func
  };

  static childContextTypes = {
    destroy: PropTypes.func
  };

  getChildContext() {
    return {
      destroy: this.handleClose
    };
  }

  state;

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
      // 如果不存在关闭动画，直接销毁组件
      if (!animation) {
        this.destroy();
      }

    }
  }

  handleAnimationEnd() {
    if (!this.state.isShow) {
      this.destroy();
    }
  }

  destroy() {
    this.setState({visible: false});
    this.context.manager.destroy();
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

export default (args: Props) => {
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
