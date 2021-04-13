import React, { Component, PropTypes } from 'react';

import { StyleSheet, ListView, TouchableOpacity, Text } from 'react-native';

let ComponentExamples: Array = [
  {
    key: 'IconExamples',
  },
  {
    key: 'BootstrapButtonExamples',
  },
  {
    key: 'FormExamples',
  },
  {
    key: 'InputExamples',
  },
];

let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    height: 40,
    justifyContent: 'center',
    backgroundColor: '#CCC',
  },
  itemText: {
    fontSize: 18,
  },
});

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/4/24
 */
class Home extends Component {
  static propTypes = {
    navigator: PropTypes.object,
  };

  constructor(props) {
    super(props);
    ['renderRow', 'goExamples'].forEach(f => (this[f] = this[f].bind(this)));
  }

  goExamples(route) {
    return () => {
      this.props.navigator.push({ name: route, title: route });
    };
  }

  renderRow(item) {
    return (
      <TouchableOpacity onPress={this.goExamples(item.key)} style={styles.item}>
        <Text style={styles.itemText}>{`<${item.key}>`}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <ListView
        dataSource={ds.cloneWithRows(ComponentExamples)}
        renderRow={this.renderRow}
        style={styles.container}
      />
    );
  }
}

export default Home;
