import * as React from 'react';
import * as PropTypes from 'prop-types';
import Component from '../AbstractComponent';
import { NativeEventEmitter, NativeModules, Platform, requireNativeComponent, UIManager } from 'react-native';
import ViewPropTypes from 'react-native/Libraries/Components/View/ViewPropTypes';
import Props, { OrientationType, QualityType } from './Props';

let CameraManager = NativeModules.SitbCameraView || NativeModules.SitbCamera2Module;

const {SitbCameraView, SitbCamera2View, SitbCamera2Module} = UIManager as any;

let constants = (SitbCameraView || SitbCamera2View).Constants;

let CameraFacing = constants.CameraFacing;
let Orientation: OrientationType = constants.Orientation;
let Quality: QualityType = constants.Quality;

let event = new NativeEventEmitter(CameraManager);

/**
 * 安卓相机版本
 * 4 使用
 * 5 安卓5.0相机
 * 设置安卓相机版本
 * @param cameraVersion 版本
 */
export function setCameraVersion(cameraVersion) {
  if (cameraVersion === 4) {
    CameraManager = NativeModules.SitbCameraView;
    constants = SitbCameraView.Constants;
    RCTCamera = requireNativeComponent('SitbCameraView', Camera);
  } else if (cameraVersion === 5) {
    CameraManager = NativeModules.SitbCamera2View;
    constants = SitbCamera2View.Constants;
    RCTCamera = requireNativeComponent('SitbCamera2View', Camera);
  }
  CameraFacing = constants.CameraFacin;
  Orientation = constants.Orientation;
  Quality = constants.Quality;
  event = new NativeEventEmitter(CameraManager);
}

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/6/22
 */
class Camera extends Component<Props> {

  static propTypes = {
    ...ViewPropTypes,
    /**
     * 前置相机还是后置相机
     * CameraFacing.back
     * CameraFacing.front
     */
    cameraFacing: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    /**
     * Android 需要，该值不需要传递，如果传递了onCaptureOutputBuffer则该值为true
     */
    needCaptureOutputBuffer: PropTypes.bool,

    /**
     * 相机方向
     * Orientation.auto
     * Orientation.landscapeLeft
     * Orientation.landscapeRight
     * Orientation.portrait
     * Orientation.portraitUpsideDown
     */
    orientation: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * 质量设置
     */
    quality: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * 一个回调函数
     * 当需要实时获取预览的图片数据
     */
    onCaptureOutputBuffer: PropTypes.func
  };

  static defaultProps = {
    cameraFacing: CameraFacing.back,
    orientation: Orientation.auto,
    quality: Quality.high
  };

  /**
   * 检查是否有相机权限
   * ios only
   */
  static checkVideoAuthorizationStatus = Platform.select<any>({
    ios: CameraManager.checkVideoAuthorizationStatus
  });
  /**
   * 检查是否有麦克风权限
   * ios only
   */
  static checkAudioAuthorizationStatus = Platform.select<any>({
    ios: CameraManager.checkAudioAuthorizationStatus
  });


  componentDidMount() {
    if (Platform.OS === 'android') {
      event.addListener('captureOutputBuffer', this.handleCaptureOutputBuffer);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      event.removeListener('captureOutputBuffer', this.handleCaptureOutputBuffer);
    }
  }

  capture(option) {
    // return capture(option);
  }


  handleCaptureOutputBuffer(event) {
    this.props.onCaptureOutputBuffer && this.props.onCaptureOutputBuffer(event.nativeEvent.buffer);
  }

  render() {
    const {onCaptureOutputBuffer, ...other} = this.props;
    return (
      <RCTCamera {...other}
                 needCaptureOutputBuffer={!!onCaptureOutputBuffer}
                 onCaptureOutputBuffer={onCaptureOutputBuffer ? this.handleCaptureOutputBuffer : null}
      />
    );
  }

}


let RCTCamera;
if (SitbCameraView) {
  RCTCamera = requireNativeComponent('SitbCameraView', Camera);
} else if (SitbCamera2Module) {
  RCTCamera = requireNativeComponent('SitbCamera2View', Camera);
}

export {
  Camera as default,
  Orientation,
  CameraFacing,
  Quality
};
