import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { Channel } from '_data/college/model';
import { CollegeModel } from '_data/college/colleges/model/CollegeModel';
import CollegeSelectedModalStore from './CollegeSelectedModal.store';
import { ChannelWithAnotherInfo } from './model/ChannelWithAnotherInfo';

/**
 * Channel 선택 여부 판단 함수
 * @param channelId
 * @param subChannel
 */
export const isCheckedChannel = (channelId: string, subChannel?: boolean): boolean => {
  //
  const { selectedMainChannel, selectedSubChannels } = CollegeSelectedModalStore.instance;

  if (subChannel) {
    // SubChannel 선택일 때
    return !!selectedSubChannels.find((channel) => channel.id === channelId);
  } else {
    // Main Channel 선택일 때는 channel 의 Id 가
    // channelId 이거나  twoDepthChannelId 일 경우에도 체크
    return selectedMainChannel.id === channelId || selectedMainChannel.parentId === channelId;
  }
};

/**
 * Channel Disabled 여부 판단 함수
 * @param channel
 * @param subChannel
 */
export const isDisabledChannel = (channel: ChannelWithAnotherInfo, subChannel?: boolean): boolean => {
  //
  const { selectedMainChannel, collegeChannel } = CollegeSelectedModalStore.instance;

  const hasChild = !subChannel && collegeChannel.some((collegeChannel) => collegeChannel.parentId === channel.id);

  if (subChannel) {
    // 서브 채널
    // 선택되어 있는 Main 채널 Disabled
    // 선택되어 있는 Main 채널이 2 Depth 인 경우 1 Depth 도 Disabled
    if (selectedMainChannel.id === channel.id || selectedMainChannel.parentId === channel.id) return true;
  } else {
    // 메인 채널
    // 1 Depth 는 2Depth 채널이 있는 경우는 무조건 Disabled
    if (hasChild) return true;
  }

  return (
    (subChannel && selectedMainChannel.id === channel.id) ||
    hasChild ||
    selectedMainChannel.twoDepthChannelId === channel.id
  );
};

/**
 * Channel 을 CollegeSelectedModal 사용에 맞게 변환
 * @param channel
 */
export const getChannelWithAnotherInfo = (channel: Channel): ChannelWithAnotherInfo => {
  //
  return {
    ...channel,
    parentId: channel.parentId || '',
    mainCategory: false,
    twoDepthChannelId: '',
  };
};

/**
 * Channel parent 다음으로 children 이 오도록 순서 정렬
 */
export const sortChannelDepths = (channels: ChannelWithAnotherInfo[]) => {
  //
  const sortingChannels: ChannelWithAnotherInfo[] = [];

  channels
    .filter((channel) => channel.parentId === '')
    .forEach((channel) => {
      // 1 Depth Channel 은 무조건 넣고
      sortingChannels.push(channel);

      // parentId !== '' -> 2 Depth Channel
      // parentId 가 1 Depth Channel 의 id 와 같을 때,
      // 1 Depth 뒤로 2 Depth Channel 들 추가
      // displayOrder 는 이미 back-end 에서 순서 정렬해서 왔기 때문에
      // list 순서대로 Depth 만 맞춰주면 displayOrder 에 맞게 순서 정렬 가능
      channels
        .filter((channel) => channel.parentId !== '')
        .forEach((cChannel) => {
          if (cChannel.parentId === channel.id) {
            sortingChannels.push(cChannel);
          }
        });
    });

  return sortingChannels;
};

/**
 * Channel 선택, 선택해제 함수
 * @param selectedChannel
 * @param checked
 * @param isSubChannel
 */
export const onClickChannel = (selectedChannel: ChannelWithAnotherInfo, checked: boolean, isSubChannel?: boolean) => {
  //
  const { selectedSubChannels, collegeChannel, setSelectedSubChannels, setSelectedMainChannel } =
    CollegeSelectedModalStore.instance;

  if (isSubChannel) {
    //
    let next: ChannelWithAnotherInfo[] = [...selectedSubChannels];

    if (checked) {
      //
      if (selectedChannel.parentId === '') {
        // 1 Depth 선택
        next.push(selectedChannel);

        // 1 Depth 의 Children 중에 selectedSubChannels 에 없으면 추가
        collegeChannel
          .filter((channel) => channel.parentId === selectedChannel.id)
          .map((channel) => {
            if (!selectedSubChannels.find((selected) => selected.id === channel.id)) {
              next.push(channel);
            }
          });
      } else {
        // 2 Depth 선택
        next.push(selectedChannel);

        // 2 Depth 의 Parent 가 selectedSubChannels 에 없으면 추가
        if (!selectedSubChannels.find((channel) => channel.id === selectedChannel.parentId)) {
          const parentChannel = collegeChannel.find((channel) => channel.id === selectedChannel.parentId);

          if (parentChannel) next.push(parentChannel);
        }
      }
      setSelectedSubChannels(next);
    } else {
      if (selectedChannel.parentId === '') {
        // 1 Depth 선택 헤제

        // 선택되어 있는 Channel 중에서 선택한 Channel 과 id 가 같거나
        // 선택한 Channel 의 id 를 ParentId 로 가지고 있는 Channel 삭제
        next = selectedSubChannels
          .filter((channel) => channel.parentId !== selectedChannel.id && channel.id !== selectedChannel.id)
          .map((channel) => channel);
      } else {
        // 2 Depth 선택 해제

        // 선택되어 있는 Channel 선택 해제
        next = selectedSubChannels.filter((channel) => channel.id !== selectedChannel.id).map((channel) => channel);

        // Channel 와 동일한 ParentId 를 가진 Channel 이 없을 경우 ParentId 가 Id 인 Channel 삭제
        if (next.filter((channel) => channel.parentId === selectedChannel.parentId).length === 0) {
          //
          next = next.filter((channel) => channel.id !== selectedChannel.parentId).map((channel) => channel);
        }
      }
      setSelectedSubChannels(next);
    }
  } else {
    // Main Channel 은 Radio 라서 체크 해제가 없음
    setSelectedMainChannel({ ...selectedChannel, mainCategory: true });
  }
};

/**
 * 선택된 Channel 들 한 번에 보여주는 Node List 만들어주는 함수
 * @param isSubChannel
 * @param colleges
 */
export const getMakeSelectSubChannels = (isSubChannel: boolean, colleges: CollegeModel[]) => {
  //
  const { selectedSubChannels, selectedMainChannel } = CollegeSelectedModalStore.instance;

  const cellList: React.ReactNode[] = [];
  let selectedChannels: ChannelWithAnotherInfo[] = [];

  if (isSubChannel) {
    selectedChannels = selectedSubChannels;
  } else {
    selectedChannels = selectedMainChannel.collegeId ? [selectedMainChannel] : [];
  }

  selectedChannels.forEach((selectedChannel, index) => {
    //
    // 1  Depth 인 경우
    if (selectedChannel.parentId === '') {
      // parentId 가 Channel 의 Id 와 같은 Channel 이 있는지 여부
      const hasChildren = selectedSubChannels.filter((channel) => channel.parentId === selectedChannel.id).length > 0;

      // 1 Depth 이면서 Children 이 없는 경우
      if (!hasChildren) {
        cellList.push(makeCell(selectedChannel, index, colleges, isSubChannel));
      }
    } else {
      // 2 Depth 인 경우
      cellList.push(makeCell(selectedChannel, index, colleges, isSubChannel));
    }
  });

  return cellList;
};

/**
 * 선택된 채널 단일 Node 만들어 주는 함수
 * @param channel
 * @param index
 * @param colleges
 * @param isSubChannel
 */
const makeCell = (
  channel: ChannelWithAnotherInfo,
  index: number,
  colleges: CollegeModel[],
  isSubChannel: boolean
): React.ReactNode => {
  //
  return (
    <span className="select-item" key={index}>
      <Button className="del">
        {displayCollegeAndChannel(channel, colleges)}
        <div className="fl-right" onClick={() => onClickChannel(channel, false, isSubChannel)}>
          <Icon name="times" />
        </div>
      </Button>
    </span>
  );
};

/**
 * College, Channel 명 가져오기
 */
const displayCollegeAndChannel = (channel: ChannelWithAnotherInfo, colleges: CollegeModel[]) => {
  //
  if (colleges) {
    const college = colleges.find((college) => college.id === channel.collegeId);

    if (college) {
      //
      if (channel) {
        const channelName = college.channels.find((ch) => ch.id === channel.id)?.name;

        // Channel 이 있으면 이름 반환
        return `${getPolyglotToAnyString(college.name)} > ${getPolyglotToAnyString(channelName)}`;
      } else {
        // 혹시나 channel 이름을 못찾으면 college 이름만 반환
        return `${getPolyglotToAnyString(college.name)}`;
      }
    }
  }

  // college 를 못 찾을 경우엔 공백 반환
  return '';
};
