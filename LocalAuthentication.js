import React from 'react';
import { NativeModules, Platform, Text, View } from 'react-native';
import modal from './modal';
import SvgIcon from './SvgIcon';
import fingerprint from './assets/svg/fingerprint.svg';


const {SitbLocalAuthentication} = NativeModules;

const styles = {
  container: {
    backgroundColor: '#FFF'
  },
  content: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  msg: {
    color: '#1a1a1a'
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

  static createDialog({title, msg}) {
    return (
      <View style={styles.content}>
        <SvgIcon fill="#ff2d2d"
                 height={50}
                 source={fingerprint}
                 width={50}

        />
        {title && <Text>{'再试一次'}</Text>}
        {msg && <Text style={styles.msg}>{msg}</Text>}
      </View>
    );
  }

  static handle(resolve, reject, manager) {
    SitbLocalAuthentication.fingerprintValidate()
      .then(result => {
        console.log(result);
      })
      .catch(e => {
        console.info('指纹识别失败', e);
        switch (e.code) {
          case '5':
            manager.props.content = LocalAuthentication.createDialog({
              title: '再试一次',
              msg: e.message
            });
            manager.update(manager.props);
            LocalAuthentication.handle(resolve, reject, manager);
            break;
          default:
            console.log('未知识别错误');
            break;
        }
      });
  }

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

    const args = {
      content: LocalAuthentication.createDialog({msg}),
      contentStyle: styles.container,
      onCancel: () => console.log('close'),
      onDismiss: () => true
    };
    const manager = modal(args);
    return new Promise((resolve, reject) => LocalAuthentication.handle(resolve, reject, manager));
  }

}
