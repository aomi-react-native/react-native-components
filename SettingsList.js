import React, { PropTypes } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import AbstractComponent from './AbstractComponent';
import Icon from './Icon';
import Button from './bootstrap/Button';
import { Colors } from './styles';

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    marginLeft: 10,
    paddingRight: 10
  },
  left: {
    width: 30,
    marginTop: 1
  },
  center: {
    flex: 1
  },
  right: {},
  text: {
    color: '#000'
  }
});

type Item = {
  left: any,
  leftProps: Object,
  center: any,
  centerProps: Object,
  right: any,
  rightProps: Object,
  renderLeft: Function,
  renderCenter: Function,
  renderRight: Function,
  disabled: Boolean,
  onPress: Function
};

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/25
 */
class List extends AbstractComponent {

  static propTypes = {
    items: PropTypes.array
  };

  renderLeft(row: Item) {
    if (row.left) {
      if (typeof row.left === 'string') {
        let props = row.leftProps || {};
        const {style, color, size, ...other} = props;
        return (
          <View {...other}
            style={[styles.left, style]}
          >
            <Icon color={color || '#000'}
                  name={row.left}
                  size={size || 18}
            />
          </View>
        );
      } else {
        return row.left;
      }
    }
    return <View />;
  }

  renderCenter(row: Item) {
    if (row.center) {
      const props = row.centerProps || {};
      const {style, textProps, ...other} = props;
      let textPropsTmp = textProps || {};

      const {style: textStyle, ...textOther} = textPropsTmp;

      return (
        <View {...other}
          style={[styles.center, style]}
        >
          <Text {...textOther}
            style={[styles.text, textStyle]}
          >
            {row.center}
          </Text>
        </View>
      );
    }

    return <View />;

  }

  renderRight(row: Item) {
    const props = row.rightProps || {};
    const {color, style, size, ...other} = props;
    return (
      <View {...other}
        style={[styles.right, style]}
      >
        <Icon color={color || '#000'}
              name={row.right || 'angle-right'}
              size={size || 18}
        />
      </View>
    );
  }

  renderRow(row: Item, index) {
    let {renderLeft, renderCenter, renderRight, disabled, onPress} = row;
    const separator = {};
    if (this.props.items.length - 1 !== index) {
      separator.borderBottomWidth = 0.5;
      separator.borderBottomColor = Colors.separator;
    }
    return (
      <Button Comp={TouchableHighlight}
              bsStyle="link"
              buttonStyle={{justifyContent: 'flex-start'}}
              disabled={disabled}
              key={index}
              onPress={onPress}
              underlayColor={Colors.underlay}
      >
        <View style={[styles.row, separator]}>
          {renderLeft ? renderLeft(row) : this.renderLeft(row)}
          {renderCenter ? renderCenter(row) : this.renderCenter(row)}
          {renderRight ? renderRight(row) : this.renderRight(row)}
        </View>
      </Button>
    );
  }

  render() {
    let {items, ...other} = this.props;
    return (
      <View {...other}>
        {items.map((row, index) => this.renderRow(row, index))}
      </View>
    );
  }

}

export default List;
