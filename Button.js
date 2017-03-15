import React, { PropTypes, cloneElement } from 'react';
import Component from './AbstractComponent';
import { TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback, Text, View, Platform } from 'react-native';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import Icon from './Icon';
import { Colors } from './styles';

const styles = {
  button: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent',
    borderStyle: 'solid',
    height: 44,
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
    borderColor: '#ccc',
    backgroundColor: Colors.white
  },
  textDefault: {
    color: '#333'
  },
  textOther: {
    color: '#FFF'
  },
  textDisabled: {
    color: '#CCC'
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
    containerStyle: View.propTypes.style,
    disabled: PropTypes.bool,
    fontSize: PropTypes.number,
    iconProps: PropTypes.object,
    type: PropTypes.oneOf(['primary', 'success', 'info', 'warning', 'danger', 'link', 'default'])
  };

  static defaultProps = {
    autoDismissKeyboard: false,
    disabled: false,
    type: 'default',
    fontSize: 14,
    iconProps: {}
  };


  handlePress() {
    const {onPress, autoDismissKeyboard} = this.props;
    autoDismissKeyboard && dismissKeyboard();
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
      containerStyle
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
    } else {
      temp.push(styles.button);
      temp.push({backgroundColor: Colors[type]});
    }
    if (type === 'default') {
      temp.push(styles.containerDefault);
    }
    temp.push(containerStyle);

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
