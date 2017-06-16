import { NativeModules } from 'react-native';
/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/5/27
 */

const {SitbDeviceManager} = NativeModules;

class DeviceManager {

  /**
   * 获取设备信息
   */
  static getDeviceInfo() {
    return SitbDeviceManager.getDeviceInfo();
  }

}

export default DeviceManager;
