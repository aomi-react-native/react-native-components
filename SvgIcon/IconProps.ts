import { SvgProps } from 'react-native-svg';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */

export interface Path {
  d: string;
  fill?: string;
}

export default interface IconProps extends SvgProps {
  fill?: string;
  path: string | string[] | Path
}
