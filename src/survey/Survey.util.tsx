import XLSX from 'xlsx';
import dayjs from 'dayjs';

import { PolyglotModel } from '../shared/model';
import { getPolyglotToAnyString } from '../shared/components/Polyglot';

import { MatrixQuestionItems } from './form/model/MatrixQuestionItems';
import { AnswerSheetService, SurveyFormService } from './index';

export async function onDownLoadSurveyExcel(surveyId: string, surveyCaseId: string, name: PolyglotModel) {
  //
  const { findSurveyForm, surveyForm } = SurveyFormService.instance;
  const { findEvaluationSheetsBySurveyCaseIdForExcel } = AnswerSheetService.instance;

  await findSurveyForm(surveyId);
  await findEvaluationSheetsBySurveyCaseIdForExcel(surveyCaseId);

  const { evaluationSheetsForExcel } = AnswerSheetService.instance;
  const { questions } = surveyForm;

  console.log(questions);
  console.log(evaluationSheetsForExcel);

  const wbList: any[] = [];

  evaluationSheetsForExcel &&
    evaluationSheetsForExcel.forEach((evaluationSheet) => {
      const { answers } = evaluationSheet;
      const answerMap: Map<string, string> = new Map();

      answers &&
        answers.forEach((answer) => {
          let answerData = '';
          if (answer.answerItem.answerItemType === 'Boolean') {
            answerData = answer.answerItem.itemNumbers[0] === '0' ? 'No' : 'Yes';
          } else if (answer.answerItem.answerItemType === 'Date') {
            answerData = answer.answerItem.sentence;
          } else if (answer.answerItem.answerItemType === 'Matrix') {
            answer.answerItem &&
              answer.answerItem.matrixItem &&
              answer.answerItem.matrixItem.forEach((matrixItem) => {
                answerMap.set(answer.questionNumber + '-' + matrixItem.rowNumber, matrixItem.columnSelectedNumber);
              });
          } else if (answer.answerItem.answerItemType === 'Review') {
            answerData =
              getChoiceFixedItemNumberText(answer.answerItem.itemNumbers[0]) + '-' + (answer.answerItem.sentence || '');
          } else if (answer.answerItem.answerItemType === 'ChoiceFixed') {
            answerData = getChoiceFixedItemNumberText(answer.answerItem.itemNumbers[0]);
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

      questions &&
        questions.forEach((question) => {
          const questionNumber = question.sequence.toSequenceString();

          if (question.questionItemType === 'Matrix') {
            const matrixQuestionItems = question.answerItems as MatrixQuestionItems;
            matrixQuestionItems.rowItems &&
              matrixQuestionItems.rowItems.forEach((m, i) => {
                matrixQuestionItems.columnItems &&
                  matrixQuestionItems.columnItems.forEach((f) => {
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

  const date = dayjs(new Date()).format('YYYY-MM-DD:HH:mm:ss');
  const fileName = `${getPolyglotToAnyString(name)}(${surveyForm.title}).${date}.xlsx`;
  XLSX.writeFile(wb, fileName, { compression: true });
  return fileName;
}

function getChoiceFixedItemNumberText(itemNumber: string) {
  switch (itemNumber) {
    case '1':
      return '전혀 아니다';
    case '2':
      return '아니다';
    case '3':
      return '보통이다';
    case '4':
      return '그렇다';
    case '5':
      return '매우 그렇다';
    default:
      return '';
  }
}
