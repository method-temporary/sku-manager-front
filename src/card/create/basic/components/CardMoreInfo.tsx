import React from 'react';
import { observer } from 'mobx-react';
import { Button, Icon, Table } from 'semantic-ui-react';

import { FormTable } from 'shared/components';

import { getInitReportFileBox, ReportFileBox } from '_data/lecture/cards/model/vo';

import SurveyModal from 'cube/cube/ui/logic/SurveyModal';
import { ExamPaperModel } from 'exam/model/ExamPaperModel';
import { SurveyFormModel, SurveyFormService, SurveyListModal } from 'survey';

import ReportModal from '../../../shared/components/reportModal/ReportModal';
import TestModal from '../../../shared/components/testModal/TestModal';
import ReportList from '../../../shared/components/reportModal/components/ReportList';

import CardCreateStore from '../../CardCreate.store';
import { convertExamPaper, getReportFileBox, resetSurvey, setReportFileBox, setSurvey } from '../../CardCreate.util';
import { TestWithViewInfo } from '../model/TestWithViewInfo';
import TestList from './TestLIst';

interface Props {
  readonly?: boolean;
}

const CardMoreInfo = observer(({ readonly }: Props) => {
  //
  const { report, reportName, surveyId, surveyTitle, surveyDesignerName, tests, setTests } = CardCreateStore.instance;

  const examPapers = tests.map((test) => convertExamPaper(test));

  const onReportOk = (reportFileBox: ReportFileBox) => {
    //
    setReportFileBox(reportFileBox);
  };

  const onSurveyOk = (selectedSurveyForm: SurveyFormModel) => {
    //
    setSurvey(selectedSurveyForm);
  };

  const onSurveyDelete = (event: any) => {
    //
    event.stopPropagation();
    resetSurvey();
    SurveyFormService.instance.clearSurveyFormProps();
  };

  const onClickSurvey = async () => {
    //
    await SurveyFormService.instance.findSurveyForm(surveyId);
  };

  const onClickExamOk = (selectedExams: ExamPaperModel[]) => {
    //
    setTests(
      selectedExams.map(
        (examPaper) =>
          ({
            paperId: examPaper.id,
            examTitle: examPaper.title,
            successPoint: examPaper.successPoint,
            totalPoint: examPaper.totalPoint,
            questionSelectionType: examPaper.questionSelectionType,
          } as TestWithViewInfo)
      )
    );
  };

  const onTestDelete = (paperId: String) => {
    //
    setTests(tests.filter((test) => test.paperId !== paperId).map((test) => test));
  };

  return (
    <>
      <FormTable title="추가 정보">
        <FormTable.Row name="Report 추가">
          <ReportModal unVisible={readonly} onOk={onReportOk} reportFileBox={getReportFileBox()} report={report} />
          {report && (
            <ReportList
              readonly={readonly}
              reportFileBox={getReportFileBox()}
              onDeleteReport={() => setReportFileBox(getInitReportFileBox())}
            />
          )}
        </FormTable.Row>
        <FormTable.Row name="Survey 추가">
          {!readonly && <SurveyListModal handleOk={onSurveyOk} type="card" />}
          {surveyId ? (
            <Table celled>
              <colgroup>
                {!readonly && <col width="5%" />}
                <col width="70%" />
                <col width="25%" />
              </colgroup>
              <Table.Header>
                <Table.Row>
                  {!readonly && <Table.HeaderCell textAlign="center" />}
                  <Table.HeaderCell textAlign="center">설문 제목</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">설문 작성자</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <SurveyModal
                  surveyId={surveyId}
                  trigger={
                    <Table.Row className="pointer" onClick={() => onClickSurvey()}>
                      {!readonly && (
                        <Table.Cell>
                          <Button icon size="mini" basic onClick={(event) => onSurveyDelete(event)}>
                            <Icon name="minus" />
                          </Button>
                        </Table.Cell>
                      )}
                      <Table.Cell>{surveyTitle}</Table.Cell>
                      <Table.Cell>{surveyDesignerName}</Table.Cell>
                    </Table.Row>
                  }
                />
              </Table.Body>
            </Table>
          ) : null}
        </FormTable.Row>
        <FormTable.Row
          name="Test 추가"
          subText=" Test를 변경하거나 삭제할 경우 이수 처리 오류 및 학습자 혼선이 생길 수 있습니다. 사전 학습자 공지를 반드시 부탁드리며, 수정에 유의하시기 바랍니다."
        >
          {!readonly && <TestModal onOk={onClickExamOk} examPapers={examPapers} />}
          {tests.length > 0 && <TestList readonly={readonly} tests={tests} onTestDelete={onTestDelete} />}
        </FormTable.Row>
      </FormTable>
    </>
  );
});

export default CardMoreInfo;
