import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectTypeModel } from 'shared/model';
import { SearchBox } from 'shared/components';

import { DataBadgeQueryModel } from '../../model/DataBadgeQueryModel';
import { DataBadgeService } from '../../present/logic/DataBadgeService';

interface Props extends RouteComponentProps<Params> {
  findDataBadges: () => void;
  paginationKey: string;
  modal?: boolean;
  creatorCineroomId?: string;
  companyOptions: SelectTypeModel[];
  queryModel: DataBadgeQueryModel;
  dataService: DataBadgeService;
}

interface Params {
  cineroomId: string;
}

@inject()
@observer
@reactAutobind
class DataBadgeSearchBoxContainer extends ReactComponent<Props> {
  //
  constructor(props: Props) {
    super(props);
  }

  render() {
    //
    const { findDataBadges, paginationKey, modal, companyOptions, dataService, queryModel } = this.props;
    // @ts-ignore
    const changeProps = dataService.changeBadgeModalQueryProp;

    return (
      <SearchBox
        onSearch={findDataBadges}
        changeProps={changeProps}
        queryModel={queryModel}
        name={paginationKey}
        modal={modal}
      >
        <SearchBox.Group name="조회일자">
          <SearchBox.DatePicker startFieldName="period.startDateMoment" searchButtons />
        </SearchBox.Group>
        <SearchBox.Group>
          <SearchBox.Select name="소속사" fieldName="CompanyCode" options={companyOptions} placeholder="전체" />
        </SearchBox.Group>
      </SearchBox>
    );
  }
}

export default withRouter(DataBadgeSearchBoxContainer);
