import React, {
  Component,
  PropTypes
} from 'react';
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  Text,
  View,
  Platform
} from 'react-native';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/5
 */
class Button extends Component {

  static propTypes = {
    ...TouchableWithoutFeedback.propTypes,
    Comp: PropTypes.any,
    autoDismissKeyboard: PropTypes.bool,
    children: PropTypes.any,
    containerStyle: View.propTypes.style,
    disabled: PropTypes.bool,
    renderContent: PropTypes.func
  };

  static defaultProps = {
    autoDismissKeyboard: false,
    disabled: false
  };


  handlePress(onPress) {
    const {autoDismissKeyboard} = this.props;
    return () => {
      autoDismissKeyboard && dismissKeyboard();
      onPress && onPress();
    };
  }


  renderContent(children, renderContent) {
    if (renderContent) {
      return renderContent();
    }

    if (typeof children === 'string' ||
      (Array.isArray(children) && typeof children[0] === 'string')) {
      return (
        <Text>{Array.isArray(children) ? children[0] : children}</Text>
      );
    }
    return <Text />;
  }

  render() {
    const {
      disabled,
      children,
      renderContent,
      style,
      onPress,
      activeOpacity,
      onHideUnderlay,
      onShowUnderlay,
      underlayColor
    } = this.props;

    let Comp = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;
    if (this.props.Comp) {
      Comp = this.props.Comp;
    }

    return (
      <Comp activeOpacity={activeOpacity}
            disabled={disabled}
            onHideUnderlay={onHideUnderlay}
            onPress={this.handlePress(onPress)}
            onShowUnderlay={onShowUnderlay}
            style={style}
            underlayColor={underlayColor}
      >
        {this.renderContent(children, renderContent)}
      </Comp>
    );
  }

}

export default Button;
