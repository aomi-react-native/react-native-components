import React, {
  PropTypes,
  Children,
  isValidElement,
  cloneElement
} from 'react';
import Component from './AbstractComponent';
import { Navigator } from 'react-native';
import Tabs from './Tabs';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/8/19
 */
class Swiper extends Component {

  static propTypes = {
    /**
     * 自动播放
     */
    autoPlay: PropTypes.bool,
    children: PropTypes.any,
    /**
     * 每一页持续时间
     */
    duration: PropTypes.number
  };

  static defaultProps = {
    autoPlay: true,
    duration: 5000
  };

  // refs
  tabs;

  // var
  items: Array;
  autoPlayTask;
  active = 0;

  componentDidMount() {
    this.handleAutoPlay();
  }

  componentWillUnmount() {
    this.autoPlayTask && clearInterval(this.autoPlayTask);
  }

  handleAutoPlay() {
    const {autoPlay, duration} = this.props;
    if (autoPlay) {
      this.autoPlayTask = setInterval(()=> {
        let next = this.active + 1;
        if (this.items.indexOf(next) === -1) {
          next = 0;
        }
        this.tabs.goTab(`${next}`)();
      }, duration);
    }
  }

  handleTabChange(tab) {
    this.active = tab * 1;
  }

  getChildren(children) {
    this.items = [];
    return Children.map(children, (child, index) => {
      if (!isValidElement(child)) {
        return null;
      }

      this.items.push(index);

      return cloneElement(child, {
        key: index,
        tabLabel: `${index}`
      });
    });
  }

  renderTabBar() {
    return null;
  }

  render() {
    const {children, ...other} = this.props;
    return (
      <Tabs {...other}
        onTabChange={this.handleTabChange}
        ref={tabs => this.tabs = tabs}
        renderTabBar={this.renderTabBar}
      >
        {this.getChildren(children)}
      </Tabs>
    );
  }

}

export default Swiper;
