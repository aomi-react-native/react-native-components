import { forwardRef } from 'react';
import { View, ViewProps } from 'react-native';
import { useThemeProps } from '../styles/useThemeProps';

export interface ListItemProps extends ViewProps {}

/**
 * list item
 */
export const ListItem = forwardRef<any, ListItemProps>(function ListItem(inProps, ref) {
  const { theme, children, style, ...props } = useThemeProps({ props: inProps, name: 'AMTitle' });
  const defStyle = {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  };

  return (
    <View style={[defStyle, style]} ref={ref} {...props}>
      {children}
    </View>
  );
});
