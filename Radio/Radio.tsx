import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Image } from 'react-native';
import AbstractFormComponent from '../Form/AbstractFormComponent';
import { RadioProps } from './Props';
import Button from '../Button/index';
import { styles } from './styles';

const off = require('./off.png');
const on = require('./on.png');

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2018/3/2
 */
export class Radio extends AbstractFormComponent<RadioProps, any> {

  static contextTypes = {
    onChange: PropTypes.func,
    labelPosition: PropTypes.oneOf(['left', 'right']),
    checked: PropTypes.any
  };

  getValue(): any {
    return this.state.checked;
  }

  isValid(): boolean {
    return true;
  }

  handlePress() {
    const {value} = this.props;
    this.context && this.context.onChange && this.context.onChange(value);
  }

  render() {
    const {
      checkedIcon,
      checkedIconStyle,
      uncheckedIcon,
      uncheckedIconStyle,
      value, label
    } = this.props;

    const defaultCheckedIcon = (
      <Image source={on}
             style={[styles.icon, checkedIconStyle]}
      />
    );

    const defaultUncheckedIcon = (
      <Image source={off}
             style={[styles.icon, uncheckedIconStyle]}
      />
    );

    let after, before;
    let icon = uncheckedIcon || defaultUncheckedIcon;
    if (this.context.checked === value) {
      icon = checkedIcon || defaultCheckedIcon;
    }
    switch (this.context.labelPosition) {
      case 'left':
        after = icon;
        break;
      case 'right':
        before = icon;
        break;
      default:
        before = icon;
        break;
    }

    return (
      <Button after={after}
              before={before}
              containerStyle={styles.btn}
              onPress={this.handlePress}
              type="link"
      >
        {label}
      </Button>
    );

  }

}
