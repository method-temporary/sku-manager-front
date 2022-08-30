import { PageElementPosition } from '_data/arrange/pageElements/model/vo';

export function getPositionName(position: PageElementPosition) {
  //
  if (position === PageElementPosition.HomeElement) {
    return '홈 화면 요소';
  } else if (position === PageElementPosition.Footer) {
    return 'Footer 메뉴';
  } else if (position === PageElementPosition.TopMenu) {
    return '상단 메뉴';
  } else if (position === PageElementPosition.MyPage) {
    return 'My Page 메뉴';
  } else {
    return '';
  }
}
