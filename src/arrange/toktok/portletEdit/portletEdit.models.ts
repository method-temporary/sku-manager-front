import { PortletContentItem } from '../portletContentCreate/portletContentCreate.models';

export interface PortletEditForm {
  id: string;
  title: string;
  cinerooms: string[];
  contentItems: PortletContentItem[];
  startDate: Date;
  endDate: Date;
  editable: boolean;
}

export function initPortletEditForm(): PortletEditForm {
  return {
    id: '',
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
    startDate: new Date(),
    endDate: new Date(),
    editable: true,
  };
}

export function getEmptyField(editForm: PortletEditForm) {
  if (editForm.title === '') {
    return '제목';
  }
  if (editForm.cinerooms.length === 0) {
    return '멤버사 적용 범위';
  }
  const result = editForm.contentItems.some((item) => item.description === '' || item.linkUrl === '');
  if (result === true) {
    return '내용/링크';
  }

  return '';
}
