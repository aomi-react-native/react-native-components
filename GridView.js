import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import { FlatList, StyleSheet, View, ViewPropTypes } from 'react-native';
import AbstractComponent from './AbstractComponent';
import { getWindowSize } from './styles';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  }
});

/**
 * GridView
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/25
 */
class GridView extends AbstractComponent {
  static propTypes = {
    /**
     * grid cell 列表数组
     */
    cells: PropTypes.array.isRequired,

    /**
     * 渲染Grid Cell
     */
    renderCell: PropTypes.func.isRequired,

    /**
     * 自动设置宽度
     */
    autoWidth: PropTypes.bool,

    cellStyle: ViewPropTypes.style,
    /**
     * 列数
     */
    cols: PropTypes.number,

    enableEmptySections: PropTypes.bool,

    /**
     * 水平间距
     */
    horizontalSpacing: PropTypes.number,

    rowHasChanged: PropTypes.func,

    verticalSpacing: PropTypes.number
  };

  static defaultProps = {
    autoWidth: true,
    cols: 1
  };

  props: Object;
  state = {};

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
    const style = {
      marginHorizontal: horizontalSpacing / 2
    };
    if (autoWidth) {
      style.width = getWindowSize().width / cols - (cols > 0 ? (cols - 1) * horizontalSpacing : 0);
    }

    const children = item.map((cell, key) => {
      if (cell.empty) {
        return cloneElement(<View/>, {
          key,
          style
        });
      }
      return cloneElement(<View/>, {
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
    return index;
  }

  render() {
    const {style, verticalSpacing, horizontalSpacing, ...other} = this.props;

    return (
      <FlatList {...other}
                data={this.state.data}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
                style={[{
                  marginHorizontal: -horizontalSpacing,
                  marginVertical: -verticalSpacing
                }, style]}
      />
    );

  }
}

export default GridView;

