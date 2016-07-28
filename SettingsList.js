import React, {
  Component,
  PropTypes
} from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import AbstractComponent from './AbstractComponent';
import Icon from './Icon';
import Button from './bootstrap/Button';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 10
  },
  left: {
    width: 30,
    marginTop: 1
  },
  center: {
    flex: 1
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center'
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
  disablePress: Boolean,
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

  renderLeft(row:Item) {
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

  renderCenter(row:Item) {
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

  renderRight(row:Item) {
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

  renderRow(row:Item, index) {
    let {renderLeft, renderCenter, renderRight, disablePress, onPress} = row;
    const rightStyle = {};
    if (this.props.items.length !== 0) {
      rightStyle.marginTop = 0.5;
    }
    if (this.props.items.length - 1 !== index) {
      rightStyle.borderBottomWidth = 0.5;
      rightStyle.borderBottomColor = '#c8c8c8';
    }
    let Comp = disablePress ? View : Button;
    return (
      <Comp bsStyle="link"
            key={index}
            onPress={onPress}
            style={styles.row}
      >
        {renderLeft ? renderLeft(row) : this.renderLeft(row)}
        <View style={[styles.rightContainer, rightStyle]}>
          {renderCenter ? renderCenter(row) : this.renderCenter(row)}
          {renderRight ? renderRight(row) : this.renderRight(row)}
        </View>
      </Comp>
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
