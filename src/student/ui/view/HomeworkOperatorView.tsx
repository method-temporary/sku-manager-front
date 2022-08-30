import React from 'react';
import { Modal, Table } from 'semantic-ui-react';
import { HomeworkScoreView } from './HomeworkScoreView';
import { OperatorCommentView } from './OperatorCommentView';
import { HomeworkFileView } from './HomeworkFileView';
import { ExtraWorkState } from '../../model/vo/ExtraWorkState';
import { HomeworkStateView } from './HomeworkStateView';

interface HomeworkOperatorViewProps {
  homeworkOperatorComment: string;
  homeworkScore: number;
  homeworkState: ExtraWorkState;
  homeworkOperatorFileBoxId: string;
}

export function HomeworkOperatorView({
  homeworkOperatorComment,
  homeworkScore,
  homeworkState,
  homeworkOperatorFileBoxId,
}: HomeworkOperatorViewProps) {
  return (
    <Modal.Content className="content_text">
      <Table celled>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>
        <Table.Body>
          <Table.Row>
            <Table.Cell colSpan={2} className="tb-header">
              담당자 의견
            </Table.Cell>
          </Table.Row>
          <OperatorCommentView comment={homeworkOperatorComment} />
          <HomeworkScoreView score={homeworkScore} />
          <HomeworkStateView state={homeworkState} />
          <HomeworkFileView fileBoxId={homeworkOperatorFileBoxId} />
        </Table.Body>
      </Table>
    </Modal.Content>
  );
}
