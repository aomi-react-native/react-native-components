import React, {
  Component,
  PropTypes
} from 'react';
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  Text,
  Platform
} from 'react-native';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/5
 */
class Button extends Component {

  static propTypes = {
    activeOpacity: PropTypes.number,
    children: PropTypes.any,
    Comp: PropTypes.any,
    containerStyle: View.propTypes.style,
    disabled: PropTypes.bool,
    renderContent: PropTypes.func
  };

  static defaultProps = {
    Comp: Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback,
    disabled: false
  };

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
    let {
      disabled,
      children,
      Comp,
      renderContent,
      containerStyle,
      onPress,
      activeOpacity,
      onHideUnderlay,
      onShowUnderlay,
      underlayColor
    } = this.props;

    return (
      <Comp activeOpacity={activeOpacity}
            disabled={disabled}
            underlayColor={underlayColor}
            onHideUnderlay={onHideUnderlay}
            onShowUnderlay={onShowUnderlay}
            onPress={onPress}
            style={containerStyle}
      >
        {this.renderContent(children, renderContent)}
      </Comp>
    );
  }

}

export default Button;
