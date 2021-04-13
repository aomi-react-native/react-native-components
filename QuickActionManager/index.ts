import { NativeEventEmitter, NativeModules } from 'react-native';

const { SitbQuickActionManager } = NativeModules;

const emitter = new NativeEventEmitter(SitbQuickActionManager);

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/7/28
 */
export default class QuickActionManager {
  static setShortcutItems(shortcutItems) {
    return SitbQuickActionManager.setShortcutItems(shortcutItems);
  }

  static isSupported(callback) {
    SitbQuickActionManager.isSupported(callback);
  }

  static clearShortcutItems() {
    SitbQuickActionManager.clearShortcutItems();
  }

  static addQuickActionShortcutListener(callback) {
    emitter.addListener('quickActionShortcut', callback);
  }

  static removeQuickActionShortcutListener(callback) {
    emitter.removeListener('quickActionShortcut', callback);
  }
}
