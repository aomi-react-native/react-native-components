import { NativeModules } from 'react-native';

const {SitbQuickActionManager} = NativeModules;

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/7/28
 */
export default class QuickActionManager {

  static setShortcutItems(shortcutItems: Array) {
    return SitbQuickActionManager.setShortcutItems(shortcutItems);
  }

  static isSupported(callback) {
    SitbQuickActionManager.isSupported(callback);
  }

  static clearShortcutItems() {
    SitbQuickActionManager.clearShortcutItems();
  }

}
