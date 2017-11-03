/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */
import { ReactNode } from 'react';

export type EmptyFunction = () => void;

export type ReactNodeFunction = () => ReactNode;

export interface Size {
  width?: number;
  height?: number
}

export interface BaseProps {
  children?: ReactNode;
}
