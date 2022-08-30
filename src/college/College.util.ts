import { CollegeModel } from '../_data/college/colleges/model/CollegeModel';
import { getPolyglotToAnyString } from '../shared/components/Polyglot';

/**
 * College 이름 가져오기
 * @param collegeId
 * @param colleges
 */
export const getCollegeName = (collegeId: string, colleges: CollegeModel[]) => {
  //
  const college = colleges.find((college) => college.id === collegeId);

  if (college) {
    //
    return getPolyglotToAnyString(college.name);
  }

  return '';
};
