import { decorate, observable } from 'mobx';
import { QueryModel, PageModel, CubeType, SortFilterState } from 'shared/model';
import LectureRdo from './LectureRdo';
import { InstructorCubeAdminRdo } from '../../../cube/cube/model/sdo/InstructorCubeAdminRdo';

export class LectureQueryModel extends QueryModel {
  searchFilter: string = '';
  popup: boolean = false;
  precedence: boolean | undefined = false;

  currentPage: number = 0;
  page: number = 0;
  pageIndex: number = 0;

  organizerName: string = '';
  name: string = '';

  // cubeType: string = '';
  // instructorId: string = '';

  //////////////////////////

  instructorId: string = '';
  collegeId: string = '';
  channelId: string = '';
  cubeType: CubeType = CubeType.ALL;
  organizerId: string = '';
  enabled: boolean = true; // 사용 여부 검색 필터 사용 여부 확인 필요

  sortOrder: SortFilterState = SortFilterState.TimeDesc;

  static asLectureRdo(lectureQuery: LectureQueryModel): LectureRdo {
    //
    let isOrganizerName = false;
    let isName = false;

    if (lectureQuery.searchPart === '교육기관') isOrganizerName = true;
    if (lectureQuery.searchPart === '과정명') {
      isName = true;
    }

    return {
      startDate: lectureQuery.period.startDateLong,
      endDate: lectureQuery.period.endDateLong,
      name: (isName && lectureQuery && encodeURIComponent(lectureQuery.searchWord)) || '',
      organizerName: (isOrganizerName && lectureQuery && encodeURIComponent(lectureQuery.searchWord)) || '',
      offset: lectureQuery.offset,
      limit: lectureQuery.limit,
      searchFilter: lectureQuery.searchFilter,
      college: lectureQuery.college,
      cubeType: lectureQuery.cubeType,
      channel: lectureQuery.channel,
      instructorId: lectureQuery.instructorId,
    };
  }

  static asCubeInstructorAdminRdo(
    instructorId: string,
    lectureQuery: LectureQueryModel,
    pageModel: PageModel
  ): InstructorCubeAdminRdo {
    //
    const name = lectureQuery.searchPart === '과정명' ? lectureQuery.searchWord : '';

    return {
      instructorId,
      collegeId: lectureQuery.collegeId,
      channelId: lectureQuery.channelId,
      cubeType: lectureQuery.cubeType,
      organizerId: lectureQuery.organizerId,
      enabled: lectureQuery.enabled,
      name,
      startDate: lectureQuery.period.startDateLong,
      endDate: lectureQuery.period.endDateLong,
      limit: pageModel.limit,
      offset: pageModel.offset,
      sortOrder: pageModel.sortFilter,
    };
  }
}

decorate(LectureQueryModel, {
  instructorId: observable,
  collegeId: observable,
  channelId: observable,
  cubeType: observable,
  organizerId: observable,
  enabled: observable,
  sortOrder: observable,
});
