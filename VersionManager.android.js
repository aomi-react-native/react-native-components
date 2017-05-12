import { NativeModules } from 'react-native';


const {
  SitbVersionManager
} = NativeModules;

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/5/12
 */
class VersionManager {

  /**
   * 获取版本PackageInfo
   * @returns {*}
   */
  static getPackageInfo() {
    return SitbVersionManager.getPackageInfo();
  }

  /**
   * 安装 APK
   * @param args 下载参数
   * @returns {*}
   */
  static installApk(args) {
    return SitbVersionManager.installApk(args);
  }

}

export default VersionManager;
