import * as React from 'react';
/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */
export type EmptyFunction = () => void;

export type ReactNodeFunction = () => React.ReactNode;

export interface Size {
  width?: number;
  height?: number
}
