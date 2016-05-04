import React, {
    Component,
    PropTypes,
    TouchableOpacity,
    View
} from 'react-native';

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/3
 */
class Button extends Component {

    static propTypes = {
        bsStyle: PropTypes.string,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        bsStyle: 'default'
    };

    render() {

        let {
            disabled,
            ...other
        } = this.props;

        let Comp = disabled ? Viewe : TouchableOpacity;

        return (
            <Comp {...other}>
            </Comp>
        );
    }

}

export default Button;
