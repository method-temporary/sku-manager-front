import * as React from 'react';
import { Button, Icon, Tab, Table } from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router';

import {
  SurveyFormSummary,
  SurveyFormService,
  SurveyCaseService,
  AnswerSheetService as SurveyAnswerSheetService,
} from 'survey';

import SurveyManagementContainer from '../logic/SurveyManagementContainer';
import CommentListContainer from '../../../../feedback/comment/ui/logic/CommentListContainer';
import XLSX from 'xlsx';
import moment from 'moment';
import { MatrixQuestionItems } from 'survey/form/model/MatrixQuestionItems';
import { SubActions } from 'shared/components';

interface CreateSurveyBasicInfoViewProps {
  surveyFormId: string;
  surveyCaseId: string;
}

const CreateSurveyBasicInfoView: React.FC<CreateSurveyBasicInfoViewProps> = function CreateSurveyBasicInfoView(props) {
  /*
  //피드백 변수
  */
  let paramsFeedBackId = '';
  const surveyCaseService = SurveyCaseService.instance;

  //20210203 커뮤니티  처리
  // 댓글 피브백 순번가져오기
  surveyCaseService.findSurveyCaseByFeedId(props.surveyCaseId).then((result) => {
    paramsFeedBackId = result;
  });

  async function onDownLoadSurveyExcel(surveyFormId: string, surveyCaseId: string) {
    //
    const surveyFormService = SurveyFormService.instance;
    const surveyAnswerSheetService = SurveyAnswerSheetService.instance;
    await surveyFormService!.findSurveyForm(surveyFormId);
    await surveyAnswerSheetService!.findEvaluationSheetsBySurveyCaseIdForExcel(surveyCaseId);

    const { surveyForm } = surveyFormService!;
    const { evaluationSheetsForExcel } = surveyAnswerSheetService!;
    const { questions } = surveyForm;

    const wbList: any[] = [];

    evaluationSheetsForExcel.map((evaluationSheet) => {
      const { answers } = evaluationSheet;
      const answerMap: Map<string, string> = new Map();
      answers.map((answer) => {
        let answerData = '';
        if (answer.answerItem.answerItemType === 'Boolean') {
          answerData = answer.answerItem.itemNumbers[0] === '0' ? 'No' : 'Yes';
        } else if (answer.answerItem.answerItemType === 'Date') {
          answerData = answer.answerItem.sentence;
        } else if (answer.answerItem.answerItemType === 'Matrix') {
          answer.answerItem.matrixItem.map((matrixItem) => {
            answerMap.set(answer.questionNumber + '-' + matrixItem.rowNumber, matrixItem.columnSelectedNumber);
          });
        } else {
          answerData = answer.answer;
        }

        if (answer.answerItem.answerItemType !== 'Matrix') {
          answerMap.set(answer.questionNumber, answerData);
        }
      });

      const wb: any = {
        이메일: evaluationSheet.email,
        사번: evaluationSheet.employeeId,
        참여자: evaluationSheet.name,
        회사코드: evaluationSheet.companyCode,
        회사명: evaluationSheet.company,
        부서코드: evaluationSheet.departmentCode,
        부서명: evaluationSheet.department,
      };
      questions.map((question) => {
        const questionNumber = question.sequence.toSequenceString();

        if (question.questionItemType === 'Matrix') {
          const matrixQuestionItems = question.answerItems as MatrixQuestionItems;
          matrixQuestionItems.rowItems.map((m, i) => {
            matrixQuestionItems.columnItems.map((f) => {
              if (f.number === answerMap.get(questionNumber + '-' + m.number)) {
                return (wb[m.value] = f.value || '');
              } else {
                return null;
              }
            });
          });
        } else {
          wb[question.sequence.number + '번 문항 ' + question.sentence] = answerMap.get(questionNumber) || '';
        }
      });
      wbList.push(wb);
    });

    const surveyExcel = XLSX.utils.json_to_sheet(wbList);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, surveyExcel, '설문조사');

    const date = moment(new Date()).format('YYYY-MM-DD:HH:mm:ss');
    const fileName = `(${surveyForm.title}).${date}.xlsx`;
    XLSX.writeFile(wb, fileName, { compression: true });
    return fileName;
  }

  const round = 1;

  if (!props.surveyFormId || !props.surveyCaseId) {
    return (
      <>
        <Tab.Pane>
          <div className="center">
            <div className="no-cont-wrap no-contents-icon">
              <Icon className="no-contents80" />
              <div className="sr-only">콘텐츠 없음</div>
              <div className="text">설문이 없습니다.</div>
            </div>
          </div>
        </Tab.Pane>
      </>
    );
  }
  return (
    <>
      <br />
      <div className="flat-btn">
        <SubActions.ExcelButton
          download
          onClick={async () => onDownLoadSurveyExcel(props.surveyFormId, props.surveyCaseId)}
        />
      </div>
      <Tab.Pane attached={false}>
        <Tab
          panes={[
            {
              menuItem: '통계',
              render: () => (
                <Tab.Pane>
                  <SurveyFormSummary
                    surveyFormId={props.surveyFormId}
                    surveyCaseId={props.surveyCaseId}
                    round={round}
                  />
                </Tab.Pane>
              ),
            },
            {
              menuItem: '상세',
              render: () => (
                <Tab.Pane>
                  <SurveyManagementContainer surveyFormId={props.surveyFormId} surveyCaseId={props.surveyCaseId} />
                </Tab.Pane>
              ),
            },
            {
              menuItem: '댓글',
              render: () => {
                if (paramsFeedBackId === null || paramsFeedBackId === undefined || paramsFeedBackId === '') {
                  return (
                    <>
                      <Tab.Pane>
                        <div className="center">
                          <div className="no-cont-wrap no-contents-icon">
                            <Icon className="no-contents80" />
                            <div className="sr-only">댓글 없음</div>
                            <div className="text">댓글탭을 다시 눌러주세요.</div>
                          </div>
                        </div>
                      </Tab.Pane>
                    </>
                  );
                }
                return (
                  <>
                    <Tab.Pane attached={false}>
                      <CommentListContainer feedbackId={paramsFeedBackId} />
                    </Tab.Pane>
                  </>
                );
              },
            },
          ]}
        />
      </Tab.Pane>
    </>
  );
};

export default CreateSurveyBasicInfoView;
