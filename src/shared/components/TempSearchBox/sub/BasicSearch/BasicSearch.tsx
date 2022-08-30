import React from 'react';
import { inject, observer } from 'mobx-react';
import { ReactComponent, reactAutobind } from '@nara.platform/accent';

import SelectTypeModel from '../../../../model/SelectTypeModel';
import TempSearchBoxService from '../../logic/TempSearchBoxService';
import { TempSearchBox } from 'shared/components';

interface Props {
  options: SelectTypeModel[];
  values: [string | number, string];
  name?: string;
  fieldNames?: [string, string];
  placeholders?: [string, string];
  disabledKey?: string | number;
  onChange?: (event?: any, data?: any) => void;
  onSelectChange?: (event?: any, data?: any) => void;
}

interface Injected {
  tempSearchBoxService: TempSearchBoxService;
}

@inject('tempSearchBoxService')
@observer
@reactAutobind
class BasicSearch extends ReactComponent<Props, {}, Injected> {
  //
  static defaultProps = {
    name: '검색어',
    fieldNames: ['searchPart', 'searchWord'],
    placeholders: ['전체', '검색어를 입력해주세요'],
  };

  onChangeSelect(event: any, data: any) {
    //
    const { fieldNames, values, disabledKey, onSelectChange } = this.propsWithDefault;
    const [selectFieldName, inputFieldName] = fieldNames;
    const [selectValue] = values;
    const { changePropsFn, setIsSearch } = this.injected.tempSearchBoxService;

    if (selectValue === disabledKey) {
      changePropsFn(inputFieldName, '');
    }

    setIsSearch(false);
    onSelectChange ? onSelectChange(event, data) : changePropsFn(selectFieldName, data.value);
  }

  onChange(event: any, data: any) {
    //
    const { fieldNames, onChange } = this.propsWithDefault;
    const inputFieldName = fieldNames[1];
    const { changePropsFn, setIsSearch } = this.injected.tempSearchBoxService;

    setIsSearch(false);
    onChange ? onChange(event, data) : changePropsFn(inputFieldName, data.value);
  }

  render() {
    //
    const { name, values, fieldNames, options, placeholders, disabledKey } = this.propsWithDefault;
    const [selectFieldName, inputFieldName] = fieldNames;
    const [selectValue, inputValue] = values;
    const [selectPlaceholder, inputPlaceholder] = placeholders;

    return (
      <TempSearchBox.Group name={name}>
        <TempSearchBox.Select
          fieldName={selectFieldName}
          options={options}
          value={selectValue}
          placeholder={selectPlaceholder}
          onChange={this.onChangeSelect}
        />
        <TempSearchBox.Input
          fieldName={inputFieldName}
          placeholder={inputPlaceholder}
          value={inputValue}
          disabled={selectValue === disabledKey}
          onChange={this.onChange}
        />
      </TempSearchBox.Group>
    );
  }
}

export default BasicSearch;
