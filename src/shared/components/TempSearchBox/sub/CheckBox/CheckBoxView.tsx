import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Form, Checkbox, SemanticWIDTHS } from 'semantic-ui-react';
import TempSearchBoxService from '../../logic/TempSearchBoxService';

interface Props {
  fieldName: string;
  value: boolean;
  name?: string;
  width?: SemanticWIDTHS;
  disabled?: boolean;
  onChange?: (event?: any, data?: any) => void;
}

interface Injected {
  tempSearchBoxService: TempSearchBoxService;
}

@inject('tempSearchBoxService')
@observer
@reactAutobind
class CheckBoxView extends ReactComponent<Props, {}, Injected> {
  //
  static defaultProps = {
    width: 16,
  };

  onChange(event: any, data: any) {
    //
    const { onChange, fieldName } = this.props;
    const { changePropsFn, setIsSearch } = this.injected.tempSearchBoxService;

    setIsSearch(false);
    onChange ? onChange(event, data) : changePropsFn(fieldName, data.value);
  }

  render() {
    //
    const { value, width, disabled, name } = this.props;

    return (
      <>
        {name && <label>{name}</label>}
        <div style={{ height: '39px' }}>
          <Form.Field
            style={{ margin: '8px' }}
            control={Checkbox}
            disabled={disabled}
            width={width}
            checked={value}
            onChange={(event: any, data: any) => this.onChange(event, data)}
          />
        </div>
      </>
    );
  }
}

export default CheckBoxView;
