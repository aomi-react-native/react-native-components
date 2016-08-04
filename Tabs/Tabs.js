import React, {
  PropTypes,
  Children,
  isValidElement
} from 'react';
import Component from '../AbstractComponent';
import {
  Navigator,
  View,
  Text,
  StyleSheet
} from 'react-native';
import Button from '../Button';
import commonStyle from '../styles';

const styles = StyleSheet.create({
  tabContainer: {
    minHeight: 45,
    flexDirection: 'row'
  },
  tab: {
    flex: 1,
    ...commonStyle.center
  },
  tab_bottom_active: {
    borderTopWidth: 3,
    borderTopColor: 'red'
  }
});

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/8/4
 */
class Tabs extends Component {

  static propTypes = {
    activeTab: PropTypes.string,
    children: PropTypes.node.isRequired,
    onTabChange: PropTypes.func,
    position: PropTypes.oneOf(['top', 'bottom'])
  };

  static defaultProps = {
    position: 'bottom',
    onTabChange: ()=> {}
  };

  state = {};

  // refs
  navigator;

  componentDidMount() {
    this.getTabs();
  }

  getTabs() {
    const {children, activeTab} = this.props;
    let tabs = {};
    Children.forEach(children, child => {
      if (!isValidElement(child)) {
        return;
      }

      let tabLabel = child.props.tabLabel;

      if (tabLabel) {
        tabs[tabLabel] = child;
      }
    });
    let firstTabLabel = Object.keys(tabs)[0];
    this.tabs = tabs;
    this.setState({
      activeTab: activeTab || firstTabLabel
    });
  }

  goTab(tab) {
    return () => {
      if (tab === this.state.activeTab)
        return;
      const {onTabChange} = this.props;
      const routes = this.navigator.getCurrentRoutes();
      const route = routes.find(r => r.tabLabel === tab);
      this.navigator.jumpTo(route);
      this.setState({
        activeTab: tab
      }, onTabChange);
    };
  }

  handleDidFocus(route) {
    const {onTabChange} = this.props;
    this.setState({
      activeTab: route.tabLabel
    }, onTabChange);
  }

  configureScene() {
    return Navigator.SceneConfigs.HorizontalSwipeJump;
  }

  renderTabBar() {
    const {renderTabBar, tabContainerStyle, tabStyle, position} = this.props;
    const tabs = Object.keys(this.tabs);
    if (renderTabBar) {
      return renderTabBar(tabs);
    }
    return (
      <View style={[styles.tabContainer, tabContainerStyle]}>
        {
          tabs.map((tab, index)=> (
            <Button key={index}
                    onPress={this.goTab(tab)}
                    containerStyle={[styles.tab,
                      tab === this.state.activeTab ? styles[`tab_${position}_active`] : {},
                      tabStyle
                    ]}
            >
              {tab}
            </Button>
          ))
        }
      </View>);
  }

  renderScene(route) {
    return this.tabs[route.tabLabel] || <View />;
  }

  render() {
    if (!this.state.activeTab) {
      return <View />;
    }
    const {style} = this.props;
    const routes = Object.keys(this.tabs).map(tab => ({tabLabel: tab}));
    const initialRoute = routes.find(route => route.tabLabel === this.state.activeTab);
    return (
      <Navigator configureScene={this.configureScene}
                 initialRoute={initialRoute}
                 initialRouteStack={routes}
                 navigationBar={this.renderTabBar()}
                 ref={navigator => this.navigator = navigator}
                 renderScene={this.renderScene}
                 sceneStyle={style}
                 onDidFocus={this.handleDidFocus}
      />
    );
  }

}

export default Tabs;
