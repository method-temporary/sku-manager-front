import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer, inject } from 'mobx-react';

import { DropdownProps, Select } from 'semantic-ui-react';
import { SharedService } from '../../../../present';
import PaginationContext from '../../context/PaginationContext';

interface Props {
  allViewable?: boolean;
}

interface Injected {
  sharedService: SharedService;
}

@inject('sharedService')
@reactAutobind
@observer
class LimitSelectContainer extends ReactComponent<Props, {}, Injected> {
  //
  static defaultProps = {
    allViewable: false,
  };

  static contextType = PaginationContext;

  context!: React.ContextType<typeof PaginationContext>;

  options = [
    { key: '1', text: '20개씩 보기', value: 20 },
    { key: '2', text: '50개씩 보기', value: 50 },
    { key: '3', text: '100개씩 보기', value: 100 },
    { key: '4', text: '전체 보기', value: 9999999 },
  ];

  onChange(e: React.SyntheticEvent<HTMLElement>, data: DropdownProps) {
    //
    const { sharedService } = this.injected;
    const { name, onChange } = this.context;
    const value = data.value as number;
    const sortFilter = sharedService.getPageModel(name).sortFilter;

    sharedService.setInitDate(name, 0, value, sortFilter);
    onChange(1);
  }

  render() {
    //
    const { allViewable } = this.props;
    const { name } = this.context;
    const { limit } = this.injected.sharedService.getPageModel(name);
    let options = this.options;

    if (!allViewable) {
      options = options.filter((option) => option.value < 999999);
    }
    return <Select className="small-border m0 sub-actions" value={limit} options={options} onChange={this.onChange} />;
  }
}

export default LimitSelectContainer;
