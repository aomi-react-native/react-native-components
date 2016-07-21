import React, { PropTypes } from 'react';
import Component from './AbstractComponent';
import {
  requireNativeComponent,
  View,
  NativeModules,
  UIManager,
  Platform
} from 'react-native';


// const {
//   SitbCameraModule: {
//     CameraType,
//     Orientation,
//     capture
//   }
// } = NativeModules;


let Constants, CameraFacing, Orientation, RCTCamera;


/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/6/22
 */
class Camera extends Component {

  static propTypes = {
    ...View.propTypes,
    /**
     * 相机方向
     */
    cameraFacing: PropTypes.number,
    /**
     * 安卓相机版本
     * 4 使用
     * 5 安卓5.0相机
     */
    cameraVersion: PropTypes.oneOf([4, 5]),
    orientation: PropTypes.number
  };

  static defaultProps = {
    // cameraFacing: CameraFacing.back,
    // orientation: Orientation.auto,
    cameraVersion: 4
  };

  constructor(props) {
    super(props);
    if (Platform.OS === 'android') {
      if (props.cameraVersion === 4) {
        Constants = UIManager.SitbRCTCameraView.Constants;
        RCTCamera = requireNativeComponent('SitbRCTCameraView', Camera);
      } else if (props.cameraVersion === 5) {
        Constants = UIManager.SitbRCTCamera2View.Constants;
        RCTCamera = requireNativeComponent('SitbRCTCamera2View', Camera);
      }
      CameraFacing = Constants.CameraFacing;
      Orientation = Constants.Orientation;
    } else {
      RCTCamera = requireNativeComponent('SitbRCTCameraView', Camera);
    }
  }

  capture(option) {
    return capture(option);
  }

  render() {
    const {cameraFacing, orientation, ...other} = this.props;
    return (
      <RCTCamera {...other}
        cameraFacing={cameraFacing || CameraFacing.back}
        orientation={orientation || Orientation.auto}
      />
    );
  }

}


export {
  Camera as default
};
