import { DataLearningCubeModel } from './DataLearningCubeModel';

class DataLearningCubeExcelModel {
  CollegeID: string = '';
  College명: string = '';
  ChannelID: string = '';
  Channel명: string = '';
  CardID: string = '';
  Card명: string = '';
  CubeID: string = '';
  Cube명: string = '';
  회사명: string = '';
  부서명: string = '';
  회원명: string = '';
  email: string = '';
  학습유형: string = '';
  학습상태: string = '';
  설문상태: string = '';
  레포트상태: string = '';
  시험상태: string = '';
  '교육시간(분)':  number = 0;
  학습시작시간: string = '';
  학습수정시간: string = '';
  학습완료시간: string = '';

  constructor(model?: DataLearningCubeModel) {
    if (model) {
      Object.assign(this, {
        CollegeID: model.collegeId,
        College명: model.collegeName,
        ChannelID: model.channelId,
        Channel명: model.channelName,
        CardID: model.cardId,
        Card명: model.cardName,
        CubeID: model.cubeId,
        Cube명: model.cubeName,
        회사명: model.companyName,
        부서명: model.departmentName,
        회원명: model.studentName,
        email: model.email,
        학습유형: model.studentType,
        학습상태: model.learningState,
        설문상태: model.surveyStatus,
        레포트상태: model.reportStatus,
        시험상태: model.testStatus,
        '교육시간(분)': model.learningTime,
        학습시작시간: model.registeredTime,
        학습수정시간: model.modifiedTime,
        학습완료시간: model.passedTime,
      });
    }
  }
}

export default DataLearningCubeExcelModel;
