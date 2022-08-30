import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import moment from 'moment';

import { reactAutobind } from '@nara.platform/accent';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { TrainingListViewModel } from '../../model/TrainingListViewModel';
import { LearningState } from '../../../student/model/vo/LearningState';
import { ExtraWorkState } from '../../../student/model/vo/ExtraWorkState';

interface Props {
  trainings: TrainingListViewModel[];
  startNo: number;
  routeToTrainingDetail: (id: string, index: number) => void;
}

@observer
@reactAutobind
class UserTrainingListView extends React.Component<Props> {
  //
  render() {
    //
    const { trainings, startNo, routeToTrainingDetail } = this.props;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="10%" />
          <col width="20%" />
          <col width="8%" />
          <col width="5%" />
          <col width="8%" />
          <col width="8%" />
          <col width="5%" />
          <col width="5%" />
          <col width="5%" />
          <col width="5%" />
          <col width="8%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Channel</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">과정명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">교육형태</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">학습시간</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">이수상태</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">이수일</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Test 결과</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Report 결과</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Survey</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Stamp</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">교육기관</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(trainings &&
            trainings.length &&
            trainings.map((training: TrainingListViewModel, index) => (
              <Table.Row key={index} onClick={() => routeToTrainingDetail(training.id || '', index)}>
                <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                <Table.Cell>{training.category}</Table.Cell>
                <Table.Cell>{getPolyglotToAnyString(training.lectureName)}</Table.Cell>
                <Table.Cell>{training.type}</Table.Cell>
                <Table.Cell textAlign="center">{training.learningTime}분</Table.Cell>
                <Table.Cell textAlign="center">
                  {(training.learningState === LearningState.Progress && '결과처리대기') ||
                    (training.learningState === LearningState.Passed && '이수') ||
                    (training.learningState === LearningState.Missed && '미이수') ||
                    (training.learningState === LearningState.NoShow && '불참') ||
                    ''}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {training.learningState === LearningState.Passed
                    ? moment(training.modifiedTime).format('YYYY.MM.DD hh:mm:ss')
                    : '-'}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {training.tested
                    ? training.extraWork.testStatus !== null &&
                      (training.extraWork.testStatus === ExtraWorkState.Pass ||
                        training.extraWork.testStatus === ExtraWorkState.Fail)
                      ? training.studentScore.latestScore
                      : (training.extraWork.testStatus === ExtraWorkState.Submit && '결과처리대기') ||
                        ((training.extraWork.testStatus === null ||
                          training.extraWork.testStatus === ExtraWorkState.Save) &&
                          '-')
                    : '-'}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {training.reportFileBox !== null &&
                  (training.reportFileBox.fileBoxId || training.reportFileBox.reportName)
                    ? training.extraWork.reportStatus === ExtraWorkState.Pass ||
                      training.extraWork.reportStatus === ExtraWorkState.Fail
                      ? training.studentScore.homeworkScore
                      : training.extraWork.reportStatus === ExtraWorkState.Submit
                      ? '결과처리대기'
                      : '미제출'
                    : '-'}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {training.surveyId
                    ? training.extraWork.surveyStatus === ExtraWorkState.Submit ||
                      training.extraWork.surveyStatus === ExtraWorkState.Pass
                      ? 'Y'
                      : 'N'
                    : '-'}
                </Table.Cell>
                <Table.Cell textAlign="center">{training.stamped ? 'Y' : 'N'}</Table.Cell>
                <Table.Cell>{getPolyglotToAnyString(training.organizerName)}</Table.Cell>
              </Table.Row>
            ))) || (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={12}>
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

export default UserTrainingListView;
