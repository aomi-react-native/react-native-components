import React, {
  Component,
  PropTypes,
  cloneElement
} from 'react';
import {
  View,
  Text
} from 'react-native';

import Icon from '../Icon';
import BaseButton from '../Button';
import Colors from './Colors';


const styles = {
  button: {
    borderRadius: 5,
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
  default: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ccc'
  },
  buttonText: {
    margin: 5,
    textAlign: 'center'
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
 * @date 16/5/3
 */
class Button extends Component {

  static propTypes = {
    /**
     * 内容后图标
     */
    afterIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    /**
     * 内容前图标
     */
    beforeIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    /**
     * bootstrap 风格
     */
    bsStyle: PropTypes.oneOf(['primary', 'success', 'info', 'warning', 'danger', 'link', 'default']),
    children: PropTypes.any,
    color: PropTypes.string,
    disabled: PropTypes.bool,
    fontSize: PropTypes.number,
    iconProps: PropTypes.object,
    style: View.propTypes.style
  };

  static defaultProps = {
    bsStyle: 'default',
    fontSize: 16,
    iconProps: {}
  };

  constructor(props) {
    super(props);
    ['renderContent']
      .forEach(f => this[f] = this[f].bind(this));
  }

  renderContent() {
    let {
      disabled,
      afterIcon,
      beforeIcon,
      iconProps,
      fontSize,
      children,
      bsStyle,
      color,
      style
    } = this.props;

    let newChild = [],
      iconStyle = {
        marginRight: 5,
        marginLeft: 5
      };
    let textStyle = Object.assign({}, bsStyle === 'default' || bsStyle === 'link' ? styles.textDefault : styles.textOther);
    if (disabled) {
      textStyle = Object.assign({}, styles.textDisabled);
    }
    if (color) {
      textStyle.color = color;
    }

    if (beforeIcon) {
      if (typeof beforeIcon === 'string') {
        newChild.push(
          <Icon {...iconProps}
            key="beforeIcon"
            name={beforeIcon}
            size={fontSize}
            style={[iconStyle,textStyle,iconProps.style]}
          />
        );
      } else {
        newChild.push(beforeIcon);
      }
    }
    if (children) {
      if (typeof children === 'string' ||
        (Array.isArray(children) && typeof children[0] === 'string')) {
        newChild.push(
          <Text key="text"
                style={[{fontSize},textStyle]}>
            {Array.isArray(children) ? children[0] : children}
          </Text>
        );
      } else {
        newChild.push(children);
      }
    }
    if (afterIcon) {
      if (typeof afterIcon === 'string') {
        newChild.push(
          <Icon {...iconProps}
            key="afterIcon"
            name={afterIcon}
            size={fontSize}
            style={[iconStyle,textStyle,iconProps.style]}
          />
        );
      } else {
        newChild.push(afterIcon);
      }
    }

    let temp = [];
    if (bsStyle === 'link') {
      temp.push(styles.link);
    } else {
      temp.push(styles.button);
      temp.push({backgroundColor: Colors[bsStyle]});
    }
    temp.push(style);

    return cloneElement(<View />, {
      children: newChild,
      style: temp
    });
  }

  render() {
    return (
      <BaseButton {...this.props}
        renderContent={this.renderContent}
      />
    );


  }

}

export default Button;
