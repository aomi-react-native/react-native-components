import * as React from 'react';
import TextInput from '../TextField';
import { Props } from '../TextField/Props';
import { Item } from '../../Picker';

export { Item };

/**
 *
 * @author 田尘殇Sean(sean.snow@live.com) create at 2018/1/2
 */
export default class SelectField extends React.Component<Props> {
  render() {
    return <TextInput {...this.props} type="select" />;
  }
}
