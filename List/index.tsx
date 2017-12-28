import * as React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import AbstractComponent from '../AbstractComponent';

import { Colors, fontSize, separatorHeight } from '../styles';
import Props from './Props';

const right = require('../images/right.png');

const padding = 15;

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: separatorHeight,
    borderTopWidth: separatorHeight,
    backgroundColor: '#FFF'
  },
  rowContainer: {
    backgroundColor: '#b3b3b3'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 45,
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: padding
  },
  header: {
    marginRight: 10
  },
  headerText: {
    color: Colors.fontColor,
    fontSize,
  },
  body: {
    flex: 1
  },
  bodyTextStyle: {
    color: Colors.fontColor,
    fontSize
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  footerTextStyle: {
    color: '#b3b3b3',
    fontSize
  },
  separator: {
    height: separatorHeight
  },
  right: {
    width: 19,
    height: 19,
    resizeMode: 'contain'
  }
});

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/25
 */
class List extends AbstractComponent<Props> {

  static defaultProps = {
    disabled: false,
    displayRightArrow: true,
    alwaysBounceVertical: false,
    fullSeparator: false,
    separatorColor: Colors.separator,
    rightArrow: (
      <Image source={right}
             style={styles.right}
      />
    )
  };

  renderHeader(header) {
    const {headerTextStyle} = this.props;

    if (typeof header === 'string') {
      return (
        <Text style={[styles.header, styles.headerText, headerTextStyle]}>{header}</Text>
      );
    }

    return React.cloneElement(<View/>, {
      style: header && styles.header,
      children: header
    });
  }

  renderBody(body) {
    const {bodyTextStyle} = this.props;
    if (!body || typeof body === 'string') {
      return (
        <Text style={[styles.body, styles.bodyTextStyle, bodyTextStyle]}>{body || ''}</Text>
      );
    }
    return React.cloneElement(<View/>, {
      style: styles.body,
      children: body
    });
  }

  renderFooter(footer, rightArrow) {
    const {footerTextStyle} = this.props;
    return (
      <View style={styles.footer}>
        {typeof footer === 'string' ? (
          <Text style={[styles.footerTextStyle, footerTextStyle]}>{footer}</Text>
        ) : footer}
        {rightArrow}
      </View>
    );
  }

  renderItem({item}) {
    const {header, body, footer, rightArrow, disabled, style} = item;
    const {
      onItemPress, itemStyle, disabled: defaultDisabled,
      rightArrow: defaultRightArrow
    } = this.props;

    let tmpDisplayRightArrow = rightArrow;
    if (null === rightArrow || undefined === rightArrow) {
      tmpDisplayRightArrow = defaultRightArrow;
    }
    let tmpDisabled = disabled;
    if (disabled === undefined) {
      tmpDisabled = defaultDisabled;
    }

    return (
      <TouchableHighlight disabled={tmpDisabled}
                          onPress={() => onItemPress && onItemPress(item)}
                          style={styles.rowContainer}
      >
        <View style={[styles.row, style || itemStyle]}>
          {this.renderHeader(header)}
          {this.renderBody(body)}
          {this.renderFooter(footer, tmpDisplayRightArrow)}
        </View>
      </TouchableHighlight>
    );
  }

  keyExtractor(item, index) {
    return index;
  }

  render() {
    const {
      header,
      containerStyle,
      fullSeparator,
      separatorColor,
      ItemSeparatorComponent,
      ...other
    } = this.props;

    function DefItemSeparatorComponent() {
      return (
        <View style={fullSeparator ? {} : {paddingLeft: padding}}>
          <View style={[styles.separator, {backgroundColor: separatorColor}]}/>
        </View>
      );
    }

    return (
      <View style={[styles.container, {borderColor: separatorColor}, containerStyle]}>
        {header}
        <FlatList {...other}
                  ItemSeparatorComponent={ItemSeparatorComponent || DefItemSeparatorComponent}
                  keyExtractor={this.keyExtractor}
                  renderItem={this.renderItem}
        />
      </View>
    );
  }

}

export default List;
