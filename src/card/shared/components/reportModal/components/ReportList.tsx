import React from 'react';
import { observer } from 'mobx-react';
import { Button, Icon, Table } from 'semantic-ui-react';

import { getPolyglotToString } from 'shared/components/Polyglot';

import { ReportFileBox } from '_data/lecture/cards/model/vo';
import ReportModal from '../ReportModal';

interface Props {
  //
  readonly?: boolean;
  reportFileBox: ReportFileBox;
  onDeleteReport?: () => void;
}

const ReportList = observer(({ readonly, reportFileBox, onDeleteReport }: Props) => {
  //
  return (
    <Table celled>
      <colgroup>
        {!readonly && <col width="20%" />}
        <col width="80%" />
      </colgroup>

      <Table.Header>
        <Table.Row>
          {!readonly && <Table.HeaderCell className="tb-header" />}
          <Table.HeaderCell className="tb-header">Report 명</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {!readonly ? (
          <Table.Row>
            <Table.Cell>
              <Button icon size="mini" basic onClick={() => onDeleteReport && onDeleteReport()}>
                <Icon name="minus" />
              </Button>
            </Table.Cell>
            <Table.Cell>{getPolyglotToString(reportFileBox.reportName)}</Table.Cell>
          </Table.Row>
        ) : (
          <Table.Row className="pointer">
            <ReportModal
              report={reportFileBox.report}
              reportFileBox={reportFileBox}
              readonly={readonly}
              trigger={<span>{getPolyglotToString(reportFileBox.reportName)}</span>}
              triggerAs="td"
            />
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
});

export default ReportList;
