import React from 'react';
import { find } from 'lodash';
import { CollegeModel } from '_data/college/colleges/model/CollegeModel';
import { CollegeService } from '../../college';
import { CardCategory } from '../../shared/model';
import { getPolyglotToAnyString } from '../../shared/components/Polyglot';
import { Table } from 'semantic-ui-react';
import CardCreateStore from '../create/CardCreate.store';
import { CardService } from '../card';
import { alert, AlertModel } from '../../shared/components';

/**
 * Card 공통 BreadCrumb
 */
export const cardBreadcrumb = [
  { key: 'Home', content: 'HOME', link: true },
  { key: 'Learning', content: 'Learning 관리', link: true },
  { key: 'Process', content: '과정 관리', link: true },
  { key: 'Card', content: 'Card 관리', active: true },
];

/**
 * Card 승인 공통 BreadCrumb
 */
export const cardApprovalBreadcrumb = [
  { key: 'Home', content: 'HOME', link: true },
  { key: 'Learning', content: 'Learning 관리', link: true },
  { key: 'Process', content: '승인 관리', link: true },
  { key: 'Card', content: 'Card 승인 관리', active: true },
];

/**
 * College Select Options 가져오기
 * @param collegeData
 */
export const getCollegeOptions = (collegeData?: CollegeModel[]) => {
  const options = [
    {
      key: '',
      text: '전체',
      value: '',
    },
  ];

  if (collegeData) {
    collegeData.forEach((college) => {
      options.push({
        key: college.id,
        text: college.name.ko,
        value: college.id,
      });
    });
  }

  return options;
};

/**
 * College 선택시에 해당 Collage Channel Select Options 가져오기
 * @param selectedCollegeId
 * @param collegeData
 */
export const getChannelOptions = (selectedCollegeId: string, collegeData?: CollegeModel[]) => {
  const options = [
    {
      key: '',
      text: '전체',
      value: '',
    },
  ];

  if (collegeData) {
    const findCollege = find(collegeData, { id: selectedCollegeId });

    if (findCollege) {
      findCollege.channels.forEach((channel) => {
        options.push({
          key: channel.id,
          text: channel.name.ko,
          value: channel.id,
        });
      });
    }
  }
  return options;
};

/**
 * College Select Box 변경 Event
 * @param id
 * @param setCollegeId
 * @param setChannelId
 */
export const onChangeCollege = async (
  id: string,
  setCollegeId: (collegeId: string) => void,
  setChannelId: (channelId: string) => void
) => {
  //
  const { findMainCollege } = CollegeService.instance;
  setCollegeId(id);

  if (id === '') {
    setChannelId('');
  } else {
    await findMainCollege(id);
  }
};

/**
 * College, Channel 화면 Text 가져오기
 * @param cardCategory
 * @param colleges
 */
export function displayChannel(cardCategory: CardCategory, colleges?: CollegeModel[]) {
  //
  if (colleges) {
    const college = colleges.find((college) => college.id === cardCategory.collegeId);

    if (college) {
      //
      const channels = college.channels;
      const twoDepth = channels.find((channels) => channels.id === cardCategory.twoDepthChannelId);

      if (twoDepth) {
        // twoDepth 가 있으면 그 channel 이름 반환
        return `${getPolyglotToAnyString(college.name)} > ${getPolyglotToAnyString(twoDepth.name)}`;
      } else {
        //
        const channel = channels.find((channels) => channels.id === cardCategory.channelId);

        if (channel) {
          // twoDepth 가 없으면 oneDepth 이름 반환
          return `${getPolyglotToAnyString(college.name)} > ${getPolyglotToAnyString(channel.name)}`;
        } else {
          // 혹시나 channel 이름을 못찾으면 college 이름만 반환
          return `${getPolyglotToAnyString(college.name)}`;
        }
      }
    }
  }

  // college 를 못 찾을 경우엔 공백 반환
  return '';
}

/**
 * College, Channel 화면 Table 형태로 가져오기
 * @param cardCategory
 * @param colleges
 */
export function displayChannelToTable(cardCategory: CardCategory, colleges?: CollegeModel[]) {
  //
  let collegeName = '';
  let channelName = '';

  if (colleges) {
    const college = colleges.find((college) => college.id === cardCategory.collegeId);

    if (college) {
      //
      const channels = college.channels;
      const twoDepth = channels.find((channels) => channels.id === cardCategory.twoDepthChannelId);

      collegeName = getPolyglotToAnyString(college.name);

      if (twoDepth) {
        // twoDepth 가 있으면 그 channel 이름 반환
        channelName = getPolyglotToAnyString(twoDepth.name);
      } else {
        //
        const channel = channels.find((channels) => channels.id === cardCategory.channelId);

        if (channel) {
          // twoDepth 가 없으면 oneDepth 이름 반환
          channelName = getPolyglotToAnyString(channel.name);
        }
      }
    }
  }

  return (
    <>
      {collegeName && (
        <Table celled>
          <colgroup>
            <col width="20%" />
            <col width="80%" />
          </colgroup>
          <Table.Body>
            <Table.Row>
              <Table.Cell>{collegeName}</Table.Cell>
              <Table.Cell>{channelName}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      )}
    </>
  );
}

/**
 * Card 이름 중복 체크
 */
export async function overLepCheck(cardId?: string) {
  //
  const { name } = CardCreateStore.instance;

  const { findCardDuplicateCardName } = CardService.instance;

  const cardDuplicateRdo = { name, id: cardId };

  const count = await findCardDuplicateCardName(cardDuplicateRdo);

  if (count > 0) {
    alert(AlertModel.getOverlapAlert(`"카드명"`));
    return false;
  }

  return true;
}
