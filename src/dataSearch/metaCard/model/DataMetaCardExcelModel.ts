import { DataMetaCardModel } from './DataMetaCardModel';
import _ from 'lodash';

class DataMetaCardExcelModel {
  'CollegeID': string = '';
  'College명': string = '';
  'ChannelID(1depth)': string = '';
  'Channel명(1depth)': string = '';
  'ChannelID(2depth)': string = '';
  'Channel명(2depth)': string = '';
  'CardID': string = '';
  'Card명': string = '';
  '메인 카테고리 여부': string = '';
  '카드 타입': string = '';
  '공개여부': string = '';
  '난이도': string = '';
  '학습시간': number = 0;
  '추가 학습 시간': number = 0;
  'Stamp 부여': string = '';
  '모든 회원 권한 부여 여부': string = '';
  'Card 표시 문구': string = '';
  'Card 소개(HTML 태그 O)': string = '';
  'Card 소개(HTML 태그 X)': string = '';
  'Tags': string = '';
  '교육 기간': string = '';
  'Test 여부': string = '';
  'Report 여부': string = '';
  'Report 명': string = '';
  'Report 작성 가이드': string = '';
  'Survey 여부': string = '';
  '생성일자': string = '';
  '학습자수': number = 0;
  '이수자수': number = 0;

  constructor(model?: DataMetaCardModel) {
    if (model) {
      Object.assign(this, {
        'CollegeID': model.collegeId,
        'College명': model.collegeName,
        'ChannelID(1depth)': model.channelId,
        'Channel명(1depth)': model.channelName,
        'ChannelID(2depth)': model.twoDepthChannelId,
        'Channel명(2depth)': model.twoDepthChannelName,
        'CardID': model.cardId,
        'Card명': model.cardName,
        '메인 카테고리 여부': model.mainCategory,
        '카드 타입': model.cardType,
        '공개여부': model.searchable,
        '난이도': model.difficultyLevel,
        '학습시간': model.learningTime,
        '추가 학습 시간': model.additionalLearningTime,
        'Stamp 부여': model.useStamp,
        '모든 회원 권한 부여 여부': model.useWhitelistPolicy,
        'Card 표시 문구': model.simpleDescription,
        'Card 소개(HTML 태그 O)': model.description,
        'Card 소개(HTML 태그 X)': model.description && _.unescape(model.description.replace(/(<([^>]+)>)/ig,"").replaceAll("&nbsp;", " ")),
        'Tags': model.tags,
        '교육 기간': model.learningDate,
        'Test 여부': model.useTests,
        'Report 여부': model.useReport,
        'Report 명': model.reportName,
        'Report 작성 가이드': model.reportQuestion,
        'Survey 여부': model.useSurvey,
        '생성일자': model.cardStateModifiedTime,
        '학습자수': model.studentCount,
        '이수자수': model.studentPassedCount,
      });
    }
  }
}

export default DataMetaCardExcelModel;
