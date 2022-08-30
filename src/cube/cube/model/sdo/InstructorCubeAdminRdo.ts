import { CubeType, SortFilterState } from 'shared/model';
import moment from 'moment';

export class InstructorCubeAdminRdo {
  instructorId: string = '';
  collegeId: string = '';
  channelId: string = '';
  cubeType: CubeType = CubeType.ALL;
  organizerId: string = '';
  enabled: boolean = true; // 사용 여부 검색 필터 사용 여부 확인 필요
  name: string = '';
  startDate: number = 0;
  endDate: number = 0;
  limit: number = 0;
  offset: number = 0;

  sortOrder: SortFilterState = SortFilterState.TimeDesc;

  static InstructorCubeAdminRdoByInstructorId(instructorId: string): InstructorCubeAdminRdo {
    return {
      name: '',
      instructorId,
      collegeId: '',
      channelId: '',
      cubeType: CubeType.ALL,
      organizerId: '',
      enabled: true,
      startDate: 0,
      endDate: moment().toDate().getTime(),
      limit: 9999,
      offset: 0,
      sortOrder: SortFilterState.TimeDesc,
    };
  }
}
