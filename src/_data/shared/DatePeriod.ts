import dayjs, { Dayjs } from 'dayjs';

export interface DatePeriod {
  //
  zoneId?: string;
  startDate: string;
  endDate: string;
}

function setDatePeriod(startDate: number, endDate: number) {
  //
  return {
    startDate: dayjs(startDate).format(DEFAULT_DATE_FORMAT),
    endDate: dayjs(endDate).format(DEFAULT_DATE_FORMAT),
  };
}

function setDatePeriodByDayjs(startDate: Dayjs, endDate: Dayjs) {
  return setDatePeriod(startDate.toDate().getTime(), endDate.toDate().getTime());
}

function initialize() {
  return {
    startDate: dayjs().format(DEFAULT_DATE_FORMAT),
    endDate: dayjs().add(1, 'month').format(DEFAULT_DATE_FORMAT),
  };
}

export const DatePeriodFunc = { setDatePeriod, initialize, setDatePeriodByDayjs };

export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
export const DATE_PICKER_FORMAT = 'yyyy.MM.dd';
