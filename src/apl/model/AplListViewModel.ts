import moment from 'moment';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { EnumUtil, AplStateView } from 'shared/ui';
import { AplXlsxModel } from './AplXlsxModel';
import { AplModel } from './AplModel';

export class AplListViewModel extends AplModel {
  //
  constructor(aplListView: AplListViewModel) {
    //
    super(aplListView);
    if (aplListView) {
      Object.assign(this, { ...aplListView });
    }
  }

  static asXLSX(
    apl: AplListViewModel,
    index: number,
    collegesMap: Map<string, string>,
    channelMap: Map<string, string>
  ): AplXlsxModel {
    //

    return {
      No: String(index + 1),
      교육명: apl.title,
      'Category / Channel': `${collegesMap.get(apl.collegeId)} / ${channelMap.get(apl.channelId)}` || '-',
      교육시간:
        (apl.updateHour === 0 && apl.updateMinute === 0 ? apl.allowHour : apl.updateHour) +
          'h ' +
          (apl.updateHour === 0 && apl.updateMinute === 0 ? apl.allowMinute : apl.updateMinute) +
          'm' || '-',
      등록일자: moment(apl.registeredTime).format('YYYY.MM.DD HH:mm:ss') || '-',
      생성자: getPolyglotToAnyString(apl.registrantUserIdentity.name) || '-',
      '생성자 E-mail': apl.registrantUserIdentity.email || '-',
      상태: EnumUtil.getEnumValue(AplStateView, apl.state).get(apl.state) || '-',
      '승인/반려일자':
        apl.modifiedTime === 0
          ? moment(apl.allowTime).format('YYYY.MM.DD HH:mm:ss')
          : moment(apl.modifiedTime).format('YYYY.MM.DD HH:mm:ss'),
    };
  }
}
