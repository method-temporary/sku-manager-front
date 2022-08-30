import * as React from 'react';
import { observer } from 'mobx-react';
import { Table } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind } from '@nara.platform/accent';

import { FormTable } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { ServiceType } from '../../../student';
import { LearningState } from '../../../student/model/vo/LearningState';
import { TrainingListViewModel } from '../../model/TrainingListViewModel';
import { ExtraWorkState } from '../../../student/model/vo/ExtraWorkState';

interface Props {
  training: TrainingListViewModel;
  trainingsForCard: TrainingListViewModel[];
}

@observer
@reactAutobind
class TrainingDetailView extends React.Component<Props> {
  //
  render() {
    //
    const { training, trainingsForCard } = this.props;

    return (
      <FormTable title="기본 정보">
        <FormTable.Row name="Channel">{training.category}</FormTable.Row>
        <FormTable.Row name="과정명">{getPolyglotToAnyString(training.lectureName)}</FormTable.Row>
        <FormTable.Row name="교육형태">
          {training.type === ServiceType.Card ? (
            <Table celled>
              <colgroup>
                <col width="9%" />
              </colgroup>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Category &gt; Channel</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">과정명</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">교육형태</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">학습시간</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">이수상태</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Test결과</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Report결과</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Survey</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">이수일</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {trainingsForCard &&
                  trainingsForCard.map((result, index) => (
                    <Table.Row key={index}>
                      <Table.Cell textAlign="center">{index + 1}</Table.Cell>
                      <Table.Cell>{result.category}</Table.Cell>
                      <Table.Cell textAlign="center">{getPolyglotToAnyString(result.lectureName)}</Table.Cell>
                      <Table.Cell>{result.type}</Table.Cell>
                      <Table.Cell textAlign="center">{result.learningTime}분</Table.Cell>
                      <Table.Cell textAlign="center">
                        {(result.learningState === LearningState.Progress &&
                          // ||
                          // result.learningState === LearningState.Waiting) &&
                          // result.learningState === LearningState.Waiting ||
                          // result.learningState === LearningState.TestPassed ||
                          // result.learningState === LearningState.TestWaiting ||
                          // result.learningState === LearningState.HomeworkWaiting) &&
                          '결과처리대기') ||
                          (result.learningState === LearningState.Passed && '이수') ||
                          (result.learningState === LearningState.Missed && '미이수') ||
                          (result.learningState === LearningState.NoShow && '불참') ||
                          ''}
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        {result.tested
                          ? result.extraWork.testStatus !== null &&
                            (result.extraWork.testStatus === ExtraWorkState.Pass ||
                              result.extraWork.testStatus === ExtraWorkState.Fail)
                            ? result.studentScore.latestScore
                            : (result.extraWork.testStatus === ExtraWorkState.Submit && '결과처리대기') ||
                              ((result.extraWork.testStatus === null ||
                                result.extraWork.testStatus === ExtraWorkState.Save) &&
                                '-')
                          : '-'}
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        {result.reportFileBox !== null &&
                        (result.reportFileBox.fileBoxId || result.reportFileBox.reportName)
                          ? result.extraWork.reportStatus === ExtraWorkState.Pass ||
                            result.extraWork.reportStatus === ExtraWorkState.Fail
                            ? result.studentScore.homeworkScore
                            : result.extraWork.reportStatus === ExtraWorkState.Submit
                            ? '결과처리대기'
                            : '미제출'
                          : '-'}
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        {result.surveyId
                          ? result.extraWork.surveyStatus === ExtraWorkState.Submit ||
                            result.extraWork.surveyStatus === ExtraWorkState.Pass
                            ? 'Y'
                            : 'N'
                          : '-'}
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        {result.learningState === LearningState.Passed
                          ? moment(result.modifiedTime).format('YYYY.MM.DD hh:mm:ss')
                          : '-'}
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          ) : (
            training.type || ''
          )}
        </FormTable.Row>
        <FormTable.Row name="학습시간">{training.learningTime}분</FormTable.Row>
        <FormTable.Row name="이수상태">
          {/*{((training.learningState === LearningState.Progress || training.learningState === LearningState.Waiting) &&*/}
          {(training.learningState === LearningState.Progress &&
            // training.learningState === LearningState.Waiting ||
            // training.learningState === LearningState.TestPassed ||
            // training.learningState === LearningState.TestWaiting ||
            // training.learningState === LearningState.HomeworkWaiting) &&
            '결과처리대기') ||
            (training.learningState === LearningState.Passed && '이수') ||
            (training.learningState === LearningState.Missed && '미이수') ||
            (training.learningState === LearningState.NoShow && '불참') ||
            ''}
        </FormTable.Row>
        <FormTable.Row name="이수일">
          {training.learningState === LearningState.Passed
            ? moment(training.modifiedTime).format('YYYY.MM.DD hh:mm:ss')
            : '-'}
        </FormTable.Row>
        <FormTable.Row name="Test 결과">
          {training.tested
            ? training.extraWork.testStatus !== null &&
              (training.extraWork.testStatus === ExtraWorkState.Pass ||
                training.extraWork.testStatus === ExtraWorkState.Fail)
              ? training.studentScore.latestScore
              : (training.extraWork.testStatus === ExtraWorkState.Submit && '결과처리대기') ||
                ((training.extraWork.testStatus === null || training.extraWork.testStatus === ExtraWorkState.Save) &&
                  '-')
            : '-'}
        </FormTable.Row>
        <FormTable.Row name="Report 결과">
          {training.reportFileBox !== null && (training.reportFileBox.fileBoxId || training.reportFileBox.reportName)
            ? training.extraWork.reportStatus === ExtraWorkState.Pass ||
              training.extraWork.reportStatus === ExtraWorkState.Fail
              ? training.studentScore.homeworkScore
              : training.extraWork.reportStatus === ExtraWorkState.Submit
              ? '결과처리대기'
              : '미제출'
            : '-'}
        </FormTable.Row>
        <FormTable.Row name="Survey">
          {training.surveyId
            ? training.extraWork.surveyStatus === ExtraWorkState.Submit ||
              training.extraWork.surveyStatus === ExtraWorkState.Pass
              ? 'Y'
              : 'N'
            : '-'}
        </FormTable.Row>
        <FormTable.Row name="Stamp">{training.stamped ? 'Y' : 'N'}</FormTable.Row>
        <FormTable.Row name="Badge">{training.badgeNames}</FormTable.Row>
        <FormTable.Row name="교육기관">{getPolyglotToAnyString(training.organizerName)}</FormTable.Row>
      </FormTable>
    );
  }
}
//
export default TrainingDetailView;
