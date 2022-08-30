import React, { ReactNode } from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import { TableHeaderCellProps, Table } from 'semantic-ui-react';
import FormTableContext from './context/FormTableContext';

interface Props {
  children: ReactNode;
  title: ReactNode | ReactNode[];
  titleProps?: TableHeaderCellProps;
  colWidths?: string[];
  withoutHeader?: boolean;
}

@observer
@reactAutobind
class FormTableView extends ReactComponent<Props> {
  //
  static defaultProps = {
    colWidths: ['20%', '80%'],
  };

  getContext() {
    //
    const { colWidths } = this.propsWithDefault;

    return {
      colLength: colWidths.length,
    };
  }

  render() {
    //
    const { children, title, titleProps, withoutHeader } = this.props;
    const { colWidths } = this.propsWithDefault;

    return (
      <FormTableContext.Provider value={this.getContext()}>
        <Table celled>
          <colgroup>
            {colWidths.map((width, index) => (
              <col key={index} width={width} />
            ))}
          </colgroup>

          {withoutHeader ? null : (
            <Table.Header>
              <Table.Row>
                {Array.isArray(title) ? (
                  title.map((titleContent, index) => (
                    <Table.HeaderCell key={index} className="title-header" {...titleProps}>
                      {titleContent}
                    </Table.HeaderCell>
                  ))
                ) : (
                  <Table.HeaderCell className="title-header" colSpan={colWidths.length} {...titleProps}>
                    {title}
                  </Table.HeaderCell>
                )}
              </Table.Row>
            </Table.Header>
          )}

          <Table.Body>{children}</Table.Body>
        </Table>
      </FormTableContext.Provider>
    );
  }
}

export default FormTableView;
