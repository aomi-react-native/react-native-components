import React, {
    Component,
    StyleSheet,
    StatusBar,
    Navigator,
    View
} from 'react-native';

import Header from './components/Header';
import Home from './components/Home';
import IconExamples from './components/IconExamples';

const routes = {
    Home,
    IconExamples
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/4/23
 */
class Application extends Component {

    constructor(props) {
        super(props);
        ['renderScene'].forEach(func => this[func] = this[func].bind(this));
    }

    initialRoute = {
        name: 'Home',
        title: 'AppFramework'
    };

    configureScene() {
        return Navigator.SceneConfigs.FloatFromRight;
    }

    renderScene(route, navigator) {
        let ComposedComponent = routes[route.name] || routes[this.initialRoute.name];

        return (
            <View style={styles.container}>
                <Header title={route.title}/>
                <ComposedComponent
                    {...route.params}
                    navigator={navigator}
                />
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#5E001B"
                           barStyle="light-content"
                           translucent
                />
                <Navigator configureScene={this.configureScene}
                           initialRoute={this.initialRoute}
                           ref="navigator"
                           renderScene={this.renderScene}
                />
            </View>
        );
    }
}

export default Application;
