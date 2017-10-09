import React from 'react';
import Component from './AbstractComponent';
import { Text, View } from 'react-native';
import { createRootView } from './createRootNode';
import { AbstractDialog } from './Dialog';
import Button from './Button';

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.4)'
  },
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
    const {title, content, onCancel, onOk} = this.props;
    const {
      config: {
        okText,
        cancelText,
        okButtonProps,
        cancelButtonProps
      }
    } = variables;
    return (
      <AbstractDialog onPress={this.handleDismiss}
                      style={styles.container}
                      visible={this.state.visible}
      >
        {typeof title && (
          <Text>{title}</Text>
        )}
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
}

/**
 * 情景模态框
 * @param scene
 * @param title
 * @param content
 * @param onOk
 * @param onCancel
 * @param onDismiss
 */
function sceneModal({scene, title = '', content, onOk, onCancel, onDismiss} = {}) {
  createRootView(
    <SceneModal content={content}
                onCancel={onCancel}
                onDismiss={onDismiss}
                onOk={onOk}
                scene={scene}
                title={title}
    />
  );
}

export default (args) => {
  sceneModal(args);
};

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
