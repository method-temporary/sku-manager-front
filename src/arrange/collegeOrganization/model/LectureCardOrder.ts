import { getCategory } from './Category';
import CollegeOrganization from './CollegeOrganization';

export default interface LectureCardOrder {
  channelId: string;
  channelName: string;
  collegeId: string;
  collegeName: string;
  collegeOrder: number;
  cardName: string;
  errorDetail: string;
  orderResult: string;
  serviceId: string;
  serviceType: string;
}

export function convertToCollegeOrganization(lectureCardOrder: LectureCardOrder[]): CollegeOrganization[] {
  return lectureCardOrder.map(
    ({
      channelId,
      collegeId,
      channelName,
      collegeName,
      cardName,
      errorDetail,
      orderResult,
      serviceType,
      collegeOrder,
    }) => {
      return {
        college: collegeId,
        category: getCategory({ id: collegeId, name: collegeName }, { id: channelId, name: channelName }),
        name: cardName,
        serviceType,
        collegeOrder,
        errorDetail,
        orderResult,
      };
    }
  );
}
