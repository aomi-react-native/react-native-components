import { TitleProps, SubtitleProps } from '../Title';
import {
  ListProps,
  ListItemProps,
  ListItemTextProps,
  ListItemAvatarProps
} from '../List';

export type ComponentsProps = {
  [Name in keyof ComponentsPropsList]?: Partial<ComponentsPropsList[Name]>;
};

export interface ComponentsPropsList {
  AMList: ListProps;
  AMListItem: ListItemProps;
  AMListItemAvatar: ListItemAvatarProps;
  AMListItemText: ListItemTextProps;
  AMTitle?: TitleProps;
  AMSubtitle?: SubtitleProps;
}
