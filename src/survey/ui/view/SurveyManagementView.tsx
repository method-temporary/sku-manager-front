import React from 'react';
import { observer } from 'mobx-react';
import { Icon, Table } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { AnswerSheetModal } from '../../index';
import { ExtraWorkState } from '../../../student/model/vo/ExtraWorkState';
import { StudentWithUserIdentity } from '../../../student/model/StudentWithUserIdentity';

interface Props {
  students: StudentWithUserIdentity[];
  startNo: number;
  surveyId: string;
  surveyCaseId: string;
}

@observer
@reactAutobind
class SurveyManagementView extends React.Component<Props> {
  //
  render() {
    //
    const { students, startNo, surveyId, surveyCaseId } = this.props;

    return (
      <Table celled>
        <colgroup>
          <col width="5%" />
          <col width="10%" />
          <col width="10%" />
          <col width="40%" />
          <col width="15%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>

        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell>소속사</Table.HeaderCell>
            <Table.HeaderCell>직속조직(팀)</Table.HeaderCell>
            <Table.HeaderCell>성명</Table.HeaderCell>
            <Table.HeaderCell>E-mail</Table.HeaderCell>
            <Table.HeaderCell>참여여부</Table.HeaderCell>
            <Table.HeaderCell>설문결과</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {students && students.length > 0 ? (
            students.map((studentWiths, index) => {
              const { student, userIdentity } = studentWiths;

              return (
                <Table.Row key={`survey_row_${index}`}>
                  <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                  <Table.Cell>{getPolyglotToAnyString(userIdentity.companyName)}</Table.Cell>
                  <Table.Cell>{getPolyglotToAnyString(userIdentity.departmentName)}</Table.Cell>
                  <Table.Cell>{student.name}</Table.Cell>
                  <Table.Cell>{userIdentity.email}</Table.Cell>
                  <Table.Cell>
                    {student.extraWork.surveyStatus !== null &&
                    student.extraWork.surveyStatus !== ExtraWorkState.Empty &&
                    student.extraWork.surveyStatus !== ExtraWorkState.Save
                      ? 'Y'
                      : 'N'}
                  </Table.Cell>
                  <Table.Cell>
                    <AnswerSheetModal
                      trigger={<a style={{ cursor: 'pointer' }}>보기</a>}
                      surveyCaseId={surveyCaseId}
                      surveyId={surveyId}
                      denizenKey={student.patronKey.keyString}
                    />
                  </Table.Cell>
                </Table.Row>
              );
            })
          ) : (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={7}>
                <div className="no-cont-wrap no-contents-icon">
                  <Icon className="no-contents80" />
                  <div className="sr-only">콘텐츠 없음</div>
                  <div className="text">검색 결과를 찾을 수 없습니다.</div>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    );
  }
}

export default SurveyManagementView;
