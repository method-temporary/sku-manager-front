import moment from 'moment';

import Post from './Post';

export interface PostExcelModel {
  //
  '메뉴': string;
  '게시물명': string;
  'Email': string;
  '작성자': string;
  '등록일': string;
}

export function getPostExcelModel(post : Post): PostExcelModel {
  return {
    '메뉴': post.menuName === null ? '공지사항' : post.menuName || '' ,
    '게시물명': post.title || '',
    'Email': post.creatorEmail || '-',
    '작성자': post.nickName === '' ? post.creatorName ? post.creatorName : '' : post.nickName ? post.nickName : '',
    '등록일': moment(post.createdTime).format('YYYY.MM.DD HH:mm:ss'),
  };
}
