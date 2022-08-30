import * as React from 'react';
import { observer } from 'mobx-react';
import { Button, Checkbox, Form, Icon, Table } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { StudentProfileModel } from '../../../../card/student/model/vo/StudentProfileModel';
import { displayResultLearningState } from '../../../../card/student/ui/logic/CardStudentHepler';
import { ExtraWorkState } from '../../../../student/model/vo/ExtraWorkState';
import { StudentWithUserIdentity } from '../../../../student/model/StudentWithUserIdentity';

interface Props {
  checkAll: (isChecked: boolean) => void;
  checkOne: (index: number, student: StudentWithUserIdentity, value: boolean) => void;
  onChangeStudentsTargetProps: (index: number, name: string, value: any) => void;
  handleMarkExam: (studentDenizenId: string, lectureId: string, finished: boolean) => void;
  reportModalShow: (student: StudentWithUserIdentity, finised: boolean) => void;

  selectedList: StudentWithUserIdentity[];
  students: StudentWithUserIdentity[];
  studentAll: string;
  startNo: number;
  hasTest: boolean;
  fileBoxId: string;
  reportName: string;
  surveyId: string;
  studentsProfile: Map<string, StudentProfileModel>;
}

@observer
@reactAutobind
class CubeResultManagementListView extends ReactComponent<Props, {}> {
  //

  renderExam(student: StudentWithUserIdentity) {
    //
    const { hasTest } = this.props;
    const extraWorks = student.student.extraWork;
    // 시험이 없는 경우
    if (!hasTest) {
      return (
        <>
          <Table.Cell textAlign="center">-</Table.Cell>
          <Table.Cell textAlign="center">-</Table.Cell>
          <Table.Cell textAlign="center">-</Table.Cell>
        </>
      );
    }
    if (extraWorks && extraWorks.testStatus && extraWorks.testStatus !== ExtraWorkState.Save) {
      // 시험 제출 상태
      if (extraWorks.testStatus === ExtraWorkState.Submit) {
        return (
          <>
            <Table.Cell textAlign="center" />
            <Table.Cell textAlign="center">{student.student.studentScore.numberOfTrials}</Table.Cell>
            <Table.Cell textAlign="center">
              <Button
                onClick={() =>
                  this.props.handleMarkExam(student.student.patronKey.keyString, student.student.lectureId, false)
                }
              >
                채점하기
              </Button>
            </Table.Cell>
          </>
        );
      } else {
        return (
          <>
            <Table.Cell textAlign="center">{student.student.studentScore.latestScore}</Table.Cell>
            <Table.Cell textAlign="center">{student.student.studentScore.numberOfTrials}</Table.Cell>
            <Table.Cell textAlign="center">
              <Button
                onClick={() =>
                  this.props.handleMarkExam(student.student.patronKey.keyString, student.student.lectureId, true)
                }
              >
                결과보기
              </Button>
            </Table.Cell>
          </>
        );
      }
    }

    return (
      <>
        <Table.Cell textAlign="center" />
        <Table.Cell textAlign="center">0</Table.Cell>
        <Table.Cell textAlign="center">미응시</Table.Cell>
      </>
    );
  }

  renderReport(student: StudentWithUserIdentity) {
    //
    const { reportName, fileBoxId } = this.props;

    const extraWorks = student.student.extraWork;

    if ((reportName === '' || reportName === null) && fileBoxId === '') {
      //
      return (
        <>
          <Table.Cell textAlign="center">-</Table.Cell>
          <Table.Cell textAlign="center">-</Table.Cell>
        </>
      );
    }

    if (extraWorks && extraWorks.reportStatus) {
      // 과제 제출 상태
      if (extraWorks.reportStatus === ExtraWorkState.Submit) {
        return (
          <>
            <Table.Cell textAlign="center" />
            <Table.Cell textAlign="center">
              <Button onClick={() => this.props.reportModalShow(student, false)}>채점하기</Button>
            </Table.Cell>
          </>
        );
      } else {
        return (
          <>
            <Table.Cell textAlign="center">{student.student.studentScore.homeworkScore}</Table.Cell>
            <Table.Cell textAlign="center">
              <Button onClick={() => this.props.reportModalShow(student, true)}>결과보기</Button>
            </Table.Cell>
          </>
        );
      }
    }

    return (
      <>
        <Table.Cell textAlign="center" />
        <Table.Cell textAlign="center">미제출</Table.Cell>
      </>
    );
  }

  render() {
    //
    const { checkAll, checkOne } = this.props;
    const { selectedList, students, startNo, studentsProfile, surveyId } = this.props;

    const allSelected =
      students.filter((student) => selectedList.map((student) => student.student.id).includes(student.student.id))
        .length === students.length && selectedList.length !== 0;

    return (
      <Table celled>
        <colgroup>
          <col width="3%" />
          <col width="4%" />
          <col width="7%" />
          <col width="8%" />
          <col width="6%" />
          <col width="7%" />
          <col width="6%" />
          <col width="7%" />
          <col width="8%" />
          <col width="8%" />
          <col width="8%" />
          <col width="8%" />
          <col width="8%" />
          <col width="8%" />
          <col width="8%" />
        </colgroup>

        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">
              <Form.Field
                control={Checkbox}
                checked={allSelected}
                onChange={(e: any, data: any) => checkAll(!allSelected)}
              />
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">소속사</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">소속 조직(팀)</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">성명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">E-mail</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">시험성적</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">응시횟수</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">시험확인</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">과제점수</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">과제확인</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">이수상태</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">설문결과</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">상태 변경일</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">재직여부</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {(students &&
            students.length &&
            students.map((student, index) => {
              const profile = studentsProfile.get(student.student.patronKey.keyString);

              return (
                <Table.Row key={index}>
                  {/*체크박스*/}
                  <Table.Cell textAlign="center">
                    <Form.Field
                      control={Checkbox}
                      // value={student}
                      checked={selectedList.map((student) => student.student.id).includes(student.student.id)}
                      onChange={(e: any, data: any) => checkOne(index, student, data.checked)}
                    />
                  </Table.Cell>
                  {/*NO*/}
                  <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                  {/*소속사*/}
                  <Table.Cell textAlign="center">{getPolyglotToAnyString(student.userIdentity.companyName)}</Table.Cell>
                  {/*소속 조직(팀)*/}
                  <Table.Cell textAlign="center">
                    {getPolyglotToAnyString(student.userIdentity.departmentName)}
                  </Table.Cell>
                  {/*성명*/}
                  <Table.Cell textAlign="center">{student.student.name}</Table.Cell>
                  {/*E-mail*/}
                  <Table.Cell textAlign="center">{student.userIdentity.email}</Table.Cell>

                  {/* examId가 null이 아닐때 && fileBoxId가 null이 아닐때 && remortName이 null이 아닐때 */}
                  {/* examId가 null이 아닐때 && fileBoxId가 null일때 & reportName이 null일때 */}
                  {/* examId가 null일때 && fileBoxId가 null이 아닐때 & reportName이 null이 아닐때 */}
                  {/* examId가 null일때 && fileBoxId가 null일때 & reportName이 null일때 */}

                  {this.renderExam(student)}
                  {this.renderReport(student)}
                  <Table.Cell textAlign="center">
                    {displayResultLearningState(student.student.learningState)}
                  </Table.Cell>
                  {/*설문결과*/}
                  <Table.Cell textAlign="center">
                    {surveyId
                      ? student.student.extraWork.surveyStatus !== null &&
                        (student.student.extraWork.surveyStatus === ExtraWorkState.Submit ||
                          student.student.extraWork.surveyStatus === ExtraWorkState.Pass)
                        ? 'Y'
                        : 'N'
                      : '-'}
                  </Table.Cell>
                  {student.student.modifiedTime ? (
                    <Table.Cell textAlign="center">
                      {moment(student.student.modifiedTime).format('YYYY.MM.DD HH:mm:ss') || '-'}
                    </Table.Cell>
                  ) : (
                    <Table.Cell />
                  )}
                  <Table.Cell textAlign="center">
                    {student.userIdentity && student.userIdentity.id && student.userIdentity.id !== '' ? 'Y' : 'N'}
                  </Table.Cell>
                </Table.Row>
              );
            })) || (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={15}>
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

export default CubeResultManagementListView;
