/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2017/11/4
 */
import { BaseFormPropTypes } from '../Form/AbstractFormComponent';

export default interface Props extends BaseFormPropTypes {
  editable?: boolean;
  maxDate?: Date;
  minDate?: Date;
  mode?: 'date' | 'time' | 'datetime';
  value?: Date;
  onDateChange?: (date: Date) => void;
}
