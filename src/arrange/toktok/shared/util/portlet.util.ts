import { ToktokPortletCdo, ToktokPortletRdo, ToktokPortletUdo } from '_data/arrange/toktok/model';
import { Content } from '_data/arrange/toktok/model/vo';

import { PortletCreateForm } from '../../portletCreate/portletCreate.models';
import { PortletSearchBox } from '../../portletManagement/portletSerchBox/portletSearchBox.models';
import { PortletEditForm } from '../../portletEdit/portletEdit.models';

export function getToktokPortletCdo(createForm: PortletCreateForm): ToktokPortletCdo {
  const contents: Content[] = createForm.contentItems.map((item) => ({
    imgPath: item.imageUrl,
    text: item.description,
    link: item.linkUrl,
  }));

  return {
    title: createForm.title,
    cinerooms: createForm.cinerooms,
    contents,
    startTime: createForm.startDate.setHours(0, 0, 0, 0),
    endTime: createForm.endDate.setHours(23, 59, 59, 59),
  };
}

export function getToktokPortletRdo(searchBox: PortletSearchBox, offset: number, limit: number): ToktokPortletRdo {
  return {
    title: searchBox.keywordType === 'title' ? searchBox.keyword : undefined,
    registrantName: searchBox.keywordType === 'creatorName' ? searchBox.keyword : undefined,
    searchCineroomId: searchBox.cineroom,
    startTime: searchBox.startDate.setHours(0, 0, 0, 0),
    endTime: searchBox.endDate.setHours(23, 59, 59, 59),
    offset,
    limit,
  };
}

export function getToktokPortletUdo(editForm: PortletEditForm): ToktokPortletUdo {
  const contents: Content[] = editForm.contentItems.map((item) => ({
    imgPath: item.imageUrl,
    text: item.description,
    link: item.linkUrl,
  }));

  return {
    title: editForm.title,
    cinerooms: editForm.cinerooms,
    contents,
    startTime: editForm.startDate.setHours(0, 0, 0, 0),
    endTime: editForm.endDate.setHours(23, 59, 59, 59),
  };
}
