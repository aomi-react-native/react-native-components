import React, { PropTypes } from 'react';
import Component from './AbstractComponent';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';
import createRootView from './createRootView';
import { getWindowSize } from './styles';

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.4)'
  },
  content: {
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  text: {
    marginTop: 5,
    color: '#FFF'
  }
});

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/24
 */
class Dialog extends Component {

  static propTypes = {
    ...Modal.propTypes,
    isLoadingDialog: PropTypes.bool,
    loadingProps: PropTypes.object,
    style: View.propTypes.style
  };

  static defaultProps = {
    animationType: 'fade',
    onRequestClose() {
      console.log('Dialog close');
    },
    isLoadingDialog: false,
    transparent: true,
    visible: false
  };

  renderLoading({children, loadingProps}) {
    let child;
    if (typeof children === 'string') {
      child = <Text style={styles.text}>{children}</Text>;
    } else if (Array.isArray(children) && typeof children[0] === 'string') {
      child = <Text style={styles.text}>{children}</Text>;
    } else {
      child = children;
    }
    return (
      <View style={styles.content}>
        <ActivityIndicator {...loadingProps}/>
        {child}
      </View>
    );
  }

  render() {
    const {
      style, children,
      isLoadingDialog,
      loadingProps,
      ...other
    } = this.props;

    const innerStyle = [
      getWindowSize(),
      isLoadingDialog ? styles.loadingContainer : {},
      style
    ];

    return (
      <Modal {...other}>
        <View style={innerStyle}>
          {isLoadingDialog ? this.renderLoading({
            children,
            loadingProps
          }) : children}
        </View>
      </Modal>
    );
  }
}


// noinspection Eslint
export default createRootView(Dialog);
