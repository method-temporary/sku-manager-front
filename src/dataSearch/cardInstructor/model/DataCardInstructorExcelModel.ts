import { DataCardInstructorModel } from './DataCardInstructorModel';

class DataMetaCardExcelModel {
  'CollegeID' : string = '';
  'College명' : string = '';
  'ChannelID(1depth)': string = '';
  'Channel명(1depth)': string = '';
  'ChannelID(2depth)': string = '';
  'Channel명(2depth)': string = '';
  'CardID' : string = '';
  'Card명' : string = '';
  '메인 카테고리 여부' : string = '';
  '카드 타입' : string = '';
  '공개여부' : string = '';
  '학습시간' : number = 0;
  '추가 학습 시간' : number = 0;
  '강사 이름' : string = '';
  '강사 이메일' : string = '';
  '대표강사 여부' : string = '';

  constructor(model?: DataCardInstructorModel) {
    if (model) {
      Object.assign(this, {
        'CollegeID' : model.collegeId,
        'College명' : model.collegeName,
        'ChannelID(1depth)' : model.channelId,
        'Channel명(1depth)' : model.channelName,
        'ChannelID(2depth)' : model.twoDepthChannelId,
        'Channel명(2depth)' : model.twoDepthChannelName,
        'CardID' : model.cardId,
        'Card명' : model.cardName,
        '메인 카테고리 여부' : model.mainCategory,
        '카드 타입' : model.cardType,
        '공개여부' : model.searchable,
        '학습시간' : model.learningTime,
        '추가 학습 시간' : model.additionalLearningTime,
        '강사 이름' : model.instructorName,
        '강사 이메일' : model.instructorEmail,
        '대표강사 여부' : model.representative,
      });
    }
  }
}

export default DataMetaCardExcelModel;
