import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Form, Checkbox, SemanticWIDTHS } from 'semantic-ui-react';
import SearchBoxService from '../../logic/SearchBoxService';
import _ from 'lodash';

interface Props {
  fieldName: string;
  name?: string;
  width?: SemanticWIDTHS;
  disabled?: boolean;
  onChange?: (event?: any, data?: any) => void;
}

interface Injected {
  searchBoxService: SearchBoxService;
}

@inject('searchBoxService')
@observer
@reactAutobind
class CheckBoxView extends ReactComponent<Props, {}, Injected> {
  //
  static defaultProps = {
    width: 16,
  };

  onChange(event: any, data: any) {
    //
    this.injected.searchBoxService.changePropsFn(this.props.fieldName, data.checked);

    if (this.props.onChange) {
      this.props.onChange(event, data);
    }
  }

  render() {
    //
    const { fieldName, width, disabled, name } = this.props;
    const { searchBoxQueryModel } = this.injected.searchBoxService;

    return (
      <>
        {name && <label>{name}</label>}
        <div style={{ height: '39px' }}>
          <Form.Field
            style={{ margin: '8px' }}
            control={Checkbox}
            disabled={disabled}
            width={width}
            checked={(searchBoxQueryModel && _.get(searchBoxQueryModel, fieldName)) || false}
            onChange={(event: any, data: any) => this.onChange(event, data)}
          />
        </div>
      </>
    );
  }
}

export default CheckBoxView;
