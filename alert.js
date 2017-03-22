import { Alert } from 'react-native';

const DEFAULT_BUTTON = {
  text: '确定'
};

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/3/22
 */
export default function ({title, message, button = DEFAULT_BUTTON, onOk, options}) {
  if (!button.onPress && onOk) {
    button.onPress = onOk;
  }
  Alert.alert(title, message, [button], options);
}
