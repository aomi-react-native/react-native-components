import { NativeModules, NativeEventEmitter } from 'react-native';
import { EmitterSubscription } from 'react-native';

const { SitbScreenshotManager } = NativeModules;

const emitter = new NativeEventEmitter(SitbScreenshotManager);

export const EVENT_NAME = 'UserDidTakeScreenshot';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2018/6/10
 */
export default class ScreenshotManager {
  static addListener(onTakeScreenshot): EmitterSubscription {
    return emitter.addListener(EVENT_NAME, onTakeScreenshot);
  }

  static removeListener(onTakeScreenshot): void {
    return emitter.removeListener(EVENT_NAME, onTakeScreenshot);
  }
}
