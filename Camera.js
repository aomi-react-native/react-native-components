import React, { PropTypes } from 'react';
import Component from './AbstractComponent';
import {
  requireNativeComponent,
  View,
  NativeModules
} from 'react-native';


const CameraManager = NativeModules.SitbCameraModule;

export const CameraType = {
  FRONT: '1',
  BEHIND: '0'
};

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/6/22
 */
class Camera extends Component {

  static propTypes = {
    ...View.propTypes,
    type: PropTypes.oneOf(['0', '1'])
  };

  static defaultProps = {
    type: CameraType.BEHIND
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


export default Camera;
