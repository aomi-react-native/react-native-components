import React, { PropTypes } from 'react';
import Component from './AbstractComponent';
import {
  requireNativeComponent,
  View,
  NativeModules
} from 'react-native';


const CameraManager = NativeModules.SitbCameraModule;

const {
  CameraType,
  Orientation
} = CameraManager;


/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/6/22
 */
class Camera extends Component {

  static propTypes = {
    ...View.propTypes,
    orientation: PropTypes.number,
    type: PropTypes.number
  };

  static defaultProps = {
    orientation: 0,
    type: CameraType.back
  };

  capture(option) {
    return CameraManager.takePicture(option);
  }

  render() {
    return (
      <RCTCamera {...this.props} />
    );
  }

}

const RCTCamera = requireNativeComponent('SitbCameraViewManager', Camera);


export {
  Camera as default,
  CameraType,
  Orientation
};
