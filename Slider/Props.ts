/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */
import { BaseFormPropTypes } from '../Form/AbstractFormComponent';

export default interface Props extends BaseFormPropTypes {
  onValueChange?: (value: number) => void;
  value?: number;
}
