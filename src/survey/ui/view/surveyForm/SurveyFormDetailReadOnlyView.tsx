import React from 'react';
import { reactAutobind } from '@nara.platform/accent';
import { observer } from 'mobx-react';
import { Checkbox, Table } from 'semantic-ui-react';
import CriterionReadOnlyView from '../criterion/CriterionReadOnlyView';
import { SurveyFormModel } from '../../../form/model/SurveyFormModel';

interface Props {
  lang: string;
  surveyForm: SurveyFormModel;
}

@observer
@reactAutobind
export default class SurveyFormDetailReadOnlyView extends React.Component<Props> {
  render() {
    const { surveyForm, lang } = this.props;

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
            <Table.Cell>{surveyForm.titles.langStringMap.get(lang) || ''}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">상태</Table.Cell>
            <Table.Cell>{surveyForm.designStateName}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">척도</Table.Cell>
            <Table.Cell>
              <CriterionReadOnlyView criterionList={surveyForm.criterionList} />
            </Table.Cell>
          </Table.Row>
          {/*<Table.Row>
            <Table.Cell className="tb-header">공통설문</Table.Cell>
            <Table.Cell>
              <Checkbox label="" checked={surveyForm.useCommon} />
            </Table.Cell>
          </Table.Row>*/}
          <Table.Row>
            <Table.Cell className="tb-header">결과보기 공개 여부</Table.Cell>
            <Table.Cell>
              <Checkbox label="" checked={surveyForm.userViewResult} />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}
