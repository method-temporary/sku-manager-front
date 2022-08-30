import { DataMetaCubeModel } from './DataMetaCubeModel';
import _ from 'lodash';

class DataMetaCubeExcelModel {
  'CollegeID': string = '';
  'College명': string = '';
  'ChannelID(1depth)': string = '';
  'Channel명(1depth)': string = '';
  'ChannelID(2depth)': string = '';
  'Channel명(2depth)': string = '';
  'CubeID': string = '';
  'Cube명': string = '';
  '메인 카테고리 여부': string = '';
  'Cube타입': string = '';
  '난이도': string = '';
  '학습시간': number = 0;
  '교육기관': string = '';
  '교육목표': string = '';
  '교육대상': string = '';
  '이수조건': string = '';
  '교육내용(HTML 태그 O)': string = '';
  '교육내용(HTML 태그 X)': string = '';
  '기타안내(HTML 태그 O)': string = '';
  '기타안내(HTML 태그 X)': string = '';
  'Tags': string = '';
  'Test 여부': string = '';
  'Report 여부': string = '';
  'Report 명': string = '';
  'Report 작성 가이드': string = '';
  'Survey 여부': string = '';
  '생성일자': string = '';
  '판옵토 세션 ID': string = '';
  '영상명': string = '';
  '학습자수': number = 0;
  '이수자수': number = 0;

  constructor(model?: DataMetaCubeModel) {
    if (model) {
      Object.assign(this, {
        'CollegeID': model.collegeId,
        'College명': model.collegeName,
        'ChannelID(1depth)': model.channelId,
        'Channel명(1depth)': model.channelName,
        'ChannelID(2depth)': model.twoDepthChannelId,
        'Channel명(2depth)': model.twoDepthChannelName,
        'CubeID': model.cubeId,
        'Cube명': model.cubeName,
        '메인 카테고리 여부': model.mainCategory,
        'Cube타입': model.cubeType,
        '난이도': model.difficultyLevel,
        '학습시간': model.learningTime,
        '교육기관': model.institute,
        '교육목표': model.goal,
        '교육대상': model.applicants,
        '이수조건': model.completionTerms,
        '교육내용(HTML 태그 O)': model.description,
        '교육내용(HTML 태그 X)': model.description && _.unescape(model.description.replace(/(<([^>]+)>)/ig,"").replaceAll("&nbsp;", " ")),
        '기타안내(HTML 태그 O)': model.guide,
        '기타안내(HTML 태그 X)': model.guide && _.unescape(model.guide.replace(/(<([^>]+)>)/ig,"").replaceAll("&nbsp;", " ")),
        'Tags': model.tags,
        'Test 여부': model.useTests,
        'Report 여부': model.useReport,
        'Report 명': model.reportName,
        'Report 작성 가이드': model.reportQuestion,
        'Survey 여부': model.useSurvey,
        '생성일자': model.registeredTime,
        '판옵토 세션 ID': model.panoptoSessionId,
        '영상명': model.panoptoName,
        '학습자수': model.studentCount,
        '이수자수': model.studentPassedCount,
      });
    }
  }
}

export default DataMetaCubeExcelModel;
