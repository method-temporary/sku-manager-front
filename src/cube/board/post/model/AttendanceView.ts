import moment from 'moment';

export default class AttendanceView {
  //
  id: number = 0;
  companyName: string = '';
  departmentName: string = '';
  name: string = '';
  email: string = '';
  attendDate: string = '';
  time: number = 0;
  mobileApp: number = 0;

  constructor(attendceView: AttendanceView) {
    if (attendceView) {
      Object.assign(this, { ...attendceView });
    }
  }

  static attendXLSX(attend: AttendanceView, index: number) {
    return {
      No: String(index + 1),
      Company: attend.companyName || '-',
      'Department (Team)': attend.departmentName || '-',
      Name: attend.name || '-',
      Email: attend.email || '-',
      참여일: attend.attendDate || '-',
      출석시간: moment(attend.time).format('YYYY.MM.DD HH:mm:ss') || '-',
      모바일: attend.mobileApp ? 'O' : '',
    };
  }
}
