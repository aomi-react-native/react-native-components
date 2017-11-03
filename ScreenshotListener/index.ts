import { NativeModules } from 'react-native';


const {SitbScreenshotListenerModule} = NativeModules;

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/7/14
 */
export default class ScreenshotListener {

  static startListener() {
    return SitbScreenshotListenerModule.startListener();
  }

  static stopListener() {
    return SitbScreenshotListenerModule.stopListener();
  }

}
