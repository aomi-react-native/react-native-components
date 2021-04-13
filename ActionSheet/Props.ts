/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */
import { EmptyFunction } from '../Global';

export interface Option {
  label: string;
  textColor: string;
  onPress: EmptyFunction;
}

export default interface Props {
  /**
   * （字符串数组） - 一组按钮的标题（必选）
   */
  options: Array<Option>;
  cancel?: string;
  cancelPress?: EmptyFunction;
  manager: any;
  /**
   * （字符串） - 弹出框顶部标题下方的信息
   */
  message?: string;
  title?: string;
  titleTextStyle: any;
}
