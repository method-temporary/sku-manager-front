import React from 'react';
import { inject, observer } from 'mobx-react';
import { ReactComponent, reactAutobind } from '@nara.platform/accent';
import { Form, Input, SemanticWIDTHS } from 'semantic-ui-react';
import TempSearchBoxService from '../../logic/TempSearchBoxService';

interface Props {
  fieldName: string;
  value: string;
  name?: string;
  width?: SemanticWIDTHS;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  readOnly?: boolean;
  onChange?: (event: any, data: any) => void;
}

interface Injected {
  tempSearchBoxService: TempSearchBoxService;
}

@inject('tempSearchBoxService')
@observer
@reactAutobind
class InputView extends ReactComponent<Props, {}, Injected> {
  //
  static defaultProps = {
    placeholder: '',
    width: 16,
  };

  onChange(name: string, data: any, event: any) {
    //

    const { onChange } = this.props;
    const { changePropsFn, setIsSearch } = this.injected.tempSearchBoxService;

    setIsSearch(false);
    onChange ? onChange(event, data) : changePropsFn(name, data.value);
  }

  render() {
    //
    const { placeholder, value, fieldName, width, disabled, className, readOnly } = this.props;
    const { searchBoxSearchFn } = this.injected.tempSearchBoxService;

    return (
      <Form.Field
        className={className || ''}
        control={Input}
        disabled={disabled}
        readOnly={readOnly}
        width={width}
        value={value || ''}
        placeholder={placeholder}
        onChange={(event: any, data: any) => this.onChange(fieldName, data, event)}
        onKeyUp={(e: any) => e.keyCode === 13 && searchBoxSearchFn()}
      />
    );
  }
}

export default InputView;
