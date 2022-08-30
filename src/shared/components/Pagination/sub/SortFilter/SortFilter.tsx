import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer, inject } from 'mobx-react';

import { DropdownProps, Select } from 'semantic-ui-react';
import { SharedService } from '../../../../present';
import PaginationContext from '../../context/PaginationContext';
import { SortFilterState } from '../../../../model/SortFilterState';

interface Props {
  options: { key: string; text: string; value: SortFilterState }[];
  defaultValue?: SortFilterState;
}

interface Injected {
  sharedService: SharedService;
}

@inject('sharedService')
@reactAutobind
@observer
class SortFilter extends ReactComponent<Props, {}, Injected> {
  //
  static defaultProps = {
    allViewable: false,
  };

  static contextType = PaginationContext;

  context!: React.ContextType<typeof PaginationContext>;

  componentDidMount() {
    if (this.props.defaultValue) {
      const { name } = this.context;
      const { sharedService } = this.injected;
      sharedService.setSortFilter(name, this.props.defaultValue);
    }
  }

  onChange(e: React.SyntheticEvent<HTMLElement>, data: DropdownProps) {
    //
    const { sharedService } = this.injected;
    const { name, onChange } = this.context;
    const value = data.value as SortFilterState;

    sharedService.setSortFilter(name, value);
    onChange(1);
  }

  render() {
    //
    const { options } = this.props;
    const { name } = this.context;
    const { sortFilter } = this.injected.sharedService.getPageModel(name);

    return (
      <Select className="small-border m0 sub-actions" value={sortFilter} options={options} onChange={this.onChange} />
    );
  }
}

export default SortFilter;
