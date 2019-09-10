import * as React from 'react';
import Component from '../AbstractComponent';
import { StyleSheet, View } from 'react-native';
import { TabView } from 'react-native-tab-view';
import { Props } from './Props';
import { getWindowSize } from '../styles';

const styles = StyleSheet.create({
  container: {
    position: 'relative'
  },
  dotContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    zIndex: 9999
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3
  },
  activeDot: {
    backgroundColor: '#007aff'
  }
});

const initialLayout = {
  height: 1,
  width: getWindowSize().width
};

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 2017/10/18
 */
export class Swiper extends Component<Props> {

  static defaultProps = {
    autoPlay: false,
    duration: 2500,
    horizontal: true
  };

  state = {
    index: 0,
    routes: []
  };

  autoPlayTask;

  componentWillMount() {
    const {children} = this.props;
    this.updateRoute(children);
    this.autoPlay();
  }

  componentWillReceiveProps({children}) {
    this.updateRoute(children);
  }

  componentWillUnmount() {
    this.autoPlayTask && clearInterval(this.autoPlayTask);
  }

  updateRoute(children) {
    this.setState({
      index: 0,
      routes: React.Children.toArray(children).map((child, index) => ({
        key: `${index}`
      }))
    });
  }

  autoPlay() {
    const {autoPlay, duration} = this.props;
    if (autoPlay) {
      this.autoPlayTask = setInterval(() => {
        const {index, routes} = this.state;
        let next = index + 1;
        if (!routes[next]) {
          next = 0;
        }
        this.setState({index: next});
      }, duration);
    } else {
      this.autoPlayTask && clearInterval(this.autoPlayTask);
    }
  }

  handleIndexChange(index: number) {
    this.setState({index});
  }

  renderScene({route}) {
    const {children} = this.props;
    const {key} = route;
    return (
      <View style={{flex: 1, width: getWindowSize().width}}>
        {React.Children.toArray(children)[key]}
      </View>
    );
  }

  renderPagination({navigationState}) {
    const {index, routes} = navigationState;
    const {activeColor = '#007aff', inactiveColor = 'rgba(0,0,0,.2)'} = this.props;
    return (
      <View style={styles.dotContainer}>
        {routes.map(({key}) => (
          <View key={key}
                style={[styles.dot, {backgroundColor: `${index}` === key ? activeColor : inactiveColor}]}
          />
        ))}
      </View>
    );
  }

  render() {
    const {containerStyle, style} = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <TabView initialLayout={initialLayout}
                 navigationState={this.state}
                 onIndexChange={this.handleIndexChange}
                 renderScene={this.renderScene}
                 renderTabBar={this.renderPagination}
                 style={[{flex: 1}, style]}
                 tabBarPosition="bottom"
        />
      </View>
    );
  }

}
