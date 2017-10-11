import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import { FlatList, Image, StyleSheet, Text, TouchableHighlight, View, ViewPropTypes } from 'react-native';
import AbstractComponent from './AbstractComponent';
import right from './images/right.png';
import { Colors, fontSize, separatorHeight } from './styles';

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
    resizeMode: Image.resizeMode.contain
  }
});


export const Row = {
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  body: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  footer: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  displayRightArrow: PropTypes.bool,
  disabled: PropTypes.bool,
  style: ViewPropTypes.style
};

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/25
 */
class List extends AbstractComponent {

  static propTypes = {
    bodyTextStyle: Text.propTypes.style,
    containerStyle: ViewPropTypes.style,
    /**
     * 是否禁止点击
     */
    disabled: PropTypes.bool,
    /**
     * 是否显示右箭头
     */
    displayRightArrow: PropTypes.bool,
    footerTextStyle: Text.propTypes.style,
    fullSeparator: PropTypes.bool,
    itemStyle: ViewPropTypes.style,
    /**
     * 过时,请使用data
     */
    items: PropTypes.array,
    separatorColor: PropTypes.string,
    onItemPress: PropTypes.func
  };

  static defaultProps = {
    disabled: false,
    displayRightArrow: true,
    alwaysBounceVertical: false,
    fullSeparator: false,
    separatorColor: Colors.separator
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.items !== nextProps.items) {
      this.setState({dataSource: this.state.dataSource.cloneWithRows(nextProps.items)});
    }
  }

  renderHeader(header) {
    const {headerTextStyle} = this.props;

    if (typeof header === 'string') {
      return (
        <Text style={[styles.header, styles.headerText, headerTextStyle]}>{header}</Text>
      );
    }

    return cloneElement(<View/>, {
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
    return cloneElement(<View/>, {
      style: styles.body,
      children: body
    });
  }

  renderFooter(footer, displayRightArrow = true) {
    const {footerTextStyle} = this.props;
    return (
      <View style={styles.footer}>
        {typeof footer === 'string' ? (
          <Text style={[styles.footerTextStyle, footerTextStyle]}>{footer}</Text>
        ) : footer}
        {displayRightArrow && (
          <Image source={right}
                 style={styles.right}
          />
        )}
      </View>
    );
  }

  renderItem({item}) {
    const {header, body, footer, displayRightArrow, disabled, style} = item;
    const {
      onItemPress, itemStyle, disabled: defaultDisabled,
      displayRightArrow: defaultDisplayRightArrow
    } = this.props;

    let tmpDisplayRightArrow = displayRightArrow;
    if (typeof displayRightArrow === 'undefined') {
      tmpDisplayRightArrow = defaultDisplayRightArrow;
    }
    let tmpDisabled = disabled;
    if (typeof disabled === 'undefined') {
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
    const {containerStyle, fullSeparator, separatorColor, ...other} = this.props;

    function ItemSeparatorComponent() {
      return (
        <View style={fullSeparator ? {} : {paddingLeft: padding}}>
          <View style={[styles.separator, {backgroundColor: separatorColor}]}/>
        </View>
      );
    }

    return (
      <View style={[styles.container, {borderColor: separatorColor}, containerStyle]}>
        <FlatList {...other}
                  ItemSeparatorComponent={ItemSeparatorComponent}
                  keyExtractor={this.keyExtractor}
                  renderItem={this.renderItem}
        />
      </View>
    );
  }

}

export default List;
