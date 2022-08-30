import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer, inject } from 'mobx-react';

import { SharedService } from '../../present';
import PaginationProps from './model/PaginationProps';
import PaginationContext from './context/PaginationContext';

interface Props {
  children: React.ReactNode;
  name: string;
  onChange: (data: PaginationProps) => void;
}

interface Injected {
  sharedService: SharedService;
}

@inject('sharedService')
@reactAutobind
@observer
class PaginationContainer extends ReactComponent<Props, {}, Injected> {
  //
  static defaultProps = {};

  getContext() {
    //
    const { name } = this.props;

    return { name, onChange: this.onChange };
  }

  onChange(activePage: number) {
    //
    const { name, onChange } = this.props;
    const { sharedService } = this.injected;

    sharedService.setPage(name, activePage);

    onChange({
      activePage,
      pageModel: sharedService.getPageModel(name),
    });
  }

  render() {
    //
    const { children } = this.props;

    return <PaginationContext.Provider value={this.getContext()}>{children}</PaginationContext.Provider>;
  }
}

export default PaginationContainer;
