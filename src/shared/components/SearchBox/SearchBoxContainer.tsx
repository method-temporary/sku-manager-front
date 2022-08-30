import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Button, Grid, Segment } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { SharedService } from '../../present';
import { SortFilterState } from '../../model';
import SearchBoxService from './logic/SearchBoxService';

interface Props {
  children: React.ReactNode;
  searchName?: string;
  onSearch: () => void;
  changeProps: (name: string, value: any) => void;
  queryModel: any;
  name: string;
  paginationKey?: string;
  sortFilter?: SortFilterState;
  modal?: boolean;
  disableInitSearch?: boolean;
}

interface Injected {
  searchBoxService: SearchBoxService;
  sharedService: SharedService;
}

@inject('searchBoxService', 'sharedService')
@observer
@reactAutobind
class SearchBoxContainer extends ReactComponent<Props, {}, Injected> {
  //
  constructor(props: Props) {
    //
    super(props);

    const { name, queryModel, modal, paginationKey, sortFilter } = this.props;
    const {
      searchBoxKey,
      clearSearchBoxQueryModel,
      setSearchBoxQueryModel,
      setSearchBoxSearchFn,
      changeSearchBoxKey,
      changeSearchBoxPrevKey,
    } = this.injected.searchBoxService;

    if (modal) {
      changeSearchBoxPrevKey(searchBoxKey);

      sortFilter
        ? this.injected.sharedService.init(paginationKey || name, 0, 10, sortFilter)
        : this.injected.sharedService.setPageMap(paginationKey || name, 0, 10);
    } else {
      // default SortFilter가 TimeDesc가 아닌경우
      sortFilter && this.injected.sharedService.setSortFilter(paginationKey || name, sortFilter);
    }

    changeSearchBoxKey(name);

    clearSearchBoxQueryModel();
    setSearchBoxQueryModel(name, queryModel);
    setSearchBoxSearchFn(this.onClickSearch);
  }

  componentDidMount() {
    //
    const { changeProps, disableInitSearch } = this.props;
    const { searchBoxQueryModel } = this.injected.searchBoxService;

    if (searchBoxQueryModel.period) {
      changeProps('period.startDateMoment', searchBoxQueryModel.period.startDateMoment);
      changeProps('period.endDateMoment', searchBoxQueryModel.period.endDateMoment);
    }
    if (!disableInitSearch) {
      this.findList();
    }
  }

  componentWillUnmount() {
    //
    const {
      searchBoxPrevKey,
      changeSearchBoxKey,
      clearSearchBoxPrevKey,
      setSearchBoxQueryModel,
      getSearchBoxQueryModelInMap,
    } = this.injected.searchBoxService;

    if (this.props.modal) {
      changeSearchBoxKey(searchBoxPrevKey);
      setSearchBoxQueryModel(searchBoxPrevKey, getSearchBoxQueryModelInMap(searchBoxPrevKey));
      clearSearchBoxPrevKey();
    }
  }

  onClickSearch() {
    //
    const { name, paginationKey } = this.props;

    if (paginationKey) {
      this.injected.sharedService.setPage(paginationKey, 1);
    } else {
      this.injected.sharedService.setPage(name, 1);
    }

    this.findList();
  }

  findList() {
    //
    const { changeProps, name } = this.props;
    const { searchBoxQueryModel, setSearchBoxQuery } = this.injected.searchBoxService;
    setSearchBoxQuery(name);

    const keys = Object.keys(searchBoxQueryModel);

    keys?.forEach((key) => {
      changeProps(key, searchBoxQueryModel[key]);
    });
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
