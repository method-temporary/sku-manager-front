import { SelectType, SelectTypeModel } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { CollegeService } from '../../college';

export function getCollegeOptions(cineroomId: string): SelectTypeModel[] {
  //
  const { collegesForCurrentCineroom, collegesSelect } = CollegeService.instance;
  const collegeOptions: SelectTypeModel[] = [new SelectTypeModel()];

  if (cineroomId === 'ne1-m2-c2' || cineroomId === 'ALL') {
    return collegeOptions.concat([...collegesSelect]);
  }

  collegesForCurrentCineroom &&
    collegesForCurrentCineroom.forEach((college) => {
      collegeOptions.push(new SelectTypeModel(college.id, getPolyglotToAnyString(college.name), college.id));
    });

  return collegeOptions;
}

export function getChannelOptions() {
  //
  const { mainCollege } = CollegeService.instance;
  const select: SelectTypeModel[] = [new SelectTypeModel()];

  mainCollege.channels.map((channel) =>
    select.push(new SelectTypeModel(channel.id, getPolyglotToAnyString(channel.name), channel.id))
  );

  return select;
}

export const getCardTypeOptions = () => {
  //
  const selectType = SelectType.learningTypeForSearch;
  const result: SelectTypeModel[] = [];

  selectType.forEach((select) => {
    result.push(new SelectTypeModel(select.key, select.text, select.value));
  });

  result.push(new SelectTypeModel('Course', 'Course', 'Course'));

  return result;
};
