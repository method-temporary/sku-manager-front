import { ReactNode } from 'react';

export class CubeCountModel {
  totalCount: number = 0;
  totalLectureTime: number = 0;

  constructor(cubeCount?: CubeCountModel) {
    //
    if (cubeCount) {
      Object.assign(this, { ...cubeCount });
    }
  }

  static getHourFormat(totalLectureTime: number): string {
    //
    const hour = Math.floor(totalLectureTime / 60) || 0;
    const minute = Math.floor(totalLectureTime % 60) || 0;

    // if (hour < 1 && minute < 1) {
    //   return '0분';
    // } else if (hour < 1) {
    //   return `${minute}분`;
    // } else if (minute < 1) {
    //   return `${hour}시간`;
    // } else {
    //   return `${hour}시간 ${minute}분`;
    // }
    return `${hour}`;
  }

  static getMinuteFormat(totalLectureTime: number): string {
    //
    const hour = Math.floor(totalLectureTime / 60) || 0;
    const minute = Math.floor(totalLectureTime % 60) || 0;

    // if (hour < 1 && minute < 1) {
    //   return '0분';
    // } else if (hour < 1) {
    //   return `${minute}분`;
    // } else if (minute < 1) {
    //   return `${hour}시간`;
    // } else {
    //   return `${hour}시간 ${minute}분`;
    // }
    return `${minute}`;
  }
}
