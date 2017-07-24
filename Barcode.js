import React from 'react';
import PropTypes from 'prop-types';
import Component from './AbstractComponent';
import { DeviceEventEmitter, NativeModules, Platform, requireNativeComponent, StyleSheet, UIManager, View, ViewPropTypes } from 'react-native';
import Camera from './Camera';
import common from './styles';

const {SitbBarcodeView} = NativeModules;

const ANDROID_EVENT_NAME = 'onSuccess';

export const Type = Platform.OS === 'ios' ? UIManager.SitbCameraView.Constants.BarCodeType : {
  qr: 'QR'
};

const borderStyle = {
  position: 'absolute',
  width: 40,
  height: 40,
  borderColor: '#46b8da'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  captureWindow: {
    ...common.fullScreenAbsolute
  },
  cell: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  cellBg: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  window: {
    backgroundColor: 'transparent',
    position: 'relative'
  },
  windowStyle: {
    ...common.fullScreenAbsolute,
    borderWidth: 5,
    borderColor: 'rgba(0, 0, 0, 0.5)'
  },
  top: {
    ...borderStyle,
    top: 1,
    left: 1,
    borderTopWidth: 5,
    borderLeftWidth: 5
  },
  right: {
    ...borderStyle,
    top: 1,
    right: 1,
    borderTopWidth: 5,
    borderRightWidth: 5
  },
  bottom: {
    ...borderStyle,
    bottom: 1,
    right: 1,
    borderBottomWidth: 5,
    borderRightWidth: 5
  },
  left: {
    ...borderStyle,
    bottom: 1,
    left: 1,
    borderBottomWidth: 5,
    borderLeftWidth: 5
  }
});

/**
 * 条形码组件
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/7/19
 */
class Barcode extends Component {

  static propTypes = {
    ...Camera.propTypes,
    renderBottom: PropTypes.func,
    renderTop: PropTypes.func,
    scanLineStyle: ViewPropTypes.style,
    type: PropTypes.oneOf([Type.qr]),
    windowSize: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number
    }),
    onSuccess: PropTypes.func
  };

  static defaultProps = {
    type: Type.qr,
    windowSize: {
      width: 270,
      height: 270
    }
  };

  /**
   * 扫描图片
   * options.path = 图片路径
   * @param options
   */
  static scanImage(options) {
    return SitbBarcodeView.scanImage(options);
  }

  state = {};

  constructor(props) {
    super(props);
    this.state = {
      windowSize: {
        width: 270,
        height: props.type === Type.qr ? 270 : 70
      }
    };
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      DeviceEventEmitter.addListener(ANDROID_EVENT_NAME, this.handleSuccess);
    }
  }

  componentWillUnmount() {
    this.stopCapture();
  }

  stopCapture() {
    if (Platform.OS === 'android') {
      SitbBarcodeView.stopCapture();
    }
  }


  handleSuccess(data) {
    if (Platform.OS === 'android') {
      DeviceEventEmitter.removeAllListeners(ANDROID_EVENT_NAME);
    }
    const {onSuccess} = this.props;
    onSuccess && onSuccess(data);
  }

  renderTop(renderTop) {
    if (renderTop) {
      return (
        <View style={styles.cellBg}>{renderTop()}</View>
      );
    }
    return (
      <View style={[{
        height: 0,
        paddingTop: 30
      }, styles.cellBg]}
      />
    );
  }

  render() {
    const {renderTop, renderBottom} = this.props;
    let props = {};
    if (Platform.OS === 'ios') {
      props = {
        onBarCodeRead: this.handleSuccess
      };
    }
    return (
      <View style={styles.container}>
        <RCTBarcode {...props}
                    style={{flex: 1}}
        />
        <View style={styles.captureWindow}>
          {this.renderTop(renderTop)}
          <View style={{flexDirection: 'row'}}>
            <View style={styles.cell}/>
            <View style={[styles.window, this.state.windowSize]}>
              <View style={styles.windowStyle}>
                <View style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: 'white'
                }}
                />
              </View>
              <View style={[styles.top]}/>
              <View style={[styles.right]}/>
              <View style={[styles.bottom]}/>
              <View style={[styles.left]}/>
            </View>
            <View style={styles.cell}/>
          </View>
          <View style={styles.cell}>
            {renderBottom && renderBottom()}
          </View>
        </View>
      </View>
    );
  }

}

const RCTBarcode = requireNativeComponent(Platform.OS === 'ios' ? 'SitbCameraView' : 'SitbBarcodeView', Barcode);

export default Barcode;
