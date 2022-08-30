import { DataCubeClassroomModel } from './DataCubeClassroomModel';

class DataCubeClassroomExcelModel {
  'CubeID': string = '';
  'Cube명': string = '';
  '교육형태': string = '';
  '신청기간': string = '';
  '교육기간': string = '';
  '취소기간': string = '';
  'Penalty': string = '';
  '정원': string = '';
  '무료여부': string = '';
  '교육 비용': string = '';
  '수강신청 여부': string = '';
  '승인프로세스 여부': string = '';
  '메일 발송 여부': string = '';
  '차수': string = '';

  constructor(model?: DataCubeClassroomModel) {
    if (model) {
      Object.assign(this, {
        'CubeID': model.cubeId,
        'Cube명': model.cubeName,
        '교육형태': model.type, 
        '신청기간': model.applyingDate,
        '교육기간': model.learningDate,
        '취소기간': model.cancellableDate,
        'Penalty': model.penalty,
        '정원': model.capacity,
        '무료여부': model.freeOfCharge,
        '교육 비용': model.chargeAmount,
        '수강신청 여부': model.enrollingAvailable,
        '승인프로세스 여부': model.approvalProcess,
        '메일 발송 여부': model.sendingMail,
        '차수': model.round,
      });
    }
  }
}

export default DataCubeClassroomExcelModel;
