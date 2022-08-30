import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { TempSearchBox } from 'shared/components';
import { SearchPeriodType } from '_data/arrange/bannnerBundles/model/vo';
import { BannerBundleRdo } from '../../../_data/arrange/bannnerBundles/model';

interface Props {
  onSearch: (page?: number) => void;
  bannerBundleRdo: BannerBundleRdo;
  changeBannerBundleRdoProps: (name: string, value: any) => void;
  paginationKey: string;
}

interface States {
  isSelectedCollege: boolean;
  isSelected: boolean;
}

const bannerBundleSearchPeriodType = [
  { key: '0', text: '사용기간', value: SearchPeriodType.Usage },
  { key: '1', text: '변경일자', value: SearchPeriodType.Modification },
];

@observer
@reactAutobind
class BannerBundleSearchBoxView extends React.Component<Props, States> {
  //
  render() {
    const { bannerBundleRdo, changeBannerBundleRdoProps, onSearch, paginationKey } = this.props;

    return (
      <TempSearchBox onSearch={onSearch} changeProps={changeBannerBundleRdoProps} paginationKey={paginationKey}>
        <TempSearchBox.Group name="날짜">
          <TempSearchBox.Select fieldName="type" value={bannerBundleRdo.type} options={bannerBundleSearchPeriodType} />
          <TempSearchBox.DatePicker
            startDate={bannerBundleRdo.startDate}
            startFieldName="startDate"
            endDate={bannerBundleRdo.endDate}
            endFieldName="endDate"
            searchButtons
            unLimitMaxDate
          />
        </TempSearchBox.Group>
        <TempSearchBox.Group name="BannerBundle명">
          <TempSearchBox.Input value={bannerBundleRdo.name} fieldName="name" placeholder="검색어를 입력해주세요." />
        </TempSearchBox.Group>
        <TempSearchBox.UserGroup fieldName="groupSequences" />
      </TempSearchBox>
    );
  }
}

export default BannerBundleSearchBoxView;
