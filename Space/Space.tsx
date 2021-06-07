import * as React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useThemeProps } from '../styles/useThemeProps';

export type SizeType = 'small' | 'middle' | 'large' | undefined;
export type SpaceSize = SizeType | number;

export type SpaceProps = {
  /**
   * 间距大小
   */
  size?: SpaceSize | [SpaceSize, SpaceSize];
} & ViewProps;

const spaceSize = {
  small: 8,
  middle: 16,
  large: 24
};

function getNumberSize(size: SpaceSize) {
  return typeof size === 'string' ? spaceSize[size] : size;
}

/**
 * 间距组件
 */
export const Space = React.forwardRef<any, React.PropsWithChildren<SpaceProps>>(
  function Space(inProps, ref) {
    const { size, children, ...props } = useThemeProps({
      props: inProps,
      name: 'AMSpace'
    });

    const [horizontalSize, verticalSize] = React.useMemo(
      () =>
        ((Array.isArray(size) ? size : [size, size]) as [
          SpaceSize,
          SpaceSize
        ]).map(item => getNumberSize(item)),
      [size]
    );

    const styles = StyleSheet.create({
      item: {
        marginRight: horizontalSize,
        marginBottom: verticalSize
      }
    });

    return (
      <View {...props}>
        {React.Children.map(children, (child, index) => {
          return (
            <View key={index} style={styles.item}>
              {child}
            </View>
          );
        })}
      </View>
    );
  }
);
