import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import { Table } from 'semantic-ui-react';
import FieldProps from '../../model/FieldProps';
import FormTableContext from '../../context/FormTableContext';

@observer
@reactAutobind
class RowView extends ReactComponent<FieldProps> {
  //
  static defaultProps = {
    required: false,
  };

  static contextType = FormTableContext;

  context!: React.ContextType<typeof FormTableContext>;

  render() {
    //
    const { children, name, required, nameProps, valueProps, subText, colSpan } = this.props;
    const { colLength } = this.context;

    return (
      <Table.Row>
        <Table.Cell className="tb-header" {...nameProps}>
          {name}
          {required && <span className="required"> *</span>}
          {subText && <br />}
          {subText && <span style={{ color: 'red', fontSize: '12px', fontWeight: 300 }}>{subText}</span>}
        </Table.Cell>

        {colLength > 2 && Array.isArray(children) ? (
          children.map((child, index) => (
            <Table.Cell calSpan={colSpan || 1} key={index} {...valueProps}>
              {child}
            </Table.Cell>
          ))
        ) : (
          <Table.Cell {...valueProps}>{children}</Table.Cell>
        )}
      </Table.Row>
    );
  }
}

export default RowView;
