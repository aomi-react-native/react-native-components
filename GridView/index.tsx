import * as React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { autoBind } from 'jsdk/autoBind';

import { getWindowSize } from '../styles/util';
import Props from './Props';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  }
});

function handleCellData(cells, cols) {
  let data = [];
  let size = Math.ceil(cells.length / cols);

  for (let i = 0; i < size; i++) {
    let group = [];
    for (let j = 0; j < cols; j++) {
      if (cells[i * cols + j]) {
        group.push(cells[i * cols + j]);
      } else {
        group.push({ empty: true });
      }
    }
    data.push(group);
  }
  return data;
}

/**
 * GridView
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/25
 */
@autoBind
export class GridView extends React.Component<Props> {
  static defaultProps = {
    autoWidth: true,
    cols: 1,
    horizontalSpacing: 0,
    verticalSpacing: 0
  };

  state;

  constructor(props) {
    super(props);
    const { cols, cells } = this.props;
    const data = handleCellData(cells, cols);
    this.state = {
      cellHeight: 0,
      data,
      width: getWindowSize().width
    };
  }

  static getDerivedStateFromProps(props) {
    const data = handleCellData(props.cells, props.cols);
    return {
      data
    };
  }

  handleLayout(event) {
    const { width } = event.nativeEvent.layout;
    this.setState({
      width
    });
  }

  renderItem({ item, index }) {
    const { renderCell, horizontalSpacing, verticalSpacing, autoWidth, cols } = this.props;
    const { width, data } = this.state;
    const style: any = {
      marginRight: horizontalSpacing
    };
    if (autoWidth) {
      style.width = (width - (cols > 0 ? (cols - 1) * horizontalSpacing : 0)) / cols;
    }

    const children = item.map((cell, key) => {
      const newStyle = { ...style };
      if (key === item.length - 1) {
        newStyle.marginRight = 0;
      }
      if (cell.empty) {
        return React.cloneElement(<View />, {
          key,
          style: newStyle
        });
      }
      return React.cloneElement(<View />, {
        key,
        style: newStyle,
        children: renderCell({
          cell,
          cellId: key
        })
      });
    });
    return <View style={[styles.row, { marginBottom: index === data.length - 1 ? 0 : verticalSpacing }]}>{children}</View>;
  }

  keyExtractor(item, index) {
    return `${index}`;
  }

  render() {
    const { containerStyle, verticalSpacing, horizontalSpacing, ...other } = this.props;

    return (
      <View style={containerStyle}>
        <FlatList {...other} data={this.state.data} keyExtractor={this.keyExtractor} renderItem={this.renderItem} onLayout={this.handleLayout} />
      </View>
    );
  }
}
