import * as React from 'react';
import {
  FlatList,
  FlatListProps,
  StyleProp,
  View,
  ViewStyle
} from 'react-native';
import { useThemeProps } from '../styles/useThemeProps';
import { Divider } from '../Divider';

export interface ListProps<T = any> extends FlatListProps<T> {
  header?: React.ReactNode;
  footer?: React.ReactNode;

  containerStyle?: StyleProp<ViewStyle>;
}

function keyExtractor(item, index) {
  return `${index}`;
}

/**
 * list
 */
export const List = React.forwardRef<any, React.PropsWithChildren<ListProps>>(
  function List(inProps, ref) {
    const { containerStyle, header, footer, ...props } = useThemeProps({
      props: inProps,
      name: 'AMList'
    });

    return (
      <View style={[containerStyle]}>
        {header}
        <FlatList
          keyExtractor={keyExtractor}
          ref={ref}
          ItemSeparatorComponent={Divider}
          {...props}
        />
        {footer}
      </View>
    );
  }
);
