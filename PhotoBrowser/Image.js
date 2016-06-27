import React, { PropTypes } from 'react';
import Component from '../AbstractComponent';
import {
  Image as RNImage,
  View,
  StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/6/13
 */
class Image extends Component {

  static propTypes = {
    containerStyle: View.propTypes.style,
    size: PropTypes.object,
    source: RNImage.propTypes.source,
    style: RNImage.propTypes.style
  };

  state = {
    progress: 0,
    error: false,
    source: null
  };

  startLoad() {
    // this.setState({source: this.props.source});
  }

  handleImageLoad() {
    this.setState({
      progress: 1
    });
  }

  handleOnProgress(event) {
    const progress = event.nativeEvent.loaded / event.nativeEvent.total;
    if (progress !== this.state.progress) {
      this.setState({progress});
    }
  }

  handleImageError() {
    this.setState({
      error: true,
      progress: 1
    });
  }

  renderError() {

  }

  render() {
    const {error} = this.state;
    const {style, containerStyle, source, ...other} = this.props;

    return (
      <View style={[styles.container, containerStyle]}>
        {error && this.renderError()}
        <RNImage {...other}
          onError={this.handleImageError}
          onLoad={this.handleImageLoad}
          onProgress={this.handleOnProgress}
          source={source}
          style={[style]}
        />
      </View>
    );
  }

}

export default Image;
