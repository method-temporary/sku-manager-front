import React from 'react';
import { reactAutobind } from '@nara.platform/accent';
import { observer } from 'mobx-react';
import { Table } from 'semantic-ui-react';
import { SurveyFormModel } from '../../../form/model/SurveyFormModel';

interface Props {
  surveyForm: SurveyFormModel;
}

@observer
@reactAutobind
export default class SurveyFormDetailSummaryView extends React.Component<Props> {
  render() {
    const { surveyForm } = this.props;

    return (
      <Table celled>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={2} className="title-header">
              설문조사양식 기본정보
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell className="tb-header">제목</Table.Cell>
            <Table.Cell>{surveyForm.title}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">상태</Table.Cell>
            <Table.Cell>{surveyForm.designStateName}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}
