/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/7
 */
import { ViewProperties } from 'react-native';
import { ReactNode } from 'react';

export interface CardProps extends ViewProperties {}

export interface BodyProps extends ViewProperties {}

export interface FooterProps extends ViewProperties {}

export interface HeaderProps extends ViewProperties {
  extra?: ReactNode;
  subtitle?: ReactNode;
  thumb?: ReactNode;
  title?: ReactNode;
}
