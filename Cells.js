import React, { PropTypes } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, ListView } from 'react-native';
import AbstractComponent from './AbstractComponent';
import Icon from './Icon';
import Button from './Button';
import { Colors } from './styles';

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderTopWidth: 1
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    height: 45,
    alignItems: 'center',
    marginLeft: 15,
    paddingRight: 15
  },
  header: {
    width: 30
  },
  body: {
    flex: 1
  },
  text: {
    color: '#000'
  },
  separator: {
    height: 0.5,
    marginLeft: 15
  }
});

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/25
 */
class List extends AbstractComponent {

  static propTypes = {
    bodyTextStyle: Text.propTypes.style,
    cellStyle: View.propTypes.style,
    items: PropTypes.array,
    separatorColor: PropTypes.string,
    onItemPress: PropTypes.func
  };

  static defaultProps = {
    alwaysBounceVertical: false,
    rowHasChanged: (r1, r2) => r1 !== r2,
    separatorColor: Colors.separator
  };

  state = {};

  constructor(props) {
    super(props);
    const {items, rowHasChanged} = props;
    const ds = new ListView.DataSource({rowHasChanged});
    this.state = {
      dataSource: ds.cloneWithRows(items)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.items !== nextProps.items) {
      this.setState({dataSource: this.state.dataSource.cloneWithRows(nextProps.items)});
    }
  }

  renderHeader(header) {
    return header || <View />;
  }

  renderBody(body) {
    const {bodyTextStyle} = this.props;
    if (!body || typeof body === 'string') {
      return (
        <Text style={[styles.body, bodyTextStyle]}>{body || ''}</Text>
      );
    }
    return body;
  }

  renderFooter(footer) {
    if (footer) {
      if (typeof footer === 'string') {
        return (
          <Text>{footer}</Text>
        );
      }
      return footer;
    }
    return (
      <Icon color="#000"
            name="angle-right"
            size={18}
      />
    );
  }

  renderRow(row, sectionID, rowID, highlightRow) {
    const {header, body, footer} = row;
    const {onItemPress, cellStyle} = this.props;
    return (
      <Button Comp={TouchableHighlight}
              containerStyle={[styles.row, cellStyle]}
              key={rowID}
              onPress={() => onItemPress && onItemPress(row, sectionID, rowID)}
              type="link"
              underlayColor={Colors.underlay}
      >
        {this.renderHeader(header)}
        {this.renderBody(body)}
        {this.renderFooter(footer)}
      </Button>
    );
  }

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    const {separatorColor, items} = this.props;
    if (rowID === `${items.length - 1}`) {
      return null;
    }
    const style = {
      backgroundColor: adjacentRowHighlighted ? 'transparent' : separatorColor
    };
    return (
      <View key={`${sectionID}-${rowID}`}
            style={[styles.separator, style]}
      />
    );
  }

  render() {
    const {style, separatorColor, ...other} = this.props;
    return (
      <View style={[styles.container, {borderColor: separatorColor}, style]}>
        <ListView {...other}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderSeparator={this.renderSeparator}
        />
      </View>
    );
  }

}

export default List;
