import CommunityStore from 'community/community/mobx/CommunityStore';
import { CommunityCourseMappingViewModel } from 'community/community/viewModel/CommunityCourseMappingViewModel';
import React from 'react';
import { Button, Icon, Tab, Table } from 'semantic-ui-react';

interface CommunityCourseMappingViewProps {
  communityCourseMappingViewModel: CommunityCourseMappingViewModel[];
  communityId: string;
}

interface ItemProps extends CommunityCourseMappingViewModel {
  communityId: string;
}

function Item(props: ItemProps) {
  const { communityId, id, name, channel, time, creator } = props;
  return (
    <Table.Row>
      <Table.Cell>
        <Button
          icon
          size="mini"
          basic
          onClick={() => {
            CommunityStore.instance.deleteCommunityCourse(communityId, id);
          }}
        >
          <Icon name="minus" />
        </Button>
      </Table.Cell>
      <Table.Cell>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.Cell className="tb-header" style={{ borderBottom: '1px solid #dce2ef' }}>
                카드명
              </Table.Cell>
              <Table.Cell className="tb-header" style={{ borderBottom: '1px solid #dce2ef' }}>
                학습유형
              </Table.Cell>
              <Table.Cell className="tb-header" style={{ borderBottom: '1px solid #dce2ef' }}>
                Channel
              </Table.Cell>
              <Table.Cell className="tb-header" style={{ borderBottom: '1px solid #dce2ef' }}>
                등록일자
              </Table.Cell>
              <Table.Cell className="tb-header" style={{ borderBottom: '1px solid #dce2ef' }}>
                생성자
              </Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell>Card</Table.Cell>
              <Table.Cell>{channel}</Table.Cell>
              <Table.Cell>{time}</Table.Cell>
              <Table.Cell>{creator}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Table.Cell>
    </Table.Row>
  );
}

export function CommunityCourseMappingView(props: CommunityCourseMappingViewProps) {
  const { communityCourseMappingViewModel, communityId } = props;
  return (
    <Table.Row>
      <Table.Cell className="tb-header">Mapping List</Table.Cell>
      <Table.Cell>
        {communityCourseMappingViewModel.length > 0 && (
          <Table>
            {communityCourseMappingViewModel.map((c) => {
              return <Item key={c.id} communityId={communityId} {...c} />;
            })}
          </Table>
        )}
      </Table.Cell>
    </Table.Row>
  );
}
