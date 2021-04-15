import { TitleProps } from '../Title/Title';
import { SubtitleProps } from '../Title/Subtitle';
import { ListProps } from '../List/List';
import { ListItemProps } from '../List/ListItem';
import { ListItemTextProps } from '../List/ListItemText';

export type ComponentsProps = {
  [Name in keyof ComponentsPropsList]?: Partial<ComponentsPropsList[Name]>;
};

export interface ComponentsPropsList {
  AMList: ListProps;
  AMListItem: ListItemProps;
  AMListItemText: ListItemTextProps;
  AMTitle?: TitleProps;
  AMSubtitle?: SubtitleProps;
}
