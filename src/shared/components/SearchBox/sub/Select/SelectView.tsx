import React from 'react';
import { inject, observer } from 'mobx-react';
import { ReactComponent, reactAutobind } from '@nara.platform/accent';
import { Form, Select } from 'semantic-ui-react';
import SelectTypeModel from '../../../../model/SelectTypeModel';
import SearchBoxService from '../../logic/SearchBoxService';
import _ from 'lodash';

interface Props {
  fieldName: string;
  name?: string;
  placeholder?: string;
  options: SelectTypeModel[];
  onChange?: (event?: any, data?: any) => void;
  disabled?: boolean;
  sub?: boolean;
  search?: boolean;
}

interface Injected {
  searchBoxService: SearchBoxService;
}

@inject('searchBoxService')
@observer
@reactAutobind
class SelectView extends ReactComponent<Props, {}, Injected> {
  //
  onChangeSelect(event: any, value: any) {
    //
    this.injected.searchBoxService.changePropsFn(this.props.fieldName, value);
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

    const { name, fieldName, options, placeholder, disabled = false, sub, search } = this.props;
    const { searchBoxQueryModel } = this.injected.searchBoxService;

    return (
      <>
        {name && <label>{name}</label>}
        <Form.Field
          control={Select}
          value={(searchBoxQueryModel && _.get(searchBoxQueryModel, fieldName)) || (options[0] && options[0].value)}
          placeholder={placeholder}
          options={options}
          disabled={disabled}
          onChange={(event: any, data: any) => this.onChange(event, data)}
          search={search}
        />
        {sub && <label>{name}</label>}
      </>
    );
  }
}

export default SelectView;
