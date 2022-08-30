import * as React from 'react';
import { inject, observer } from 'mobx-react';
import ClassroomDetailView from '../view/ClassroomDetailView';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { ClassroomGroupService } from '../../../classroom';
import MediaDetailView from '../view/MediaDetailView';
import { MediaService } from '../../../media';
import { BoardService } from '../../../board/board';
import OfficeWebDetailView from '../view/OfficeWebDetailView';
import { OfficeWebService } from '../../../officeweb';
import { ExamService } from '../../../../exam';
import { SurveyFormService } from '../../../../survey';
import CubeService from '../../present/logic/CubeService';

interface Props {
  filesMap: Map<string, any>;
  cubeType: string;
  readonly?: boolean;
}

interface Injected {
  classroomGroupService: ClassroomGroupService;
  cubeService: CubeService;
  mediaService: MediaService;
  boardService: BoardService;
  officeWebService: OfficeWebService;
  examService: ExamService;
  surveyFormService: SurveyFormService;
}

@inject(
  'classroomGroupService',
  'cubeService',
  'mediaService',
  'boardService',
  'officeWebService',
  'examService',
  'surveyFormService'
)
@observer
@reactAutobind
class CubeTypeDetailContainer extends ReactComponent<Props, {}, Injected> {
  //
  changeClassroomCdoProps(index: number, name: string, value: string | boolean | number) {
    //
    const { classroomGroupService } = this.injected;
    // if (name === 'examinationCdo.successPoint') value = Number(value);
    classroomGroupService!.changeClassroomCdoProps(index, name, value);
  }

  goToVideo(url: string) {
    //
    window.open(url);
  }

  // onClickTest(paperId: string) {
  //   //
  //   const { examService } = this.injected;
  //   examService!.findExam(paperId).then((exam) => {
  //     exam.questions.forEach((question) => {
  //       if (question.questionType === 'SingleChoice' || question.questionType === 'MultiChoice') {
  //         examService!.addExamChoicePoint(question.allocatedPoint);
  //       }
  //       if (question.questionType === 'Essay' || question.questionType === 'ShortAnswer') {
  //         examService!.addExamAssayPoint(question.allocatedPoint);
  //       }
  //     });
  //   });
  // }

  async onClickSurveyForm(surveyFormId: string) {
    //
    const { surveyFormService } = this.injected;
    await surveyFormService!.findSurveyForm(surveyFormId);
  }

  render() {
    //
    const { filesMap, cubeType, readonly } = this.props;
    const { classroomGroupService, mediaService, officeWebService, cubeService } = this.injected;
    const { cubeClassrooms } = classroomGroupService;
    const { media } = mediaService;
    const { officeWeb } = officeWebService;
    const { cubeInstructors } = cubeService;

    const type = 'cubeApprove';
    return (
      <>
        {cubeType === 'ClassRoomLecture' || cubeType === 'ELearning' ? (
          <ClassroomDetailView
            type={type}
            filesMap={filesMap}
            // onClickTest={this.onClickTest}
            onClickSurveyForm={this.onClickSurveyForm}
            changeClassroomCdoProps={this.changeClassroomCdoProps}
            classrooms={cubeClassrooms}
            cubeInstructors={cubeInstructors}
            readonly={readonly}
          />
        ) : null}
        {cubeType === 'Video' || cubeType === 'Audio' ? (
          <MediaDetailView media={media} goToVideo={this.goToVideo} />
        ) : null}
        {/*{cubeType === 'Community' ? <BoardDetailView board={board} /> : ''}*/}
        {cubeType === 'Documents' || cubeType === 'Experiential' || cubeType === 'WebPage' || cubeType === 'Cohort' ? (
          <OfficeWebDetailView officeWeb={officeWeb} filesMap={filesMap} />
        ) : null}
      </>
    );
  }
}

export default CubeTypeDetailContainer;
