import React from 'react';
import { inject, observer } from 'mobx-react';
import { ReactComponent, reactAutobind } from '@nara.platform/accent';

import SelectTypeModel from '../../../../model/SelectTypeModel';
import SearchBoxService from '../../logic/SearchBoxService';
import { SearchBox } from 'shared/components';

interface Props {
  name?: string;
  fieldNames?: [string, string];
  placeholders?: [string, string];
  searchWordDisabledKey?: string;
  searchWordDisabledValues?: string[];
  options: SelectTypeModel[];
  onChange?: (event?: any, data?: any) => void;
}

interface Injected {
  searchBoxService: SearchBoxService;
}

@inject('searchBoxService')
@observer
@reactAutobind
class Query extends ReactComponent<Props, {}, Injected> {
  //
  static defaultProps = {
    name: '검색어',
    fieldNames: ['searchPart', 'searchWord'],
    placeholders: ['전체', '검색어를 입력해주세요'],
    searchWordDisabledKey: 'searchPart',
  };

  onChangeSelect(event: any, value: any) {
    //
    const { fieldNames, searchWordDisabledKey, searchWordDisabledValues } = this.propsWithDefault;
    const { searchBoxQueryModel } = this.injected.searchBoxService;
    const disabledValue = searchWordDisabledKey ? searchBoxQueryModel[searchWordDisabledKey] : '';

    this.injected.searchBoxService.changePropsFn(fieldNames[0], value);

    if (searchWordDisabledValues && searchWordDisabledValues.includes(disabledValue)) {
      this.injected.searchBoxService.changePropsFn(fieldNames[1], '');
    }
  }

  onChange(event: any, data: any) {
    //
    this.onChangeSelect(event, data.value);

    if (this.props.onChange) {
      this.props.onChange(event, data);
    }
  }

  render() {
    //

    const { name, fieldNames, options, searchWordDisabledKey, searchWordDisabledValues, placeholders } =
      this.propsWithDefault;

    const { searchBoxQueryModel } = this.injected.searchBoxService;
    const disabledValue = searchWordDisabledKey ? searchBoxQueryModel[searchWordDisabledKey] : '';

    // console.log(placeholders);

    return (
      <SearchBox.Group name={name}>
        <SearchBox.Select
          fieldName={fieldNames[0]}
          options={options}
          placeholder={placeholders && placeholders[0]}
          onChange={this.onChange}
        />
        <SearchBox.Input
          fieldName={fieldNames[1]}
          placeholder={placeholders[1]}
          disabled={searchWordDisabledValues && searchWordDisabledValues.includes(disabledValue)}
        />
      </SearchBox.Group>
    );
  }
}

export default Query;
