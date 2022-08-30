import moment from 'moment';
// import Competency from '../ui/logic/Competency';
import Creator from './Creator';

export default interface Competency {
  competencyId: string;
  competencyGroup: string;
  competencyName: string;
  skill: string;
  synonym: string;
  creator: Creator;
  updater: Creator;
  createTime: number;
  updateTime: number;
}

export interface CompetencyName {
  title: string;
}
export function convertToNames(competencyNames: string[]): CompetencyName[] {
  return competencyNames.map((competencyName) => {
    return {
      title: competencyName,
    };
  });
}

export interface CompetencyViewModel extends Competency {
  checked?: boolean;
}

export interface CompetencyExcel {
  No: string;
  역량군: string;
  역량명: string;
  skill: string;
  유사어: string;
  등록일: string;
  생성자: string;
  수정일: string;
  수정자: string;
}

function timeToDateString(time: number) {
  return moment(time).format('YYYY.MM.DD');
}

export function convertToExcel(competencys: Competency[]): CompetencyExcel[] {
  let no = 1;
  return competencys.map(
    ({ competencyGroup, competencyName, skill, synonym, creator, updater, createTime, updateTime }) => {
      return {
        No: `${no++}`,
        역량군: competencyGroup,
        역량명: competencyName,
        skill,
        유사어: synonym,
        등록일: timeToDateString(createTime),
        생성자: creator.name,
        수정일: updateTime ? timeToDateString(updateTime) : '',
        수정자: updater && updater.name,
      };
    }
  );
}
