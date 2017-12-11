import * as React from 'react';
import Component from '../AbstractComponent';
import { Keyboard, Platform, Text, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import { Colors } from '../styles';
import Props from './Props';

import styles from './styles';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/5
 */
class Button extends Component<Props> {

  static defaultProps = {
    activeOpacity: 0.4,
    autoDismissKeyboard: false,
    disabled: false,
    disabledStyle: styles.disabledStyle,
    type: 'default'
  };

  handlePress(event) {
    const {onPress, autoDismissKeyboard} = this.props;
    autoDismissKeyboard && Keyboard.dismiss();
    onPress && onPress(event);
  }


  renderContent() {
    const {
      disabled,
      after,
      before,
      children,
      type,
      containerStyle,
      disabledStyle,
      textStyle
    } = this.props;

    let newChild = [];
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

    if (before) {
      newChild.push(React.cloneElement(before, {key: 'before'}));
    }
    if (children) {
      if (typeof children === 'string' || (Array.isArray(children) && typeof children[0] === 'string')) {
        newChild.push(
          <Text key="text"
                style={textStyles}
          >
            {Array.isArray(children) ? children[0] : children}
          </Text>
        );
      } else {
        newChild.push(React.cloneElement((children as any), {
          key: 'children'
        }));
      }
    }
    if (after) {
      newChild.push(React.cloneElement(after, {
        key: 'after'
      }));
    }

    let temp = [];
    if (type === 'link') {
      temp.push(styles.link);
    } else if (type === 'default') {
      temp.push(styles.button);
      temp.push(styles.containerDefault);
    } else {
      temp.push(styles.button);
      temp.push({backgroundColor: Colors[type]});
    }

    temp.push(containerStyle);

    if (disabled) {
      temp.push(disabledStyle);
    }

    return React.cloneElement(<View/>, {
      children: newChild,
      style: temp
    });
  }

  render() {
    const {
      Comp,
      ...props
    } = this.props;

    const ButtonComp = Comp || Platform.select<any>({
      ios: TouchableOpacity,
      android: TouchableNativeFeedback
    });

    return (
      <ButtonComp {...props}
                  onPress={this.handlePress}
      >
        {this.renderContent()}
      </ButtonComp>
    );
  }

}

export default Button;
