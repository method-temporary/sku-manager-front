export default interface LectureRdo {
  searchFilter: string;
  creatorName?: string;
  startDate: number;
  endDate: number;
  limit: number;
  offset: number;

  college?: string;
  channel?: string;
  name?: string;
  cubeType?: string;
  organizerName?: string;
  instructorId?: string;
}
