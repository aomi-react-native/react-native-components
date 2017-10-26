import { NativeModules } from 'react-native';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/5/27
 */

const {SitbDeviceManager} = NativeModules;

export type Device = {
  bundleId: String,
  country: String,
  identifier: String,
  locale: String,
  localizedModel: String,
  model: String,
  name: String,
  systemName: String,
  systemVersion: String,
  versionCode: String,
  versionName: String
};

class DeviceManager {

  /**
   * 获取设备信息
   */
  static getDeviceInfo(): Device {
    return SitbDeviceManager.getDeviceInfo();
  }

}

export default DeviceManager;
