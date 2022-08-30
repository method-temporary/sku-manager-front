import * as React from 'react';
import { Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import PermittedCineroomModal from '../../../../../shared/components/permittedCineroomModal/PermittedCineroomModal';
import { PermittedCineroom } from '../../../../../../_data/lecture/cards/model/vo';
import PermittedCineroomList from '../../../../../shared/components/permittedCineroomModal/components/PermittedCineroomList';
import EnrollmentCubeStore from '../EnrollmentCube.store';

interface props {
  readonly?: boolean;
}
/*
 * > 활용 범위(Component : CubeExposureInfoRow) Deprecated
 * 사유 : 기획상 Enrollment Cube에서는 활용도가 낮다고 판단됨
 * 작업 일시 : 2022-04-25
 * 작업자 : 김민준
 */
export const CubeExposureInfoRow = observer(({ readonly }: props) => {
  //
  const { sharingCineroomIds, setSharingCineroomIds } = EnrollmentCubeStore.instance;

  const onClickOk = (permittedCineroom: PermittedCineroom[]) => {
    //
    const idList = permittedCineroom.map(({ cineroomId, required }, index) => {
      return cineroomId;
    });

    setSharingCineroomIds(idList);
  };

  const getPermittedCinerooms = (): PermittedCineroom[] => {
    return sharingCineroomIds.map((id) => {
      return { cineroomId: id, required: false };
    });
  };

  return (
    <Table.Row>
      <Table.Cell className="tb-header">활용 범위</Table.Cell>
      <Table.Cell>
        {!readonly && (
          <PermittedCineroomModal
            title="활용 범위 설정하기"
            contentsHeader="활용 범위 설정"
            permittedCinerooms={getPermittedCinerooms()}
            onOk={onClickOk}
          />
        )}
        {getPermittedCinerooms().length > 0 && (
          <PermittedCineroomList permittedCinerooms={getPermittedCinerooms()} hasRequire />
        )}
      </Table.Cell>
    </Table.Row>
  );
});
