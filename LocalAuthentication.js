import { NativeModules, Platform } from 'react-native';

const {SitbLocalAuthentication} = NativeModules;

export const Code = {
  systemCancel: 'SystemCancel',
  userCancel: 'UserCancel',
  userFallback: 'UserFallback',
  exception: 'EXCEPTION'
};

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/9/29
 */
export default class LocalAuthentication {

  /**
   * 是否支持生物识别
   */
  static supportBiometrics() {
    return SitbLocalAuthentication.supportBiometrics();
  }

  /**
   * 验证指纹
   * @param msg 提示消息
   */
  static fingerprintValidate(msg) {
    if (Platform.OS !== 'android') {
      return SitbLocalAuthentication.fingerprintValidate(msg);
    }

    return SitbLocalAuthentication.fingerprintValidate(msg);
  }

}
