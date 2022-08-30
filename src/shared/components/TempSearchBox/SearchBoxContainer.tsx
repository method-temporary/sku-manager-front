import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Button, Grid, Segment } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { SharedService } from '../../present';
import { SortFilterState } from '../../model';
import TempSearchBoxService from './logic/TempSearchBoxService';

interface Props {
  children: React.ReactNode;
  onSearch: () => void;
  changeProps: (name: string, value: any) => void;

  paginationKey?: string;
  searchName?: string;
  sortFilter?: SortFilterState;
  modal?: boolean;
  disableInitSearch?: boolean;
}

interface Injected {
  tempSearchBoxService: TempSearchBoxService;
  sharedService: SharedService;
}

@inject('tempSearchBoxService', 'sharedService')
@observer
@reactAutobind
class SearchBoxContainer extends ReactComponent<Props, {}, Injected> {
  //
  static defaultProps = {
    paginationKey: '',
  };

  constructor(props: Props) {
    //
    super(props);

    const { modal, paginationKey, sortFilter, changeProps } = this.propsWithDefault;
    const { setSearchBoxSearchFn, setChangePropsFn } = this.injected.tempSearchBoxService;

    if (modal) {
      sortFilter
        ? this.injected.sharedService.init(paginationKey, 0, 10, sortFilter)
        : this.injected.sharedService.setPageMap(paginationKey, 0, 10);
    } else {
      // default SortFilter가 TimeDesc가 아닌경우
      sortFilter && this.injected.sharedService.setSortFilter(paginationKey, sortFilter);
    }
    setSearchBoxSearchFn(this.onClickSearch);
    setChangePropsFn(changeProps);
  }

  componentDidMount() {
    //
    const { disableInitSearch } = this.props;

    if (!disableInitSearch) {
      this.findList();
    }
  }

  onClickSearch() {
    //
    const { changeProps, modal } = this.props;

    changeProps('offset', 0);
    changeProps('limit', modal ? 10 : 20);

    this.findList();
  }

  findList() {
    //

    this.injected.tempSearchBoxService.setIsSearch(true);
    this.props.onSearch();
  }

  render() {
    //
    const { children, searchName } = this.props;

    return (
      <Segment>
        <div className="ui form search-box">
          <Grid>
            <Grid.Row>{children}</Grid.Row>
          </Grid>
        </div>
        <Grid.Column width={16}>
          <div className="center">
            <Button primary type="button" onClick={this.onClickSearch}>
              {searchName || '검색'}
            </Button>
          </div>
        </Grid.Column>
      </Segment>
    );
  }
}

export default SearchBoxContainer;
