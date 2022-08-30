import { PortletContentItem } from '../portletContentCreate/portletContentCreate.models';
import dayjs from 'dayjs';

export interface PortletCreateForm {
  title: string;
  cinerooms: string[];
  contentItems: PortletContentItem[];
  startDate: Date;
  endDate: Date;
}
export function initPortletCreateForm(): PortletCreateForm {
  return {
    title: '',
    cinerooms: [],
    contentItems: [
      {
        contentNo: 0,
        imageUrl: '',
        description: '',
        linkUrl: '',
      },
    ],
    startDate: dayjs().toDate(),
    endDate: dayjs().add(14, 'day').toDate(),
  };
}

export function getEmptyField(createForm: PortletCreateForm) {
  if (createForm.title === '') {
    return '제목';
  }
  if (createForm.cinerooms.length === 0) {
    return '멤버사 적용 범위';
  }
  const result = createForm.contentItems.some((item) => item.description === '' || item.linkUrl === '');
  if (result === true) {
    return '내용/링크';
  }
  return '';
}
