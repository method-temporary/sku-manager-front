import React from 'react';
import { Modal, Table } from 'semantic-ui-react';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { HtmlEditor } from 'shared/ui';

import { Homework } from 'student/viewModel/ReportViewModel';

import { HomeworkFileView } from './HomeworkFileView';

interface HomeworkViewProps {
  homework: Homework;
}

export function HomeworkView({ homework }: HomeworkViewProps) {
  return (
    <Modal.Content className="content_text" style={{ paddingBottom: 0 }}>
      <Table celled>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>
        <Table.Body>
          <Table.Row>
            <Table.Cell colSpan={2} className="tb-header">
              Report 작성
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">Report명</Table.Cell>
            <Table.Cell>{getPolyglotToAnyString(homework.reportName)}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">주제</Table.Cell>
            <Table.Cell>{getPolyglotToAnyString(homework.reportQuestion)}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">내용</Table.Cell>
            <Table.Cell>
              <HtmlEditor value={homework.homeworkContent || ''} readOnly />
            </Table.Cell>
          </Table.Row>
          <HomeworkFileView fileBoxId={homework.homeworkFileBoxId} readonly />
        </Table.Body>
      </Table>
    </Modal.Content>
  );
}
