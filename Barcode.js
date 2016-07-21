import React, { PropTypes } from 'react';
import Component from './AbstractComponent';
import {
  View,
  StyleSheet,
  requireNativeComponent,
} from 'react-native';
import common from './styles';

export const Type = {
  QR: 'QR'
};

const borderStyle = {
  position: 'absolute',
  width: 20,
  height: 20,
  borderColor: '#46b8da'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  captureWindow: {
    ...common.fullScreenAbsolute
  },
  cell: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  window: {
    backgroundColor: 'transparent',
    position: 'relative'
  },
  windowStyle: {
    ...common.fullScreenAbsolute,
    borderWidth: 5,
    borderColor: 'rgba(0, 0, 0, 0.5)',
  },
  top: {
    ...borderStyle,
    top: 1,
    left: 1,
    borderTopWidth: 5,
    borderLeftWidth: 5
  },
  right: {
    ...borderStyle,
    top: 1,
    right: 1,
    borderTopWidth: 5,
    borderRightWidth: 5
  },
  bottom: {
    ...borderStyle,
    bottom: 1,
    right: 1,
    borderBottomWidth: 5,
    borderRightWidth: 5
  },
  left: {
    ...borderStyle,
    bottom: 1,
    left: 1,
    borderBottomWidth: 5,
    borderLeftWidth: 5
  }
});

/**
 * 条形码组件
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/7/19
 */
class Barcode extends Component {

  static propTypes = {
    ...View.propTypes,
    renderBottom: PropTypes.func,
    renderTop: PropTypes.func,
    scanLineStyle: View.propTypes.style,
    type: PropTypes.oneOf([Type.QR]),
    windowSize: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number
    })
  };

  static defaultProps = {
    type: Type.QR,
    windowSize: {
      width: 270,
      height: 270
    }
  };

  state = {};

  constructor(props) {
    super(props);
    this.state = {
      windowSize: {
        width: 270,
        height: props.type == Type.QR ? 270 : 70
      }
    };
  }

  render() {
    const {renderTop, renderBottom} = this.props;
    return (
      <View style={styles.container}>
        <RCTBarcode style={{flex: 1}}/>
        <View style={styles.captureWindow}>
          <View style={styles.cell}>
            {renderTop ? renderTop() : null}
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.cell}/>
            <View style={[styles.window, this.state.windowSize]}>
              <View style={styles.windowStyle}>
                <View style={{flex: 1, borderWidth: 1, borderColor: 'white'}}/>
              </View>
              <View style={[styles.top]}/>
              <View style={[styles.right]}/>
              <View style={[styles.bottom]}/>
              <View style={[styles.left]}/>
            </View>
            <View style={styles.cell}/>
          </View>
          <View style={styles.cell}>
            {renderBottom ? renderBottom() : null}
          </View>
        </View>
      </View>
    );
  }

}

const RCTBarcode = requireNativeComponent('SitbRCTBarcodeView', Barcode);

export default Barcode;
