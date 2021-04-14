export interface Title {
  fontSize: number;
  color: string;
}

export const title: Title = {
  fontSize: 16,
  color: '#333333'
};

export interface Subtitle extends Title {}

export const subtitle: Subtitle = {
  fontSize: 12,
  color: '#7E848E'
};
