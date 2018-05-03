import * as React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import AbstractComponent from '../AbstractComponent';
import { getWindowSize } from '../styles';

import Props from './Props';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  }
});

/**
 * GridView
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/25
 */
export default class GridView extends AbstractComponent<Props> {

  static defaultProps = {
    autoWidth: true,
    cols: 1,
    horizontalSpacing: 0,
    verticalSpacing: 0
  };

  state;

  constructor(props) {
    super(props);
    const {cols, cells} = this.props;
    const data = this.handleCellData(cells, cols);
    this.state = {
      cellHeight: 0,
      data
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.cells !== nextProps.cells || this.props.cols !== nextProps.cols) {
      const data = this.handleCellData(nextProps.cells, nextProps.cols);
      this.setState({
        data
      });
    }
  }

  handleCellData(cells, cols) {
    let data = [];
    let size = Math.ceil(cells.length / cols);

    for (let i = 0; i < size; i++) {
      let group = [];
      for (let j = 0; j < cols; j++) {
        if (cells[i * cols + j]) {
          group.push(cells[i * cols + j]);
        } else {
          group.push({empty: true});
        }
      }
      data.push(group);
    }
    return data;
  }

  renderItem({item}) {
    const {renderCell, horizontalSpacing, verticalSpacing, autoWidth, cols} = this.props;
    const style: any = {
      marginHorizontal: horizontalSpacing / 2
    };
    if (autoWidth) {
      style.width = getWindowSize().width / cols - (cols > 0 ? (cols - 1) * horizontalSpacing : 0);
    }

    const children = item.map((cell, key) => {
      if (cell.empty) {
        return React.cloneElement(<View/>, {
          key,
          style
        });
      }
      return React.cloneElement(<View/>, {
        key,
        style,
        children: renderCell({
          cell,
          cellId: key
        })
      });
    });
    return (
      <View style={[styles.row, {marginVertical: verticalSpacing / 2}]}>
        {children}
      </View>
    );
  }


  keyExtractor(item, index) {
    return `${index}`;
  }

  render() {
    const {style, containerStyle, verticalSpacing, horizontalSpacing, ...other} = this.props;

    return (
      <View style={containerStyle}>
        <FlatList {...other}
                  data={this.state.data}
                  keyExtractor={this.keyExtractor}
                  renderItem={this.renderItem}
                  style={[{
                    marginHorizontal: -horizontalSpacing,
                    marginVertical: -verticalSpacing
                  }, style]}
        />
      </View>
    );

  }
}
