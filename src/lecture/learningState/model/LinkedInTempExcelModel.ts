import { decorate, observable } from 'mobx';
import { LinkedInTempCdoModel } from './LinkedInTempCdoModel';
// import moment, { Moment } from 'moment';

export class LinkedInTempExcelModel {
  //
  Name: string = ''; //성명 = LearningCompleteProcModel.name
  Email: string = ''; //e-mail = LearningCompleteProcModel.email
  Cube: string = ''; //강의명(학습카드명) = LearningCompleteProcModel.cardName
  'Percent Completed': number = 0; //학습진행율(100 %만 학습완료 대상임)
  'Completed (PST/PDT)': string = ''; //학습완료시간 = LearningCompleteProcModel.completedTime

  constructor(linkedInTempExcel?: LinkedInTempExcelModel) {
    if (linkedInTempExcel) {
      Object.assign(this, { ...linkedInTempExcel });
    }
  }

  /**
   * 엑셀 데이터 칼럼에서 Model 칼럼 객체로 전화
   * @param linkedInTempExcel
   */
  static asCdo(linkedInTempExcel: LinkedInTempExcelModel): LinkedInTempCdoModel {
    //
    const learningCompleteTimeStr: string = linkedInTempExcel['Completed (PST/PDT)'];

    let learningCompleteDate: Date = new Date();

    if (learningCompleteTimeStr) {
      const matchTokenArray = learningCompleteTimeStr.match(
        '(\\d{1,})/(\\d{1,})/(\\d{2})\\s*,\\s+(\\d{1,}):(\\d{1,})\\s+(AM|PM)'
      );

      //1/28/20, 6:30 PM
      if (matchTokenArray && matchTokenArray.length > 0) {
        const yyStr: string = matchTokenArray![3] || '';
        const mmStr: string = matchTokenArray![1] || '';
        const ddStr: string = matchTokenArray![2] || '';
        const amPmStr: string = matchTokenArray![6] || '';
        const hoursStr: string = matchTokenArray![4] || '';
        const minutesStr: string = matchTokenArray![5] || '';

        const yy: number = Number(yyStr);
        const yyyy: number = 2000 + yy; //4자리로 보정
        let mm: number = Number(mmStr);
        const dd: number = Number(ddStr);
        let hours: number = Number(hoursStr);
        const minutes: number = Number(minutesStr);

        if (mm !== 0) {
          mm -= 1;
        }

        if (amPmStr === 'PM' && hours < 12) {
          hours += 12;
        } else if (amPmStr === 'AM' && hours === 12) {
          hours -= 12;
        }

        // console.log('24 hh convert - yyyy=' + yyyy + ', mm=' + mm + ', dd=' + dd + ', hours=' + hours + ', minutes=' + minutes);

        learningCompleteDate = new Date(yyyy, mm, dd, hours, minutes);
      }
    }

    return {
      name: linkedInTempExcel.Name,
      email: linkedInTempExcel.Email,
      cubeName: linkedInTempExcel.Cube,
      completedTime: learningCompleteDate.getTime() || 0,
      result: '',
    };
  }
}

decorate(LinkedInTempExcelModel, {
  Name: observable,
  Email: observable,
  Cube: observable,
  'Percent Completed': observable,
  'Completed (PST/PDT)': observable,
});
