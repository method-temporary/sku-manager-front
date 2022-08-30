import React from 'react';
import { observer } from 'mobx-react';
import { Table } from 'semantic-ui-react';
import LearningPlanOrderRow from './LearningPlanOrderRow';
import { CardInstructorListRow } from './CardInstructorListRow';
import { LearningTimeRow } from './LearningTimeRow';
import LearningContents from './LearningContents/LearningContents';

interface props {
  readonly?: boolean;
}

export const LearningPlan = observer(({ readonly }: props) => {
  return (
    <Table celled>
      <colgroup>
        <col width="13%" />
        <col width="37%" />
        <col width="13%" />
        <col width="37%" />
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell className="title-header" colSpan={4}>
            Chapter / Cube / Talk List 정보
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <LearningContents readonly={readonly} />
        <LearningPlanOrderRow readonly={readonly} />
        <CardInstructorListRow readonly={readonly} />
        <LearningTimeRow readonly={readonly} />
      </Table.Body>
    </Table>
  );
});
