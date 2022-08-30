import * as React from 'react';
import { observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { QueryModel, SelectType, SelectTypeModel } from 'shared/model';
import { SearchBox } from 'shared/components';

import { addSelectTypeBoxAllOption } from 'shared/helper';

interface Props {
  onSearch: () => {};
  onChangeProps: (name: string, value: any) => void;
  queryModel: QueryModel;
  selectOptions: SelectTypeModel[];
  searchKey: string;

  searchBoxQueryModel: QueryModel;
}

@observer
@reactAutobind
class QuestOperatorSearchBox extends ReactComponent<Props, {}> {
  //
  render() {
    //
    const { onSearch, onChangeProps } = this.props;
    const { queryModel, selectOptions, searchKey, searchBoxQueryModel } = this.props;
    const searchWordDisabledKey = 'searchPart';

    return (
      <SearchBox onSearch={onSearch} changeProps={onChangeProps} queryModel={queryModel} name={searchKey}>
        <SearchBox.Group name="담당조직">
          <SearchBox.Select fieldName="operatorGroupId" options={selectOptions} placeholder="전체" />
        </SearchBox.Group>
        <SearchBox.Query
          name="검색어"
          placeholders={['전체', '검색어를 입력하세요.']}
          options={addSelectTypeBoxAllOption(SelectType.searchWards)}
          searchWordDisabledKey="searchPart"
          searchWordDisabledValues={['', '전체']}
        />
      </SearchBox>
    );
  }
}

export default QuestOperatorSearchBox;
