import { DeviceEventEmitter, EmitterSubscription, NativeModules } from 'react-native';

const {SitbScreenshotManager} = NativeModules;

export const EVENT_NAME = 'UserDidTakeScreenshot';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2018/6/10
 */
export default class ScreenshotManager {

  static addListener(onTakeScreenshot) {
    SitbScreenshotManager.startListener();
    const emitter = DeviceEventEmitter.addListener(EVENT_NAME, onTakeScreenshot);
    return {
      remove() {
        SitbScreenshotManager.stopListener();
        emitter.remove();
      }
    };
  }

  static removeListener(onTakeScreenshot): void {
    SitbScreenshotManager.stopListener();
    DeviceEventEmitter.removeListener(EVENT_NAME, onTakeScreenshot);
  }

}
