import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Icon, Table } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { FormTable, Polyglot } from 'shared/components';

import CubeService from '../../present/logic/CubeService';
import SurveyListModal from '../../../../survey/ui/logic/SurveyListModal';
import { SurveyCaseService, SurveyFormService } from '../../../../survey';
import CubeSurveyInfoView from '../view/CubeSurveyInfoView';
import { ExamListModal, ExamModel, ExamService } from '../../../../exam';

import { SurveyFormModel } from 'survey/form/model/SurveyFormModel';
import { setTestSheetModalViewModel } from 'exam/store/TestSheetModalStore';
import { CubeTestListContainer } from 'exam/ui/logic/CubeTestListContainer';
import { getLectureTestListViewModel, setLectureTestListViewModel } from 'exam/store/LectureTestListStore';
import { LectureTestListItem } from 'exam/viewmodel/LectureTestListViewModel';
import { QuestionSelectionTypeText } from 'exam/model/QuestionSelectionType';
import ReportModal from '../../../../card/shared/components/reportModal/ReportModal';

import { ReportFileBox, Test } from '../../../../shared/model';
import ReportList from 'card/shared/components/reportModal/components/ReportList';

interface Props {
  onHandleSurveyModalOk: (selectedSurveyForm: SurveyFormModel, type: string, classroomIndex?: number) => void;
  cubeId?: string;
  readonly?: boolean;
}

interface State {
  listModalOpen: boolean;
}

interface Injected {
  cubeService: CubeService;
  surveyCaseService: SurveyCaseService;
  surveyFormService: SurveyFormService;
  examService: ExamService;
}

@inject('cubeService', 'surveyCaseService', 'surveyFormService', 'examService')
@observer
@reactAutobind
class CubeAdditionalInfoContainer extends ReactComponent<Props, State, Injected> {
  //

  state: State = {
    listModalOpen: false,
  };

  componentWillUnmount() {
    const { examService } = this.injected;
    examService.clearExams();
  }

  onChangeCubeProps(name: string, value: string) {
    //
    const { cubeService } = this.injected;
    if (name === 'cubeContents.reportFileBox.reportName') {
      const invalid = value.length > 200;

      if (invalid) {
        return;
      }
    }
    if (name === 'cubeContents.reportFileBox.reportQuestion') {
      const invalid = value.length > 3000;

      if (invalid) {
        return;
      }
    }
    cubeService.changeCubeProps(name, value);
  }

  getFileBoxIdForReport(fileBoxId: string) {
    //
    const { cubeService } = this.injected;
    // const { cubeIntro } = cubeService || {} as CubeIntroService;
    // todo 파일 삭제했을때 로직
    cubeService.changeCubeProps('cubeContents.reportFileBox.fileBoxId', fileBoxId);
    cubeService.changeCubeProps('cubeContents.reportFileBox.isReport', true);
  }

  removeReportFileBoxReport() {
    const { cubeService } = this.injected;
    // const { cubeIntro } = cubeService || {} as CubeIntroService;
    cubeService.changeCubeProps('cubeContents.reportFileBox', new ReportFileBox());
  }

  onClickTestSelect() {
    this.setState({
      listModalOpen: true,
    });
  }

  onListModalClose() {
    this.setState({
      listModalOpen: false,
    });
  }

  async onClickSurveyForm(surveyFormId: string) {
    //
    const { surveyFormService } = this.injected;
    await surveyFormService.findSurveyForm(surveyFormId);
  }

  onClickSurveyDeleteRow() {
    const { cubeService } = this.injected;
    cubeService.changeCubeProps('cubeContents.surveyId', '');
    cubeService.changeCubeProps('cubeContents.surveyTitle', '');
    cubeService.changeCubeProps('cubeContents.surveyDesignerName', '');
  }

  onHandleExamModalOks(selectedExams: ExamModel[], type: string) {
    //
    const { cubeService } = this.injected;
    const { tests } = cubeService.cube.cubeContents;
    const targetTests: Test[] = cubeService.cube.cubeContents.tests.slice();

    const lectureTestListViewModel = getLectureTestListViewModel();
    if (lectureTestListViewModel === undefined) {
      return;
    }

    const newTestListItems: LectureTestListItem[] = selectedExams.map((e) => {
      return {
        id: e.id,
        title: e.title,
        questionSelectionTypeText: QuestionSelectionTypeText[e.questionSelectionType],
        successPoint: e.successPoint,
        totalPoint: e.totalPoint,
      };
    });
    setLectureTestListViewModel({
      testList: [...newTestListItems],
    });

    // 비교하여 추가삭제
    selectedExams.forEach((selectedExam) => {
      if (JSON.stringify(tests).indexOf(selectedExam.id) < 0) {
        const test = new Test();
        test.paperId = selectedExam.id;
        test.examTitle = selectedExam.title;
        targetTests.push(test);
      }
    });

    cubeService.changeCubeProps('cubeContents.tests', targetTests);

    cubeService.cube.cubeContents.tests.forEach((test, index) => {
      if (JSON.stringify(selectedExams).indexOf(test.paperId) < 0) {
        //
        this.onClickTestDeleteRow(test.paperId);
        index--;
      }
    });
  }

  onClickTestDeleteRow(paperId: string) {
    const { cubeService, examService } = this.injected;
    const targetTests = [...cubeService.cube.cubeContents.tests];
    const index = targetTests.findIndex((test) => test.paperId === paperId);
    targetTests.splice(index, 1);
    cubeService.changeCubeProps('cubeContents.tests', targetTests);
    examService.removeSelectedExam(paperId);
  }

  onChangeTargetTestProp(index: number, name: string, value: number) {
    //
    const { cubeService } = this.injected;
    const targetTests = [...cubeService.cube.cubeContents.tests.map((target) => new Test(target))];
    const targetValue = value > 0 ? value : 0;
    // targetTests[index].successPoint = value;
    targetTests[index].setSuccessPoint(targetValue);
    cubeService.changeCubeProps('cubeContents.tests', targetTests);
  }

  onClickTest(paperId: string) {
    //
    setTestSheetModalViewModel({
      isOpen: true,
      testId: paperId,
    });
  }

  onReportOk(reportFileBox: ReportFileBox) {
    //
    const { cubeService } = this.injected;
    // setReportFileBox(reportFileBox);
    cubeService.changeCubeProps('cubeContents.reportFileBox', { ...reportFileBox, report: true });
  }

  render() {
    //
    const { cubeService } = this.injected;
    const { cube } = cubeService;
    const { listModalOpen } = this.state;
    const { onHandleSurveyModalOk, readonly, cubeId } = this.props;
    const hasReport = !!cube.cubeContents.reportFileBox.reportName.ko;

    return (
      <FormTable title="추가정보">
        {/* <FormTable.Row name="Report 출제">
          {!readonly && (
            <ReportModal
              onOk={this.onReportOk}
              reportFileBox={cube.cubeContents.reportFileBox}
              report={hasReport}
              readonly={readonly}
            />
          )}
          {hasReport && (
            <ReportList
              reportFileBox={cube.cubeContents.reportFileBox}
              onDeleteReport={this.removeReportFileBoxReport}
              readonly={readonly}
            />
          )}
        </FormTable.Row>
        <FormTable.Row name="Survey 추가">
          <SurveyListModal handleOk={onHandleSurveyModalOk} type="cube" readonly={readonly} />
          {cube.cubeContents.surveyId && cube.cubeContents.surveyId !== '' && (
            <CubeSurveyInfoView
              onClickSurveyForm={this.onClickSurveyForm}
              onClickSurveyDeleteRow={this.onClickSurveyDeleteRow}
              cube={cube}
              readonly={readonly}
            />
          )}
        </FormTable.Row> */}
        {!readonly ? (
          <FormTable.Row
            name="Test 추가"
            subText=" Test를 변경하거나 삭제할 경우 이수 처리 오류 및 학습자 혼선이 생길 수 있습니다. 사전 학습자 공지를 반드시 부탁드리며, 수정에 유의하시기 바랍니다."
          >
            <Button type="button" onClick={this.onClickTestSelect}>
              Test 선택
            </Button>
            {listModalOpen && (
              <ExamListModal
                isOpen={listModalOpen}
                onClose={this.onListModalClose}
                handleOks={this.onHandleExamModalOks}
                type="cube"
                multiple
              />
            )}
            {cube.cubeContents.tests && cube.cubeContents.tests.length > 0 && (
              <CubeTestListContainer readonly={readonly} />
            )}
          </FormTable.Row>
        ) : (
          <FormTable.Row name="Test 추가">
            {listModalOpen && (
              <ExamListModal
                isOpen={listModalOpen}
                onClose={this.onListModalClose}
                handleOks={this.onHandleExamModalOks}
                type="cube"
                multiple
              />
            )}
            {cube.cubeContents.tests && cube.cubeContents.tests.length > 0 && (
              <CubeTestListContainer readonly={readonly} />
            )}
          </FormTable.Row>
        )}
      </FormTable>
    );
  }
}

export default CubeAdditionalInfoContainer;
