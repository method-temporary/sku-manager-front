import { DataTaskCubeModel } from './DataTaskCubeModel';

class DataTaskCubeExcelModel {
  '소속사': string = '';
  '소속조직(팀)': string = '';
  '작성자': string = '';
  'Email': string = '';
  '제목': string = '';
  '내용': string = '';
  '조회수': string = '';
  '등록일': string = '';

  constructor(model?: DataTaskCubeModel) {
    if (model) {
      Object.assign(this, {
        '소속사': model.companyName,
        '소속조직(팀)': model.departmentName,
        '작성자': model.name,
        'Email': model.email,
        '제목': model.title,
        '내용': model.contents,
        '조회수': model.readCount,
        '등록일': model.registeredTime,
      });
    }
  }
}

export default DataTaskCubeExcelModel;
