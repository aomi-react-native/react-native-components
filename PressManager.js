import { findNodeHandle, NativeEventEmitter, NativeModules } from 'react-native';

const {SitbPressManager} = NativeModules;

const handler = {};

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/6/26
 */
class PressManager {

  event = new NativeEventEmitter(SitbPressManager);

  constructor() {
    this.event.addListener('SitbPressManagerPressEvent', this.handlePress);
  }

  handlePress(viewTag) {
    handler[viewTag] && handler[viewTag]();
  }

  onPress(view, onPress) {
    const viewTag = findNodeHandle(view);
    handler[viewTag] = onPress;
    SitbPressManager.onPress(viewTag);
  }


}

export default new PressManager();
