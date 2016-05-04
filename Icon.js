import React, {
    Component,
    PropTypes,
    Text
} from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Zocial from 'react-native-vector-icons/Zocial';

const Comps = {
    Entypo,
    EvilIcons,
    FontAwesome,
    Foundation,
    Ionicons,
    MaterialIcons,
    Octicons,
    Zocial
};

/**
 * 图标类封装
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/3
 */
class Icon extends Component {

    static propTypes = {
        provider: PropTypes.oneOf(['Entypo', 'EvilIcons', 'FontAwesome', 'Foundation', 'Ionicons', 'MaterialIcons', 'Octicons', 'Zocial'])
    };

    static defaultProps = {
        provider: 'FontAwesome'
    };

    render() {
        let {
            provider,
            ...other
        } = this.props;

        let Comp = Comps[provider] || Comps.FontAwesome;

        return (
            <Comp {...other} />
        );
    }

}

export default Icon;
