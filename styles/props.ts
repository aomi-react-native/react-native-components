import { TitleProps } from '../Title/Title';
import { SubtitleProps } from '../Title/Subtitle';
import { ListProps } from '../List/List';
import { ListItemProps } from '../List/ListItem';

export type ComponentsProps = {
  [Name in keyof ComponentsPropsList]?: Partial<ComponentsPropsList[Name]>;
};

export interface ComponentsPropsList {
  AMList: ListProps;
  AMListItem: ListItemProps;
  AMTitle?: TitleProps;
  AMSubtitle?: SubtitleProps;
}
