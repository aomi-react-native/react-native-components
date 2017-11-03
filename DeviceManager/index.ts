import { NativeModules } from 'react-native';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/5/27
 */

const {SitbDeviceManager} = NativeModules;

export interface Device {
  bundleId: string,
  country: string,
  identifier: string,
  locale: string,
  localizedModel: string,
  model: string,
  name: string,
  systemName: string,
  systemVersion: string,
  versionCode: string,
  versionName: string
}

class DeviceManager {

  /**
   * 获取设备信息
   */
  static getDeviceInfo(): Device {
    return SitbDeviceManager.getDeviceInfo();
  }

}

export default DeviceManager;
