import React from 'react';
import { observer } from 'mobx-react';
import { Button, Icon, Table } from 'semantic-ui-react';
import CardCreateStore from '../../CardCreate.store';

interface Props {
  //
  readonly?: boolean;
}

const CommunityList = observer(({ readonly }: Props) => {
  //
  const { communityName, setCommunityId, setCommunityName } = CardCreateStore.instance;

  return (
    <>
      {communityName && (
        <Table celled>
          <colgroup>
            {!readonly && <col width="20%" />}
            <col width="80%" />
          </colgroup>

          <Table.Header>
            <Table.Row>
              {!readonly && <Table.HeaderCell className="tb-header" />}
              <Table.HeaderCell className="tb-header">커뮤니티명</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              {!readonly && (
                <Table.Cell>
                  <Button
                    icon
                    size="mini"
                    basic
                    onClick={() => {
                      setCommunityId('');
                      setCommunityName('');
                    }}
                  >
                    <Icon name="minus" />
                  </Button>
                </Table.Cell>
              )}
              <Table.Cell colSpan={readonly ? 2 : 1}>{communityName}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      )}
    </>
  );
});

export default CommunityList;
