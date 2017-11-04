import { Alert } from 'react-native';

const DEFAULT_BUTTON = {
  text: '确定'
};

export interface AlertArgs {
  title?: string
  message?: string
  button?: Array<any> | object
  onOk?: () => void
  options?: any
}

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/3/22
 */
export default function ({title, message, button, onOk, options}: AlertArgs) {
  let buttons;
  if (Array.isArray(button)) {
    buttons = button;
  } else {
    let tmp: any = button || {...DEFAULT_BUTTON};
    if (!tmp.onPress && onOk) {
      tmp.onPress = onOk;
    }
    buttons = [tmp];
  }
  const newOptions = options || {};
  if (!newOptions.onDismiss) {
    if (onOk) {
      newOptions.onDismiss = onOk;
    } else if (buttons.length === 1) {
      newOptions.onDismiss = buttons[0].onPress;
    }
  }
  Alert.alert(title, message, buttons, newOptions);
}
