import * as React from 'react';
import { Svg, Path } from 'react-native-svg';
import IconProps from './IconProps';


/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */
export default class SvgIcon extends React.Component<IconProps> {

  static defaultProps = {
    width: 24,
    height: 24,
    viewBox: '0 0 1024 1024'
  };

  getPathProps(path) {
    let props = path;
    if (typeof path === 'string') {
      props = {
        d: path
      };
    }
    if (!props.fill) {
      props.fill = this.props.fill
    }
    return props;
  }

  render() {
    const {path, ...other} = this.props;

    let pathComp;

    if (Array.isArray(path)) {
      pathComp = path.map((item, index) => (
        <Path {...this.getPathProps(item)}
              key={index}
        />
      ));
    } else {
      pathComp = <Path {...this.getPathProps(path)}/>;
    }

    return (
      <Svg {...other}>
        {pathComp}
      </Svg>
    );
  }

}
