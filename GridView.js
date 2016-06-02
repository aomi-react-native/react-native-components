import React, { PropTypes } from 'react';
import {
  ListView,
  View,
  StyleSheet,
  Dimensions
} from 'react-native';
import AbstractComponent from './AbstractComponent';


const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
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
     * 自动设置宽度
     */
    autoWidth: PropTypes.bool,

    cols: PropTypes.number,
    /**
     * grid cell 列表数组
     */
    cells: PropTypes.array.isRequired,

    enableEmptySections: PropTypes.bool,

    /**
     * 水平间距
     */
    horizontalSpacing: PropTypes.number,
    /**
     * 渲染Grid Cell
     */
    renderCell: PropTypes.func.isRequired,
    verticalSpacing: PropTypes.number
  };

  static defaultProps = {
    autoWidth: true,
    cols: 1,
    enableEmptySections: true
  };

  constructor(props) {
    super(props);

    let {autoWidth, verticalSpacing, horizontalSpacing, cols} = this.props;
    if (autoWidth) {
      const {width} = Dimensions.get('window');
      this.rowStyle = {
        width: width / props.cols - (verticalSpacing ? verticalSpacing * (cols - 2) : 0),
        marginBottom: horizontalSpacing ? horizontalSpacing : 0,
        marginRight: verticalSpacing ? verticalSpacing : 0
      };
    }
  }

  rowStyle;

  renderRow(rowData, sectionID:Number, rowID:Number) {
    let {renderCell} = this.props;
    return (
      <View style={this.rowStyle}>
        {renderCell(rowData, sectionID, rowID)}
      </View>
    );
  }

  render() {
    let {cells, ...other} = this.props;

    return (
      <ListView {...other}
        contentContainerStyle={styles.grid}
        dataSource={ds.cloneWithRows(cells)}
        renderRow={this.renderRow}
      />
    );

  }
}

export default GridView;

