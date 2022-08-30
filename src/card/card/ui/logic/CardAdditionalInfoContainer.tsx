import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';

import { ExamListModal, ExamModel, ExamService } from '../../../../exam';
import { SurveyFormModel, SurveyFormService } from '../../../../survey';

import CardAdditionalInfoView from '../view/CardAdditionalInfoView';
import { CardService } from '../../index';
import { setTestSheetModalViewModel } from 'exam/store/TestSheetModalStore';
import { getLectureTestListViewModel, setLectureTestListViewModel } from 'exam/store/LectureTestListStore';
import { getExamToLectureTestListViewModel, LectureTestListItem } from 'exam/viewmodel/LectureTestListViewModel';
import { TestModel } from '../../model/vo/TestModel';

interface Props {
  isUpdatable: boolean;
  cardService: CardService;
  examService: ExamService;
  surveyFormService: SurveyFormService;
}

interface State {
  listModalOpen: boolean;
}
@observer
@reactAutobind
class CardAdditionalInfoContainer extends React.Component<Props, State> {
  //
  state: State = {
    listModalOpen: false,
  };

  componentWillUnmount() {
    const { examService } = this.props;
    examService.clearExams();
  }

  onClickTestSelect() {
    this.setState({
      listModalOpen: true,
    });
  }

  onModalClose() {
    this.setState({
      listModalOpen: false,
    });
  }

  getFileBoxIdForReport(fileBoxId: string) {
    //
    const { changeCardContentsQueryProps } = this.props.cardService;
    changeCardContentsQueryProps('reportFileBox.fileBoxId', fileBoxId);
    changeCardContentsQueryProps('reportFileBox.isReport', true);
  }

  onClickSurveyModalOk(selectedSurveyForm: SurveyFormModel) {
    //
    const { changeCardContentsQueryProps } = this.props.cardService;

    changeCardContentsQueryProps('surveyId', selectedSurveyForm.id);
    changeCardContentsQueryProps('surveyTitle', selectedSurveyForm.title);
    changeCardContentsQueryProps('surveyDesignerName', selectedSurveyForm.formDesignerName);
  }

  async onClickSurveyForm(surveyFormId: string) {
    //
    const { surveyFormService } = this.props;
    await surveyFormService.findSurveyForm(surveyFormId);
  }

  onClickSurveyDeleteRow(event: any) {
    //
    const { changeCardContentsQueryProps } = this.props.cardService;

    event.stopPropagation();

    changeCardContentsQueryProps('surveyId', '');
    changeCardContentsQueryProps('surveyCaseId', '');
    changeCardContentsQueryProps('surveyTitle', '');
    changeCardContentsQueryProps('surveyDesignerName', '');

    this.props.surveyFormService.clearSurveyFormProps();
  }

  onClickExamModalOks(selectedExams: ExamModel[]) {
    //
    const { cardService, examService } = this.props;
    const { cardContentsQuery, changeCardContentsQueryProps } = cardService;

    const lectureTestListViewModel = getLectureTestListViewModel();
    if (lectureTestListViewModel === undefined) {
      return;
    }

    const newTestListItems: LectureTestListItem[] = selectedExams.map((e) => getExamToLectureTestListViewModel(e));

    setLectureTestListViewModel({
      testList: [...newTestListItems],
    });

    if (examService) {
      // 비교하여 추가삭제
      selectedExams.forEach((selectedExam) => {
        if (JSON.stringify(cardContentsQuery.tests).indexOf(selectedExam.id) < 0) {
          const oriCardTests = cardContentsQuery.tests ? cardContentsQuery.tests.slice() : [];
          // 부모에 추가
          const test = new TestModel();
          test.paperId = selectedExam.id;
          test.examTitle = selectedExam.title;
          test.examAuthorName = selectedExam.authorName;

          oriCardTests.push(test); // 부모에 추가

          changeCardContentsQueryProps('tests', oriCardTests);
        }
      });

      cardContentsQuery.tests.forEach((test, index) => {
        if (JSON.stringify(selectedExams).indexOf(test.paperId) < 0) {
          // 부모에서 삭제
          this.onClickTestDeleteRow(test.paperId);
          index--;
        }
      });

      examService.changeExamListModalOpen(false);
    }
    if (selectedExams.length > 0) {
      this.onClickExamModalOk(selectedExams[0]);
    }
  }

  onClickExamModalOk(selectedExam: ExamModel) {
    //
    const { changeCardContentsQueryProps } = this.props.cardService;
    // changeCardContentsQueryProps('examinationCdo.paperId', selectedExam.id);
    changeCardContentsQueryProps('paperId', selectedExam.id);
    changeCardContentsQueryProps('examTitle', selectedExam.title);
    changeCardContentsQueryProps('examAuthorName', selectedExam.authorName);
  }

  onClickTestDeleteRow(paperId: String) {
    const { cardContentsQuery, changeCardContentsQueryProps } = this.props.cardService;
    const { removeSelectedExam } = this.props.examService;
    const oriCardTests = cardContentsQuery.tests.slice();
    cardContentsQuery.tests &&
      cardContentsQuery.tests.forEach((result, index) => {
        if (result.paperId === paperId) {
          oriCardTests.splice(index, 1);
          changeCardContentsQueryProps('tests', oriCardTests);
        }
      });

    removeSelectedExam(paperId);
  }

  onClickTest(paperId: string) {
    //
    setTestSheetModalViewModel({
      isOpen: true,
      testId: paperId,
    });
  }

  render() {
    //
    const { isUpdatable, cardService } = this.props;
    const { listModalOpen } = this.state;
    const { cardContentsQuery, changeCardContentsQueryProps } = cardService;

    return (
      <>
        <CardAdditionalInfoView
          isUpdatable={isUpdatable}
          cardContentsQuery={cardContentsQuery}
          changeCardContentsQueryProps={changeCardContentsQueryProps}
          getFileBoxIdForReport={this.getFileBoxIdForReport}
          onClickTestSelect={this.onClickTestSelect}
          onClickSurveyModalOk={this.onClickSurveyModalOk}
          onClickSurveyForm={this.onClickSurveyForm}
          onClickSurveyDeleteRow={this.onClickSurveyDeleteRow}
        />
        {listModalOpen && (
          <ExamListModal
            isOpen={listModalOpen}
            onClose={this.onModalClose}
            handleOks={this.onClickExamModalOks}
            type="course"
            multiple
          />
        )}
      </>
    );
  }
}
export default CardAdditionalInfoContainer;
