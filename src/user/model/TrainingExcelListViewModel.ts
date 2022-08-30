export class TrainingExcelListViewModel {
  No: string = '';
  Channel: string = '';
  '과정명(Ko)': string = '';
  '과정명(En)': string = '';
  '과정명(Zh)': string = '';
  교육형태: string = '';
  학습시간: string = '';
  이수일: string = '';
  'Test 결과': string | number = '';
  'Report 결과': string | number = '';
  Survey: string = '';
  Stamp: string = '';
  교육기관: string = '';

  constructor(trainingXlsx?: TrainingExcelListViewModel) {
    //
    if (trainingXlsx) {
      Object.assign(this, { ...trainingXlsx });
    }
  }
}
