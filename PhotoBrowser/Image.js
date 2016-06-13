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
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/6/13
 */
class Image extends Component {

  static propTypes = {
    source: RNImage.propTypes.source,
    size: PropTypes.object
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
    const {error, progress, ...other} = this.state;
    const {size, source} = this.props;

    return (
      <View style={[styles.container, size]}>
        {error && this.renderError()}
        <RNImage
          {...other}
          style={[styles.image, size]}
          source={source}
          onProgress={this.handleOnProgress}
          onError={this.handleImageError}
          onLoad={this.handleImageLoad}
        />
      </View>
    );
  }

}

export default Image;
