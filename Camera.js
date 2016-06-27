import React, { PropTypes } from 'react';
import Component from './AbstractComponent';
import {
  requireNativeComponent,
  View,
  NativeModules
} from 'react-native';


const {
  SitbCameraModule: {
    CameraType,
    Orientation,
    capture
  }
} = NativeModules;


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
    orientation: Orientation.auto,
    type: CameraType.back
  };

  capture(option) {
    return capture(option);
  }

  render() {
    return (
      <RCTCamera {...this.props} />
    );
  }

}

const RCTCamera = requireNativeComponent('RCTSitbCameraView', Camera);


export {
  Camera as default,
  CameraType,
  Orientation
};
