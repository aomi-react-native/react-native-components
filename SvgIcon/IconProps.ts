/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */

export interface Path {
  d: string;
  fill?: string;
}

export default interface IconProps {
  fill?: string;
  path: string | string[] | Path
}
