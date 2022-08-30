import { axiosApi as axios, NameValueList } from '@nara.platform/accent';
import Menu from '../model/Menu';
import MenuCdo from '../model/MenuCdo';
import MenuDiscussionCdo from '../model/MenuDiscussionCdo';
import MenuDiscussionUdo from '../model/MenuDiscussionUdo';
import MenuDiscussionRdo from '../model/MenuDiscussionRdo';

const FEEDBACK_URL = '/api/feedback';

const BASE_URL = '/api/community';

export function findAllMenu(communityId: string): Promise<Menu[] | undefined> {
  return axios
    .get<Menu[]>(`${BASE_URL}/${communityId}/menus`)
    .then((response) => response && response.data && response.data);
}

export function registerMenu(communityId: string, menuCdo: MenuCdo): Promise<string> {
  return axios
    .post<string>(`${BASE_URL}/${communityId}/menus`, menuCdo)
    .then((response) => response && response.data && response.data);
}

export function registerMenuAndDiscussion(communityId: string, menuDiscussionCdo: MenuDiscussionCdo): Promise<string> {
  // console.log('api', menuDiscussionCdo);
  return axios
    .post<string>(`${BASE_URL}/${communityId}/menus/flow/discussion`, menuDiscussionCdo)
    .then((response) => response && response.data && response.data);
}

export function modifyMenu(
  type: string,
  communityId: string,
  menuId: string,
  nameValueList: NameValueList,
  title: string,
  discussionTopic?: string,
  menuDiscussionUdo?: MenuDiscussionUdo
): Promise<any> {
  if (type === 'DISCUSSION' || type === 'ANODISCUSSION') {
    //메뉴항목이 변경되면 실행
    if (nameValueList.nameValues.length > 0) {
      return axios.put(`${BASE_URL}/${communityId}/menus/flow/${menuId}`, menuDiscussionUdo).then(() => {
        return axios.put(`${BASE_URL}/${communityId}/menus/${menuId}`, nameValueList);
      });
    } else {
      return axios.put(`${BASE_URL}/${communityId}/menus/flow/${menuId}`, menuDiscussionUdo);
    }
  } else {
    return axios.put(`${BASE_URL}/${communityId}/menus/${menuId}`, nameValueList);
  }
}

export function removeMenu(communityId: string, menuId: string): Promise<any> {
  return axios.delete(`${BASE_URL}/${communityId}/menus/${menuId}`);
}

export function setCommunityMenuOrder(communityId: string): Promise<any> {
  return axios.put(`${BASE_URL}/${communityId}/menus/order`);
}

export function findPostMenuDiscussion(menuId: string): Promise<MenuDiscussionCdo | undefined> {
  return axios
    .get<MenuDiscussionCdo>(`${BASE_URL}/post/menu/${menuId}`)
    .then((response) => response && response.data && response.data);
}

export function findMenuDiscussionFeedBack(commentFeedbackId: string): Promise<MenuDiscussionRdo | undefined> {
  return axios
    .get<MenuDiscussionRdo>(`${FEEDBACK_URL}/feedback/${commentFeedbackId}/comment`)
    .then((response) => response && response.data && response.data);
}
