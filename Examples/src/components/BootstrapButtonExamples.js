import React from 'react';

import AbstractComponent from './AbstractComponent';

import Button from 'react-native-components/bootstrap/Button';

let buttons = [
  {
    children: 'Default',
  },
  {
    bsStyle: 'primary',
    children: 'Primary',
  },
  {
    bsStyle: 'success',
    children: 'Success',
  },
  {
    bsStyle: 'info',
    children: 'Info',
  },
  {
    bsStyle: 'warning',
    children: 'Warning',
  },
  {
    bsStyle: 'danger',
    children: 'Danger',
  },
  {
    disabled: true,
    children: 'Disabled',
  },
  {
    disabled: true,
    bsStyle: 'primary',
    children: 'Primary Disabled',
  },
  {
    beforeIcon: 'user',
    bsStyle: 'primary',
    children: 'Primary',
  },
  {
    afterIcon: 'user',
    bsStyle: 'primary',
    children: 'Primary',
  },
  {
    beforeIcon: 'plus',
    afterIcon: 'user',
    bsStyle: 'primary',
    children: 'Primary',
  },
  {
    beforeIcon: 'plus',
    afterIcon: 'user',
    bsStyle: 'primary',
    children: 'Primary',
    disabled: true,
  },
  {
    children: 'Custom Style',
    color: '#FFF',
    fontSize: 12,
    style: {
      borderRadius: 0,
      borderWidth: 2,
      borderColor: '#10F2DD',
      backgroundColor: '#3C507B',
    },
  },
  {
    children: 'link',
    bsStyle: 'link',
  },
];

/**
 * @author 田尘殇Sean(sean.snow@live.com)
 * @date 16/5/4
 */
class BootstrapButtonExamples extends AbstractComponent {
  constructor(props) {
    super(props, buttons);
  }

  renderRow(btn) {
    return <Button {...btn} style={[{ marginBottom: 10 }, btn.style]} />;
  }
}

export default BootstrapButtonExamples;
