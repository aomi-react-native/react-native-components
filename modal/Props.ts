/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */
import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { EmptyFunction } from '../Global';
import Button from '../Button/Props';


export default interface Props {
  /**
   * 按钮组,属性参考Button props
   */
  buttons?: Array<Button>;
  /**
   * 内容
   */
  content?: ReactNode;
  /**
   * 内容容器样式
   */
  contentStyle?: StyleProp<ViewStyle>;

  containerStyle?: StyleProp<ViewStyle>;

  /**
   * 隐藏时候的动画
   */
  hideAnimation?: any;
  /**
   * 蒙版样式
   */
  maskStyle?: StyleProp<ViewStyle>;
  /**
   * 显示动画
   */
  showAnimation?: any;
  /**
   * 标题
   */
  title?: string;
  /**
   * 背景层点击
   */
  onDismiss?: EmptyFunction;

  scene?: string;

}
