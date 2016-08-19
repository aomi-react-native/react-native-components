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
  tabBottomActive: {
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
    children: PropTypes.node.isRequired,
    activeTab: PropTypes.string,
    navigatorSceneConfigs: PropTypes.object,
    position: PropTypes.oneOf(['Top', 'Bottom']),
    renderTabBar: PropTypes.func,
    style: View.propTypes.style,
    tabContainerStyle: View.propTypes.style,
    tabStyle: View.propTypes.style,
    onTabChange: PropTypes.func
  };

  static defaultProps = {
    position: 'Bottom',
    navigatorSceneConfigs: Navigator.SceneConfigs.HorizontalSwipeJump
  };

  state = {};

  // refs
  navigator;

  componentDidMount() {
    this.getTabs();
    console.log(this.tabs);
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
      console.log(tab);
      if (tab === this.state.activeTab) {
        return;
      }
      const {onTabChange} = this.props;
      const routes = this.navigator.getCurrentRoutes();
      console.log(routes);
      const route = routes.find(route => route.tabLabel === tab);
      this.setState({
        activeTab: tab
      });
      onTabChange && onTabChange(tab);
      this.navigator.jumpTo(route);
    };
  }

  handleWillFocus(route) {
    const {onTabChange} = this.props;
    this.setState({
      activeTab: route.tabLabel
    });
    onTabChange && onTabChange(route.tabLabel);
  }

  configureScene() {
    return this.props.navigatorSceneConfigs;
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
            <Button containerStyle={[styles.tab,
                      tab === this.state.activeTab ? styles[`tab${position}Active`] : {},
                      tabStyle
                    ]}
                    key={index}
                    onPress={this.goTab(tab)}
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
      <View style={style}>
        <Navigator configureScene={this.configureScene}
                   initialRoute={initialRoute}
                   initialRouteStack={routes}
                   navigationBar={this.renderTabBar()}
                   onWillFocus={this.handleWillFocus}
                   ref={navigator => this.navigator = navigator}
                   renderScene={this.renderScene}

        />
      </View>
    );
  }

}

export default Tabs;
