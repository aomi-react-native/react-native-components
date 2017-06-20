import React, { Component, PropTypes } from 'react';
import { View, WebView } from 'react-native';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/6/16
 */
class Icon extends Component {

  static propTypes = {
    ...WebView.propTypes,
    fill: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    viewBox: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  };

  static defaultProps = {
    height: 24,
    width: 24
  };

  render() {
    const {width, height, viewBox, fill, style, ...props} = this.props;

    let js = `
    var svg = document.getElementsByTagName('svg')[0];
    var paths = document.getElementsByTagName('path');
    `;
    if (width) {
      js = `${js} svg.setAttribute('width','${width}px');`;
    }
    if (height) {
      js = `${js} svg.setAttribute('height','${height}px');`;
    }
    if (viewBox) {
      js = `${js} svg.setAttribute('height','${viewBox}');`;
    }
    if (fill) {
      const onlyOneColor = !Array.isArray(fill);
      js = `${js}
      var colors = ${JSON.stringify(fill)};
      for(var i = 0; i < paths.length; i++){
        var path = paths[i];
        var color = ${onlyOneColor} ? '${fill}' : colors[i] || '#000';
        path && path.setAttribute('fill',  color);
      }
      `;

    }

    const size = {
      width,
      height
    };
    return (
      <View style={[size, style]}>
        <WebView {...props}
                 domStorageEnabled
                 injectedJavaScript={js}
                 javaScriptEnabled
                 scrollEnabled={false}
                 style={[size, {backgroundColor: 'transparent'}]}
        />
      </View>
    );
  }

}

export default Icon;
