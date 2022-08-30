import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import { TableProps, Table } from 'semantic-ui-react';

interface Props extends TableProps {}

@reactAutobind
@observer
class BasicTableContainer extends ReactComponent {
  //
  static defaultProps = {
    celled: true,
    selectable: false,
  };

  render() {
    //
    const { children, ...rest } = this.props;

    return <Table {...rest}>{children}</Table>;
  }
}

export default BasicTableContainer;
