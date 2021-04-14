import { ComponentsProps } from './props';

export interface Components {
  AMList?: {
    defaultProps?: ComponentsProps['AMList'];
  };
  AMListItem?: {
    defaultProps?: ComponentsProps['AMListItem'];
  };
  AMTitle?: {
    defaultProps?: ComponentsProps['AMTitle'];
  };
  AMSubtitle?: {
    defaultProps?: ComponentsProps['AMSubtitle'];
  };
}
