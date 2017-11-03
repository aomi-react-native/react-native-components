import * as React from 'react';
import * as PropTypes from 'prop-types';
import Component from '../AbstractComponent';
import {
  DeviceEventEmitter, NativeModules, Platform, requireNativeComponent,
  UIManager, View
} from 'react-native';
import Camera from '../Camera';

import styles from './styles';
import Props from './Props';

const {SitbBarcodeView, SitbCameraView} = NativeModules;

const {SitbCameraView: UISitbCameraView} = (UIManager as any);

const ANDROID_EVENT_NAME = 'onSuccess';

export const Type = Platform.OS === 'ios' ? UISitbCameraView.Constants.BarCodeType : {
  qr: 'QR'
};

/**
 * 条形码组件
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/7/19
 */
class Barcode extends Component<Props> {

  static propTypes = {
    ...Camera.propTypes,
    barCodeTypes: PropTypes.array,
    renderBottom: PropTypes.func,
    renderTop: PropTypes.func,
    scanLineStyle: PropTypes.any,
    windowSize: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number
    }),
    onBarCodeRead: PropTypes.func
  };

  static defaultProps = {
    barCodeTypes: [Type.qr],
    windowSize: {
      width: 270,
      height: 270
    }
  };

  state;

  constructor(props) {
    super(props);
    this.state = {
      windowSize: {
        width: 270,
        height: 270
      }
    };
  }

  /**
   * 扫描图片
   * options.path = 图片路径
   * @param options
   */
  static scanImage(options) {
    if (Platform.OS === 'ios') {
      return SitbCameraView.scanImage(options);
    }
    return SitbBarcodeView.scanImage(options);
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
    let realData = data;
    if (Platform.OS === 'ios') {
      realData = data.nativeEvent;
    }
    const {onSuccess} = this.props;
    onSuccess && onSuccess(realData);
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
    const {renderTop, renderBottom, barCodeTypes} = this.props;
    let props = {};
    if (Platform.OS === 'ios') {
      props = {
        onBarCodeRead: this.handleSuccess,
        barCodeTypes
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

const RCTBarcode = Platform.OS === 'ios' ? Camera : requireNativeComponent('SitbBarcodeView', Barcode);

export default Barcode;
