export function timeToHourMinute(time: number) {
  //
  const hour = Math.floor(time / 60) || 0;
  const minute = time % 60 || 0;

  return { hour, minute };
}

export function timeToHourMinuteFormat(time: number) {
  //
  const hour = Math.floor(time / 60) || 0;
  const minute = Math.floor(time % 60) || 0;

  if (hour < 1 && minute < 1) {
    return '00h 00m';
  } else if (hour < 1) {
    return `${minute}m`;
  } else if (minute < 1) {
    return `${hour}h`;
  } else {
    return `${hour}h ${minute}m`;
  }
}

export function timeToMinuteSecondFormat(time: number) {
  //
  const minute = Math.floor(time / 60) || 0;
  const second = Math.floor(time % 60) || 0;

  if (minute < 1 && second < 1) {
    return '00m 00s';
  } else if (minute < 1) {
    return `${second}s`;
  } else if (second < 1) {
    return `${minute}m`;
  } else {
    return `${minute}m ${second}s`;
  }
}

export function timeToHourMinutePaddingFormat(time: number) {
  //
  const hour = Math.floor(time / 60) || 0;
  const minute = time % 60 || 0;

  if (hour < 1 && minute < 1) {
    return '0h 0m';
  } else if (hour < 1) {
    return `0h ${minute}m`;
  } else if (minute < 1) {
    return `${hour}h 0m`;
  } else {
    return `${hour}h ${minute}m`;
  }
}

export function getYearMonthDateHourMinuteSecond(date: Date) {
  if (!date) return null;
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
  };
}

export function dateToExcelFileNameFormat(date: Date) {
  let month = '' + (date.getMonth() + 1);
  let day = '' + date.getDate();
  const year = date.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('.');
}

export default {
  timeToHourMinute,
  timeToHourMinuteFormat,
  timeToMinuteSecondFormat,
  dateToExcelFileNameFormat,
};
