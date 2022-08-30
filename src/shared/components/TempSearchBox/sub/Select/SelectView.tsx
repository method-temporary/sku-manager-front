import React from 'react';
import { inject, observer } from 'mobx-react';
import { ReactComponent, reactAutobind } from '@nara.platform/accent';
import { Form, Select } from 'semantic-ui-react';
import SelectTypeModel from '../../../../model/SelectTypeModel';
import TempSearchBoxService from '../../logic/TempSearchBoxService';

interface Props {
  fieldName: string;
  value: string | number;
  name?: string;
  placeholder?: string;
  options: SelectTypeModel[];
  onChange?: (event?: any, data?: any) => void;
  disabled?: boolean;
  sub?: boolean;
  search?: boolean;
}

interface Injected {
  tempSearchBoxService: TempSearchBoxService;
}

@inject('tempSearchBoxService')
@observer
@reactAutobind
class SelectView extends ReactComponent<Props, {}, Injected> {
  //
  static defaultProps = {
    placeholder: '전체',
  };

  onChange(event: any, data: any) {
    //
    const { fieldName, onChange } = this.props;
    const { changePropsFn, setIsSearch } = this.injected.tempSearchBoxService;

    setIsSearch(false);
    onChange ? onChange(event, data) : changePropsFn(fieldName, data.value);
  }

  render() {
    //

    const { name, value, options, placeholder, disabled = false, sub, search } = this.propsWithDefault;

    return (
      <>
        {name && <label>{name}</label>}
        <Form.Field
          control={Select}
          value={value || (options[0] && options[0].value)}
          placeholder={placeholder}
          options={options}
          disabled={disabled}
          onChange={this.onChange}
          search={search}
        />
        {sub && <label>{name}</label>}
      </>
    );
  }
}

export default SelectView;
