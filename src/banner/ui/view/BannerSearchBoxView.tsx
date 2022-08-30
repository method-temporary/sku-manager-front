import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import moment, { Moment } from 'moment';
import { SearchBox } from 'shared/components';
import { UserGroupRuleModel } from 'shared/model';
import { QueryModel } from 'shared/model';

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
  paginationKey: string;
}

interface States {
  isSelectedCollege: boolean;
  isSelected: boolean;
}

@observer
@reactAutobind
class BannerSearchBoxView extends React.Component<Props, States> {
  //
  componentDidMount() {
    //
    const { onChangeQueryProps } = this.props;
    if (onChangeQueryProps) onChangeQueryProps('searchPart', 'All');
  }

  setPeriodProps(name: string, value: Moment) {
    //
    const { onChangeQueryProps } = this.props;
    if (name === 'period.startDateMoment') {
      onChangeQueryProps(name, value.startOf('day'));
    }
    if (name === 'period.endDateMoment') {
      onChangeQueryProps(name, value.endOf('day'));
    }
  }

  onSetSearchDate(day?: number) {
    //
    const { onChangeQueryProps } = this.props;
    const endDate = moment().endOf('day');
    let startDate = moment().startOf('day');
    if (day) startDate = startDate.subtract(day, 'd');

    onChangeQueryProps('period.endDateMoment', endDate);
    onChangeQueryProps('period.startDateMoment', startDate);
  }

  render() {
    const { onSearch, onChangeQueryProps, queryModel, paginationKey } = this.props;

    return (
      <SearchBox onSearch={onSearch} changeProps={onChangeQueryProps} queryModel={queryModel} name={paginationKey}>
        <SearchBox.Group name="생성 및 변경일">
          <SearchBox.DatePicker
            startFieldName="period.startDateMoment"
            endFieldName="period.endDateMoment"
            searchButtons
          />
        </SearchBox.Group>
        <SearchBox.Group name="Banner 명">
          <SearchBox.Input fieldName="searchWord" placeholder="검색어를 입력해주세요." />
        </SearchBox.Group>
      </SearchBox>
    );
  }
}

export default BannerSearchBoxView;
