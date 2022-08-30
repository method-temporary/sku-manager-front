import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { SelectType, UserGroupRuleModel } from 'shared/model';
import { TempSearchBox } from 'shared/components';
import { optionalBooleanToYesNo } from 'shared/helper/valueConvertHelper';
import { CardBundleRdo } from '_data/arrange/cardBundles/model';
import { addSelectTypeBoxAllOption } from '../../../shared/helper';

interface Props {
  paginationKey: string;
  cardBundleRdo: CardBundleRdo;
  changeCardBundleRdoProps: (name: string, value: any) => void;
  changeCardBundleRdoEnabled: (value: string) => void;
  onSearchCardBundleList: () => void;
  onSaveAccessRule?: (accessRules: UserGroupRuleModel[]) => void;
  clearGroupBasedRules?: () => void;
}

const usable = [
  { key: '0', text: '전체', value: '' },
  { key: '1', text: '사용', value: 'Yes' },
  { key: '2', text: '사용 중지', value: 'No' },
];

@observer
@reactAutobind
class CardBundleSearchView extends ReactComponent<Props> {
  //
  render() {
    //
    const {
      onSearchCardBundleList,
      changeCardBundleRdoProps,
      changeCardBundleRdoEnabled,
      cardBundleRdo,
      paginationKey,
    } = this.props;

    return (
      <TempSearchBox
        paginationKey={paginationKey}
        onSearch={onSearchCardBundleList}
        changeProps={changeCardBundleRdoProps}
      >
        <TempSearchBox.Group name="사용 여부">
          <TempSearchBox.Select
            value={optionalBooleanToYesNo(cardBundleRdo.enabled)}
            fieldName="enabled"
            placeholder="전체"
            options={usable}
            onChange={(_event, data) => changeCardBundleRdoEnabled(data.value)}
          />
          <TempSearchBox.Select
            name="유형"
            value={cardBundleRdo.types.length > 0 ? cardBundleRdo.types[0] : ''}
            fieldName="enabled"
            placeholder="전체"
            options={addSelectTypeBoxAllOption(SelectType.cardBundleTypeSelects)}
            onChange={(_event, data) => changeCardBundleRdoProps('types', [data.value])}
          />
        </TempSearchBox.Group>
        <TempSearchBox.Group name="묶음명">
          <TempSearchBox.Input
            value={cardBundleRdo.keyword}
            fieldName="name"
            placeholder="전체"
            onChange={(_event, data) => changeCardBundleRdoProps('keyword', data.value)}
          />
        </TempSearchBox.Group>
        <TempSearchBox.UserGroup fieldName="groupSequences" />
      </TempSearchBox>
    );
  }
}

export default CardBundleSearchView;
