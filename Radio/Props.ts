import { BaseFormPropTypes } from '../Form/AbstractFormComponent';
import { ReactNode } from 'react';
import { ImageStyle, StyleProp } from 'react-native';


export interface RadioGroupProps extends BaseFormPropTypes {
  defaultChecked?: any,
  checked?: any
  labelPosition?: 'left' | 'right'
  onChange?: (value: any) => void
}

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2018/3/2
 */
export interface RadioProps {
  label?: string
  value?: any
  checkedIcon?: ReactNode
  checkedIconStyle?: StyleProp<ImageStyle>
  uncheckedIcon?: ReactNode
  uncheckedIconStyle?: StyleProp<ImageStyle>
}

