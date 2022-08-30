import { DataCubeInstructorModel } from './DataCubeInstructorModel';

class DataCubeInstructorExcelModel {
  'College ID' : string = '';
  'College명' : string = '';
  'ChannelID(1depth)': string = '';
  'Channel명(1depth)': string = '';
  'ChannelID(2depth)': string = '';
  'Channel명(2depth)': string = '';
  'Cube ID' : string = '';
  'Cube명' : string = '';
  '메인 카테고리 여부' : string = '';
  'Cube 타입' : string = '';
  '학습시간' : number = 0;
  '강사 이름' : string = '';
  '강사 이메일' : string = '';
  '대표강사 여부' : string = '';

  constructor(model?: DataCubeInstructorModel) {
    if (model) {
      Object.assign(this, {
        'College ID' : model.collegeId,
        'College명' : model.collegeName,
        'ChannelID(1depth)' : model.channelId,
        'Channel명(1depth)' : model.channelName,
        'ChannelID(2depth)' : model.twoDepthChannelId,
        'Channel명(2depth)' : model.twoDepthChannelName,
        'Cube ID' : model.cubeId,
        'Cube명' : model.cubeName,
        '메인 카테고리 여부' : model.mainCategory,
        'Cube 타입' : model.cubeType,
        '학습시간' : model.learningTime,
        '강사 이름' : model.instructorName,
        '강사 이메일' : model.instructorEmail,
        '대표강사 여부' : model.representative,
      });
    }
  }
}

export default DataCubeInstructorExcelModel;
