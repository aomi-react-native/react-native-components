import { forwardRef, ReactNode } from 'react';
import {
  FlatList,
  FlatListProps,
  StyleProp,
  View,
  ViewStyle
} from 'react-native';
import { useThemeProps } from '../styles/useThemeProps';

export interface ListProps<T = any> extends FlatListProps<T> {
  header?: ReactNode;
  footer?: ReactNode;

  containerStyle?: StyleProp<ViewStyle>;
}

function keyExtractor(item, index) {
  return `${index}`;
}

/**
 * list
 */
export const List = forwardRef<any, ListProps>(function List(inProps, ref) {
  const { containerStyle, header, footer, ...props } = useThemeProps({
    props: inProps,
    name: 'AMList'
  });

  return (
    <View style={[containerStyle]}>
      {header}
      <FlatList keyExtractor={keyExtractor} ref={ref} {...props} />
      {footer}
    </View>
  );
});
