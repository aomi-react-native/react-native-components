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

let CameraFacing,
  Orientation: OrientationType,
  Quality: QualityType,
  RCTCamera,
  CameraManager;
let cameraVersion = 4;

/**
 * 安卓相机版本
 * 4 使用
 * 5 安卓5.0相机
 * 设置安卓相机版本
 * @param version 版本
 */
export function setCameraVersion(version) {
  cameraVersion = version;
  let constants;
  if (Platform.OS === 'android') {
    if (cameraVersion === 4) {
      CameraManager = NativeModules.SitbRCTCameraView;
      constants = UIManager.SitbRCTCameraView.Constants;
      RCTCamera = requireNativeComponent('SitbRCTCameraView', Camera);
    } else if (cameraVersion === 5) {
      constants = UIManager.SitbRCTCamera2View.Constants;
      RCTCamera = requireNativeComponent('SitbRCTCamera2View', Camera);
    }

  } else {
    CameraManager = NativeModules.SitbRCTCameraView;
    constants = UIManager.SitbRCTCameraView.Constants;
    RCTCamera = requireNativeComponent('SitbRCTCameraView', Camera);
  }
  CameraFacing = constants.CameraFacing;
  Orientation = constants.Orientation;
  Quality = constants.Quality;
}

setCameraVersion(4);

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
    orientation: PropTypes.number,
    /**
     * 质量设置
     */
    quality: PropTypes.string,
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
    this.props.onCaptureOutputBuffer && this.props.onCaptureOutputBuffer(event.nativeEvent.buffer);
  }

  render() {
    const {onCaptureOutputBuffer, ...other} = this.props;
    return (
      <RCTCamera {...other}
        onCaptureOutputBuffer={onCaptureOutputBuffer ? this.handleCaptureOutputBuffer : null}
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
