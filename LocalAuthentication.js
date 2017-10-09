import React from 'react';
import { NativeModules, Platform, View } from 'react-native';
import modal from './modal';
import SvgIcon from './SvgIcon';
import fingerprint from './assets/svg/fingerprint.svg';


const {SitbLocalAuthentication} = NativeModules;

const styles = {
  content: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    margin: 15,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center'
  }
};

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
    modal({
      content: (
        <View style={styles.content}>
          <SvgIcon source={fingerprint}
                   width={50}
                   height={50}
          />
        </View>
      )
    });
    return SitbLocalAuthentication.fingerprintValidate(msg);
  }

}
