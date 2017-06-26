import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import Component from './AbstractComponent';
import { Keyboard, Platform, Text, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, View, ViewPropTypes } from 'react-native';
import Icon from './Icon';
import { Colors, separatorHeight } from './styles';

const styles = {
  button: {
    borderRadius: 5,
    borderWidth: separatorHeight,
    borderColor: 'transparent',
    borderStyle: 'solid',
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 12,
    paddingRight: 12,
    overflow: 'hidden'
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerDefault: {
    borderColor: Colors.separator,
    backgroundColor: Colors.white
  },
  textDefault: {
    color: '#333'
  },
  textOther: {
    color: '#FFF'
  },
  textDisabled: {
    color: '#bcbcbc'
  },
  disabledStyle: {
    backgroundColor: '#dddddd'
  }
};

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/5
 */
class Button extends Component {

  static propTypes = {
    ...TouchableWithoutFeedback.propTypes,
    Comp: PropTypes.any,
    /**
     * 内容后图标
     */
    after: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    autoDismissKeyboard: PropTypes.bool,
    /**
     * 内容前图标
     */
    before: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    children: PropTypes.any,
    color: PropTypes.string,
    containerStyle: ViewPropTypes.style,
    disabled: PropTypes.bool,
    disabledStyle: ViewPropTypes.style,
    fontSize: PropTypes.number,
    iconProps: PropTypes.object,
    type: PropTypes.oneOf(['primary', 'success', 'info', 'warning', 'danger', 'link', 'default'])
  };

  static defaultProps = {
    autoDismissKeyboard: false,
    disabled: false,
    disabledStyle: styles.disabledStyle,
    type: 'default',
    fontSize: 17,
    iconProps: {}
  };


  handlePress() {
    const {onPress, autoDismissKeyboard} = this.props;
    autoDismissKeyboard && Keyboard.dismiss();
    onPress && onPress();
  }


  renderContent() {
    const {
      disabled,
      after,
      before,
      iconProps,
      fontSize,
      children,
      type,
      color,
      containerStyle,
      disabledStyle
    } = this.props;

    let newChild = [];
    let iconStyle = {
      marginRight: 5,
      marginLeft: 5
    };
    let textStyle = Object.assign({},
      type === 'default' || type === 'link' ? styles.textDefault : styles.textOther);
    if (disabled) {
      textStyle = Object.assign({}, styles.textDisabled);
    }
    if (color) {
      textStyle.color = color;
    }

    if (before) {
      if (typeof before === 'string') {
        newChild.push(
          <Icon {...iconProps}
                key="before"
                name={before}
                size={iconProps.size || fontSize}
                style={[iconStyle, textStyle, iconProps.style]}
          />
        );
      } else {
        newChild.push(before);
      }
    }
    if (children) {
      if (typeof children === 'string' || (Array.isArray(children) && typeof children[0] === 'string')) {
        newChild.push(
          <Text key="text"
                style={[{fontSize}, textStyle]}
          >
            {Array.isArray(children) ? children[0] : children}
          </Text>
        );
      } else {
        newChild.push(children);
      }
    }
    if (after) {
      if (typeof after === 'string') {
        newChild.push(
          <Icon {...iconProps}
                key="after"
                name={after}
                size={iconProps.size || fontSize}
                style={[iconStyle, textStyle, iconProps.style]}
          />
        );
      } else {
        newChild.push(after);
      }
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

    return cloneElement(<View />, {
      children: newChild,
      style: temp
    });
  }

  render() {
    const {
      disabled,
      style,
      activeOpacity,
      onHideUnderlay,
      onShowUnderlay,
      underlayColor,
      Comp
    } = this.props;

    const ButtonComp = Comp || Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;

    return (
      <ButtonComp activeOpacity={activeOpacity}
                  disabled={disabled}
                  onHideUnderlay={onHideUnderlay}
                  onPress={this.handlePress}
                  onShowUnderlay={onShowUnderlay}
                  style={style}
                  underlayColor={underlayColor}
      >
        {this.renderContent()}
      </ButtonComp>
    );
  }

}

export default Button;
