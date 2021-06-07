import {
  GestureResponderEvent,
  Keyboard,
  Platform,
  StyleProp,
  Text,
  TextStyle,
  TouchableNativeFeedback,
  TouchableNativeFeedbackProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle
} from 'react-native';
import * as React from 'react';
import { ReactElement, Ref } from 'react';
import { useThemeProps } from '../styles/useThemeProps';
import styles from './styles';

export type ButtonProps<CProps> = CProps & {
  Component?: React.ElementType<CProps>;
  /**
   * 自动关闭键盘
   */
  autoDismissKeyboard?: boolean;

  after?: ReactElement<any>;
  before?: ReactElement<any>;
  containerStyle?: StyleProp<ViewStyle>;
  disabledStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  type?:
    | 'primary'
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'link'
    | 'default';
} & TouchableOpacityProps &
  TouchableNativeFeedbackProps;

/**
 * 按钮
 */
export const Button = React.forwardRef<
  any,
  React.PropsWithChildren<ButtonProps<any>>
>(function Button(inProps, ref) {
  const {
    theme,

    activeOpacity = 0.4,

    Component,
    header,
    footer,
    onPress,
    autoDismissKeyboard,

    disabled,
    after,
    before,
    children,
    type,
    containerStyle,
    disabledStyle,
    textStyle,
    ...props
  } = useThemeProps({
    props: inProps,
    name: 'AMButton'
  });

  const ButtonComp =
    Component ||
    Platform.select<any>({
      ios: TouchableOpacity,
      android: TouchableNativeFeedback
    });

  function handlePress(event) {
    autoDismissKeyboard && Keyboard.dismiss();
    onPress && onPress(event);
  }

  function renderContent() {
    let newChild = children;
    const textStyles = [];
    if (type === 'default' || type === 'link') {
      textStyles.push(styles.textDefault);
    } else {
      textStyles.push(styles.textOther);
    }
    if (disabled) {
      textStyles.push(styles.textDisabled);
    }

    textStyles.push(textStyle);

    if (
      children &&
      (typeof children === 'string' ||
        (Array.isArray(children) && typeof children[0] === 'string'))
    ) {
      newChild = (
        <Text key="text" style={textStyles}>
          {Array.isArray(children) ? children[0] : children}
        </Text>
      );
    }

    let temp = [];
    if (type === 'link') {
      temp.push(styles.link);
    } else if (type === 'default') {
      temp.push(styles.button);
      temp.push(styles.containerDefault);
    } else {
      temp.push(styles.button);
      temp.push({ backgroundColor: theme.colors[type] });
    }

    temp.push(containerStyle);

    if (disabled) {
      temp.push(disabledStyle);
    }

    return (
      <View style={temp}>
        {before}
        {newChild}
        {after}
      </View>
    );
  }

  return (
    <ButtonComp
      activeOpacity={activeOpacity}
      {...props}
      onPress={handlePress}
      ref={ref}>
      {ButtonComp === TouchableNativeFeedback ? (
        <View style={props.style}>{renderContent()}</View>
      ) : (
        renderContent()
      )}
    </ButtonComp>
  );
}) as <CProps>(
  p: ButtonProps<CProps> & { ref?: Ref<any> }
) => React.ReactElement;
