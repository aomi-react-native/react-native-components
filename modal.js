import React from 'react';
import Component from './AbstractComponent';
import { Text, View } from 'react-native';
import { createRootView } from './createRootNode';
import { AbstractDialog } from './Dialog';
import Button from './Button';
import { Colors } from './styles';

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.4)'
  },
  content: {
    margin: 15,
    overflow: 'hidden'
  },
  buttonGroup: {},
  button: {
    borderRadius: 0
  }
};

const variables = {
  config: {
    okText: '确定',
    cancelText: '取消',
    okButtonProps: {
      color: '#0480ff'
    },
    cancelButtonProps: {
      color: Colors.fontColor,
      containerStyle: styles.button
    }
  }
};

class SceneModal extends Component {

  state = {
    visible: true
  };

  handleOkPress() {
    const {onOk} = this.props;
    const result = onOk && onOk();
    this.handleClose(result);
  }

  handleCancelPress() {
    const {onCancel} = this.props;
    const result = onCancel && onCancel();
    this.handleClose(result);
  }

  handleDismiss() {
    const {onDismiss} = this.props;
    const result = onDismiss && onDismiss();
    this.handleClose(result);
  }

  handleClose(result) {
    if (result !== true) {
      this.setState({visible: false});
    }
  }

  render() {
    const {
      title, content, onCancel, onOk, contentStyle,
      okButtonProps,
      cancelButtonProps
    } = this.props;
    const {
      config: {
        okText,
        cancelText,
        okButtonProps: defaultOkButtonProps,
        cancelButtonProps: defaultCancelButtonProps
      }
    } = variables;
    return (
      <AbstractDialog onPress={this.handleDismiss}
                      style={styles.container}
                      visible={this.state.visible}
      >
        <View style={[styles.content, contentStyle]}>
          {typeof title && (
            <Text>{title}</Text>
          )}
          {typeof content === 'string' ? (
            <Text>{content}</Text>
          ) : content}
          <View style={styles.buttonGroup}>
            {onCancel && (
              <Button {...defaultCancelButtonProps}
                      {...cancelButtonProps}
                      onPress={this.handleCancelPress}
              >
                {cancelText}
              </Button>
            )}
            {onOk && (
              <Button {...defaultOkButtonProps}
                      {...okButtonProps}
                      onPress={this.handleOkPress}
              >
                {okText}
              </Button>
            )}
          </View>
        </View>
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
