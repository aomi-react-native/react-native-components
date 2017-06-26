import { findNodeHandle, NativeModules } from 'react-native';

const {SitbPressManager} = NativeModules;

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/6/26
 */
export default class PressManager {

  static onPress(viewTag, onPress) {
    const view = findNodeHandle(viewTag);
    SitbPressManager.onPress(view, onPress);
  }

}
