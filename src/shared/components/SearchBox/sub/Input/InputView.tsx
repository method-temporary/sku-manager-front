import React from 'react';
import { inject, observer } from 'mobx-react';
import { ReactComponent, reactAutobind } from '@nara.platform/accent';
import { Form, Input, SemanticWIDTHS } from 'semantic-ui-react';
import SearchBoxService from '../../logic/SearchBoxService';
import _ from 'lodash';

interface Props {
  fieldName: string;
  name?: string;
  width?: SemanticWIDTHS;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  readOnly?: boolean;
}

interface Injected {
  searchBoxService: SearchBoxService;
}

@inject('searchBoxService')
@observer
@reactAutobind
class InputView extends ReactComponent<Props, {}, Injected> {
  //
  static defaultProps = {
    placeholder: '',
    width: 16,
  };

  onChange(name: string, value: any) {
    //
    this.injected.searchBoxService.changePropsFn(name, value);
  }

  render() {
    //
    const { placeholder, fieldName, width, disabled, className, readOnly } = this.props;
    const { searchBoxQueryModel, searchBoxSearchFn } = this.injected.searchBoxService;

    return (
      <Form.Field
        className={className || ''}
        control={Input}
        disabled={disabled}
        readOnly={readOnly}
        width={width}
        value={(searchBoxQueryModel && _.get(searchBoxQueryModel, fieldName)) || ''}
        placeholder={placeholder}
        onChange={(event: any, data: any) => this.onChange(fieldName, data.value)}
        onKeyUp={(e: any) => e.keyCode === 13 && searchBoxSearchFn()}
      />
    );
  }
}

export default InputView;
