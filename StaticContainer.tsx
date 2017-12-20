import * as React from 'react';

interface Props {
  shouldUpdate: boolean
}

export class StaticContainer extends React.Component<Props> {

  static defaultProps: {
    shouldUpdate: boolean
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.shouldUpdate;
  }

  render() {
    const child = this.props.children;
    return (child === null || child === false) ? null : React.Children.only(child);
  }

}
