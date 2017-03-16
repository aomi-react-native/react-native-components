import React, { PropTypes } from 'react';
import Component from './AbstractComponent';
import { requireNativeComponent, View, UIManager, NativeModules, Platform } from 'react-native';

type OrientationType = {
  auto: Number,
  landscapeLeft: Number,
  landscapeRight: Number,
  portrait:Number,
  portraitUpsideDown:Number
};

type QualityType = {
  high: String,
  medium: String,
  low: String,
  vga: String,
  hd720: String,
  hd1080: String,
  photo: String
};

let CameraManager = NativeModules.SitbRCTCameraView || NativeModules.SitbRCTCameraModule || NativeModules.SitbRCTCamera2Module;
let RCTCamera;
if (UIManager.SitbRCTCameraView) {
  RCTCamera = requireNativeComponent('SitbRCTCameraView', Camera);
} else if (UIManager.SitbRCTCamera2View) {
  RCTCamera = requireNativeComponent('SitbRCTCamera2View', Camera);
}
let constants = (UIManager.SitbRCTCameraView || UIManager.SitbRCTCamera2View).Constants;

let CameraFacing = constants.CameraFacing;
let Orientation: OrientationType = constants.Orientation;
let Quality: QualityType = constants.Quality;

/**
 * 安卓相机版本
 * 4 使用
 * 5 安卓5.0相机
 * 设置安卓相机版本
 * @param cameraVersion 版本
 */
export function setCameraVersion(cameraVersion) {
  if (cameraVersion === 4) {
    CameraManager = NativeModules.SitbRCTCameraView;
    constants = UIManager.SitbRCTCameraView.Constants;
    RCTCamera = requireNativeComponent('SitbRCTCameraView', Camera);
  } else if (cameraVersion === 5) {
    CameraManager = NativeModules.SitbRCTCamera2Module;
    constants = UIManager.SitbRCTCamera2View.Constants;
    RCTCamera = requireNativeComponent('SitbRCTCamera2View', Camera);
  }
  CameraFacing = constants.CameraFacin;
  OrientationType = constants.Orientation;
  Quality = constants.Quality;
}

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/6/22
 */
class Camera extends Component {

  static propTypes = {
    ...View.propTypes,
    /**
     * 前置相机还是后置相机
     * CameraFacing.back
     * CameraFacing.front
     */
    cameraFacing: PropTypes.number,

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

  capture(option) {
    return capture(option);
  }

  handleCaptureOutputBuffer(event) {
    console.log(event.nativeEvent.buffer);
    this.props.onCaptureOutputBuffer && this.props.onCaptureOutputBuffer(event.nativeEvent.buffer);
  }

  render() {
    const {onCaptureOutputBuffer, ...other} = this.props;
    return (
      <RCTCamera {...other}
        onCaptureOutputBuffer={onCaptureOutputBuffer ? this.handleCaptureOutputBuffer : null}
        needCaptureOutputBuffer={!!onCaptureOutputBuffer}
      />
    );
  }

}

export {
  Camera as default,
  Orientation,
  CameraFacing,
  Quality
};
