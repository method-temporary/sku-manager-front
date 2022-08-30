import * as React from 'react';
import { observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, SelectTypeModel } from 'shared/model';
import { SearchBox } from 'shared/components';

import { UserCubeQueryModel } from '../../model/UserCubeQueryModel';

interface Props {
  onSearch: () => void;
  changeProps: (name: string, value: any) => void;

  companyOptions: SelectTypeModel[];
  queryModel: UserCubeQueryModel;
  name: string;
}

interface States {}

interface Injected {}

@observer
@reactAutobind
class CreateApprovalManagementSearchBox extends ReactComponent<Props, States, Injected> {
  //

  render() {
    //
    const { onSearch, changeProps } = this.props;
    const { companyOptions, queryModel, name } = this.props;

    return (
      <SearchBox onSearch={onSearch} changeProps={changeProps} queryModel={queryModel} name={name}>
        <SearchBox.Group name="일자">
          <SearchBox.Select fieldName="conditionDateType" options={SelectType.conditionDateTypes} placeholder="전체" />
          <SearchBox.DatePicker
            startFieldName="period.startDateMoment"
            endFieldName="period.endDateMoment"
            searchButtons
          />
        </SearchBox.Group>
        <SearchBox.Group>
          <SearchBox.Select
            name="제공상태"
            fieldName="state"
            options={SelectType.statusForApprovalContentsEnum}
            placeholder="전체"
          />
          <SearchBox.Select name="소속사" fieldName="cineroomId" options={companyOptions} placeholder="전체" />
        </SearchBox.Group>
        <SearchBox.Query
          options={SelectType.searchPartForCreate}
          placeholders={['All', '검색어를 입력해주세요.']}
          searchWordDisabledKey="searchPart"
          searchWordDisabledValues={['', '전체']}
        />
      </SearchBox>
    );
  }
}

export default CreateApprovalManagementSearchBox;
