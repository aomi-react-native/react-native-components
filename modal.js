import React from 'react';
import Component from './AbstractComponent';
import { Text, View } from 'react-native';
import createRootView from './createRootView';
import { AbstractDialog } from './Dialog';
import Button from './Button';

const styles = {
  buttonGroup: {}
};

const variables = {
  config: {
    okText: '确定',
    cancelText: '取消',
    okButtonProps: {},
    cancelButtonProps: {}
  }
};

/**
 * 情景模态框
 * @param scene
 * @param title
 * @param content
 * @param onOk
 * @param onCancel
 */
function sceneModal({scene, title = '', content, onOk, onCancel, onDismiss}) {
  const {
    config: {
      okText,
      cancelText,
      okButtonProps,
      cancelButtonProps
    }
  } = variables;

  createRootView(class SceneModal extends Component {

    state = {
      visible: true
    };

    handleOkPress() {
      const result = onOk && onOk();
      this.handleClose(result);
    }

    handleCancelPress() {
      const result = onCancel && onCancel();
      this.handleClose(result);
    }

    handleDismiss() {
      const result = onDismiss && onDismiss();
      this.handleClose(result);
    }

    handleClose(result) {
      if (result !== true) {
        this.setState({visible: false});
      }
    }

    render() {
      return (
        <AbstractDialog onPress={this.handleDismiss}
                        visible={this.state.visible}
        >
          <Text>{title}</Text>
          {typeof content === 'string' ? (
            <Text>{content}</Text>
          ) : content}
          <View style={styles.buttonGroup}>
            {onCancel && (
              <Button {...cancelButtonProps}
                      onPress={this.handleCancelPress}
              >
                {cancelText}
              </Button>
            )}
            {onOk && (
              <Button {...okButtonProps}
                      onPress={this.handleOkPress}
              >
                {okText}
              </Button>
            )}
          </View>
        </AbstractDialog>
      );
    }
  });
}

/**
 * 消息模态框
 */
export function info(args) {
  sceneModal({
    ...args,
    scene: 'info'
  });
}

/**
 * 成功模态框
 */
export function success(args) {
  sceneModal({
    ...args,
    scene: 'success'
  });
}

/**
 * 错误模态框
 */
export function error(args) {
  sceneModal({
    ...args,
    scene: 'error'
  });
}

/**
 * 警告模态框
 */
export function warn(args) {
  sceneModal({
    ...args,
    scene: 'warn'
  });
}

/**
 */
export function confirm(args) {
  sceneModal({
    ...args,
    scene: 'confirm'
  });
}
