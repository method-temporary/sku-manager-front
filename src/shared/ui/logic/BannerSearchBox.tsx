import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { UserGroupRuleModel } from 'shared/model';
import QueryModel from '../../model/QueryModel';
import { SearchBox } from '../../components';

interface Props {
  onSearch: (page?: number) => void;
  onChangeQueryProps: (name: string, value: any) => void;
  onClearQueryProps: () => void;
  onSaveAccessRule?: (accessRules: UserGroupRuleModel[]) => void;
  clearGroupBasedRules?: () => void;
  queryModel: QueryModel;
  collegeAndChannel: boolean;
  defaultPeriod: number;
  searchBoxFlag?: string;
  ruleStrings?: string;
}

interface States {
  isSelectedCollege: boolean;
  isSelected: boolean;
}

@inject('bannerService')
@observer
@reactAutobind
class BannerSearchBox extends React.Component<Props, States> {
  //
  searchBoxKey = 'banner';

  componentDidMount() {
    //
    const { onChangeQueryProps } = this.props;
    if (onChangeQueryProps) onChangeQueryProps('searchPart', 'All');
  }

  render() {
    const { onSearch, onChangeQueryProps, queryModel } = this.props;

    return (
      <SearchBox
        onSearch={onSearch}
        changeProps={onChangeQueryProps}
        queryModel={queryModel}
        name={this.searchBoxKey}
        modal
      >
        <SearchBox.Group name="생성 및 변경일">
          <SearchBox.DatePicker
            startFieldName="period.startDateMoment"
            endFieldName="period.endDateMoment"
            searchButtons
          />
        </SearchBox.Group>
        <SearchBox.Group name="Banner명">
          <SearchBox.Input fieldName="searchWord" placeholder="검색어를 입력해주세요." />
        </SearchBox.Group>
      </SearchBox>
    );
  }
}

export default BannerSearchBox;
