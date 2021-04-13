import * as React from 'react';
import {
  DeviceEventEmitter,
  NativeModules,
  Platform,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import modal from '../modal';

import toast from '../toast';

const EVENT_NAME = 'receiveAuthentication';

const { SitbLocalAuthentication } = NativeModules;

const styles = StyleSheet.create<any>({
  container: {
    backgroundColor: '#FFF',
  },
  content: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  msg: {
    color: '#1a1a1a',
  },
});

export const Code = {
  systemCancel: 'SystemCancel',
  userCancel: 'UserCancel',
  userFallback: 'UserFallback',
  exception: 'EXCEPTION',
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
   * @param tipMsg 提示消息
   * @param failedMsg 验证失败消息
   */
  static fingerprintValidate({ tipMsg, failedMsg = '指纹验证失败' }) {
    if (Platform.OS !== 'android') {
      return SitbLocalAuthentication.fingerprintValidate(tipMsg);
    }

    return new Promise((resolve, reject) => {
      let manager;

      function handleReceiveAuthentication(msg) {
        console.log('Receive Authentication', msg);
        const { event, code, message } = msg;
        switch (event) {
          case 'SUCCESS':
            handleCancel();
            resolve(true);
            break;
          case 'HELP':
          case 'FAILED':
            manager.props.content = LocalAuthentication.createDialog({
              title: '再试一次',
              tipMsg: event === 'FAILED' ? failedMsg : message,
            });
            manager.update(manager.props);
            break;
          case 'ERROR':
            handleCancel();
            if (code === 7) {
              toast(message);
              reject(msg);
            }
            break;
          default:
            console.warn(`未知事件: ${event}`);
            handleCancel();
            reject(msg);
            break;
        }
      }

      function handleCancel() {
        SitbLocalAuthentication.cancelFingerprintValidate();
        DeviceEventEmitter.removeListener(
          EVENT_NAME,
          handleReceiveAuthentication
        );
        manager && manager.destroy();
      }

      DeviceEventEmitter.addListener(EVENT_NAME, handleReceiveAuthentication);

      const args = {
        content: LocalAuthentication.createDialog({ tipMsg }),
        contentStyle: styles.container,
        onCancel: handleCancel,
        onDismiss: () => true,
      };
      manager = modal(args);

      SitbLocalAuthentication.fingerprintValidate();
    });
  }

  static createDialog({ title, tipMsg }: any) {
    return (
      <View style={styles.content}>
        {title && <Text>{title}</Text>}
        {tipMsg && <Text style={styles.msg}>{tipMsg}</Text>}
      </View>
    );
  }
}
