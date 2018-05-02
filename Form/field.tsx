import * as React from 'react';

import { FormContext } from './index';

/**
 * @author 田尘殇Sean(sean.snow@live.com) create at 2018/5/2
 */
export default (ComposedComponent): any => (props: any) => (
  <FormContext.Consumer>
    {form => <ComposedComponent {...props} form={form}/>}
  </FormContext.Consumer>
);
