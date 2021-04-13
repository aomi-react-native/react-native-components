import { NativeModules } from 'react-native';

const { SitbSmsManager } = NativeModules;

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/7/26
 */
export default class SmsManager {
  /**
   * 发送短信
   * @param recipients 收件人
   * @param body 短信内容
   * @returns {*}
   */
  static sendSms(recipients: Array<String>, body: String) {
    return SitbSmsManager.sendSms(recipients, body);
  }
}
