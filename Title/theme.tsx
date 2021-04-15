export interface Title {
  fontSize: number;
  color: string;
}

export const title: Title = {
  fontSize: 16,
  color: 'rgba(0, 0, 0, 0.87)'
};

export interface Subtitle extends Title {}

export const subtitle: Subtitle = {
  fontSize: 14,
  color: 'rgba(0, 0, 0, 0.54)'
};
