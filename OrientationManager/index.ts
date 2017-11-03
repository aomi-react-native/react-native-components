import { NativeModules, NativeEventEmitter } from 'react-native';

const {SitbRCTOrientationManager} = NativeModules;

export interface OriType {
  unknown: number,
  portrait: number,
  portraitUpsideDown: number,
  landscapeLeft: number,
  landscapeRight: number,
  faceUp: number,
  faceDown: number
}

export const Orientation: OriType = SitbRCTOrientationManager.Orientation;

const emitter = new NativeEventEmitter(SitbRCTOrientationManager);

/**
 * 设备方向管理器
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/8/5
 */
export default class OrientationManager {

  /**
   * 获取当前屏幕方向
   * @return {*}
   */
  static getOrientation() {
    return SitbRCTOrientationManager.getOrientation();
  }

  /**
   * 设置屏幕方向
   * @param orientation 屏幕方向
   * @param lock 是否锁定旋转
   */
  static setOrientation(orientation, lock) {
    SitbRCTOrientationManager.setOrientation(orientation, lock);
  }

  /**
   * 设置屏幕方向为默认值
   */
  static setOrientationToDefault() {
    SitbRCTOrientationManager.setOrientationToDefault();
  }

  /**
   * 监听屏幕旋转方向
   * @param callback
   */
  static addDeviceOrientationDidChangeListener(callback) {
    emitter.addListener('deviceOrientationDidChange', callback);
  }

  /**
   * 移除屏幕旋转监听
   * @param callback
   */
  static removeDeviceOrientationDidChangeListener(callback) {
    emitter.removeListener('deviceOrientationDidChange', callback);
  }

}
