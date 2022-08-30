import React from 'react';
import { observer } from 'mobx-react';
import { Table } from 'semantic-ui-react';
import { getPermittedCineroomsText } from '../PermittedCineroom.util';
import { useFindAllUserWorkSpaces } from '../../../../../userworkspace/userWorkSpace.hook';
import { PermittedCineroom } from '_data/lecture/cards/model/vo';

interface Props {
  permittedCinerooms: PermittedCineroom[];
  cineroomId?: string;
  hasRequire?: boolean;
}

const PermittedCineroomList = observer(({ permittedCinerooms, cineroomId, hasRequire }: Props) => {
  //
  const { data } = useFindAllUserWorkSpaces();
  const userWorkSpaceData = data || [];

  return (
    <>
      <Table celled>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>
        <Table.Body>
          <Table.Row>
            <Table.Cell>멤버사 적용 범위</Table.Cell>
            <Table.Cell>{getPermittedCineroomsText(userWorkSpaceData, permittedCinerooms, cineroomId)}</Table.Cell>
          </Table.Row>
          {hasRequire && permittedCinerooms.filter((permittedCineroom) => permittedCineroom.required).length > 0 && (
            <Table.Row>
              <Table.Cell>핵인싸 적용 범위</Table.Cell>
              <Table.Cell>
                {getPermittedCineroomsText(userWorkSpaceData, permittedCinerooms, cineroomId, true)}
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </>
  );
});

export default PermittedCineroomList;
