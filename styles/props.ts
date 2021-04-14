import { TitleProps } from '../Title/Title';

export type ComponentsProps = {
  [Name in keyof ComponentsPropsList]?: Partial<ComponentsPropsList[Name]>;
};

export interface ComponentsPropsList {
  AMTitle?: TitleProps;
}
