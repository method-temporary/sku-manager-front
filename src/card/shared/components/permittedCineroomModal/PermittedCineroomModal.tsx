import React from 'react';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import { Button, Table } from 'semantic-ui-react';

import { MYSUNI_CINEROOMID, Params } from 'shared/model';
import { FormTable, Modal } from 'shared/components';

import { PermittedCineroom } from '_data/lecture/cards/model/vo';

import { getUserWorkSpaceByCineroomId } from 'userworkspace/userWorkSpace.util';

import PermittedCineroomModalStore from './PermittedCineroomModal.store';
import { onClickCineroomOne, onCheckCineroomAll, isAllPermittedCineroom } from './PermittedCineroomModal.event';
import PermittedListByUWS from './components/PermittedListByUWS';
import PermittedListByPC from './components/PermittedListByPC';
import { PermittedCineroomWithParentId } from '../../model';
import { useFindAllUserWorkSpaces } from '../../../../userworkspace/userWorkSpace.hook';

interface Props {
  //
  readonly?: boolean;
  title: string;
  contentsHeader: string;
  hasRequire?: boolean;
  permittedCinerooms: PermittedCineroom[];
  onOk?: (permittedCineroom: PermittedCineroom[]) => void;
  onCancel?: () => void;
}

const PermittedCineroomModal = observer(
  ({ readonly, title, hasRequire, permittedCinerooms, contentsHeader, onOk, onCancel }: Props) => {
    //
    const cineroomId = hasRequire ? useParams<Params>().cineroomId : MYSUNI_CINEROOMID;
    const { isAll, selectPermittedCinerooms, reset, setIsAll, setIsRequireAll, setSelectPermittedCinerooms } =
      PermittedCineroomModalStore.instance;

    const { data: userWorkSpaceData } = useFindAllUserWorkSpaces();

    const userWorkspaces = getUserWorkSpaceByCineroomId(cineroomId, userWorkSpaceData);

    const onMount = () => {
      //
      if (permittedCinerooms.length === 0) {
        // 선택한 관게사가 없는 경우
        const userWorkSpace = userWorkspaces.find((userWorkspace) => userWorkspace.id === cineroomId);

        setSelectPermittedCinerooms([
          {
            cineroomId,
            required: false,
            parentId: (userWorkSpace && userWorkSpace.parentId) || '',
          } as PermittedCineroomWithParentId,
        ]);

        setIsAll(true);
      } else {
        // 이미 성택한 관계사가 있을경우
        const nextPermittedCinerooms = permittedCinerooms.map((permittedCineroom) => {
          //
          const userWorkSpace = userWorkspaces.find(
            (userWorkspace) => userWorkspace.id === permittedCineroom.cineroomId
          );

          return {
            cineroomId: permittedCineroom.cineroomId,
            required: permittedCineroom.required,
            parentId: userWorkSpace ? userWorkSpace.parentId : '',
          } as PermittedCineroomWithParentId;
        });

        if (permittedCinerooms) setSelectPermittedCinerooms(nextPermittedCinerooms);

        const { isAll, isRequiredAll } = isAllPermittedCineroom(permittedCinerooms, cineroomId, userWorkspaces.length);

        setIsAll(isAll);
        setIsRequireAll(isRequiredAll);
      }
    };

    const onCheckAll = (check: boolean, required: boolean = false) => {
      //
      onCheckCineroomAll(check, cineroomId, required);
    };

    const onCheckOne = (
      check: boolean,
      selectCineroomId: string,
      selectCineroomParentId: string,
      required: boolean = false
    ) => {
      //
      // MYSUNI 와 마지막으로 선택한 관계사(or 핵인싸)의 갯수를 제외한 갯수가 전체 갯수와 같을 경우에 ALL을 누르는 것과 같은 상황
      // ==> ALL Check 로직 태우기 위한 변수
      const isPermittedAll = selectPermittedCinerooms.length === userWorkspaces.length - 2;
      const isRequiredAll =
        selectPermittedCinerooms.filter((permittedCineroom) => permittedCineroom.required).length ===
        userWorkspaces.length - 2;

      onClickCineroomOne(
        check,
        selectCineroomId,
        isPermittedAll,
        isRequiredAll,
        required,
        cineroomId,
        selectCineroomParentId
      );
    };

    const onClickCancel = (_: React.MouseEvent<HTMLButtonElement>, close: () => void) => {
      //
      reset();
      onCancel && onCancel();
      close();
    };

    const onClickOK = (_: React.MouseEvent<HTMLButtonElement>, close: () => void) => {
      //
      const { selectPermittedCinerooms } = PermittedCineroomModalStore.instance;
      onOk && onOk(selectPermittedCinerooms);

      onClickCancel(_, close);
    };

    return readonly ? null : (
      <Modal
        className="base w1000 inner-scroll"
        size="large"
        trigger={<Button type="button">범위 선택</Button>}
        onMount={onMount}
      >
        <Modal.Header>{title}</Modal.Header>
        <Modal.Content>
          <Table celled>
            <colgroup>
              <col width="20%" />
              <col width="80%" />
            </colgroup>

            <Table.Body>
              <FormTable.Row name={contentsHeader}>
                <PermittedListByUWS
                  cineroomId={cineroomId}
                  userWorkspaces={userWorkspaces}
                  onCheckAll={onCheckAll}
                  onCheckOne={onCheckOne}
                />
              </FormTable.Row>
              {hasRequire && selectPermittedCinerooms.length > 0 && (
                <FormTable.Row name="핵인싸 적용 범위 설정">
                  <div className="scrolling-30vh">
                    <div className="check-group">
                      <div className="table-inner-modal">
                        {isAll ? (
                          <PermittedListByUWS
                            required
                            cineroomId={cineroomId}
                            userWorkspaces={userWorkspaces}
                            onCheckAll={onCheckAll}
                            onCheckOne={onCheckOne}
                          />
                        ) : (
                          <PermittedListByPC
                            userWorkspaces={userWorkspaces}
                            permittedCinerooms={selectPermittedCinerooms}
                            onCheckOne={onCheckOne}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </FormTable.Row>
              )}
            </Table.Body>
          </Table>
        </Modal.Content>
        <Modal.Actions>
          <Modal.CloseButton className="w190 d" onClickWithClose={onClickCancel}>
            CANCEL
          </Modal.CloseButton>
          <Modal.CloseButton className="w190 p" onClickWithClose={onClickOK}>
            OK
          </Modal.CloseButton>
        </Modal.Actions>
      </Modal>
    );
  }
);

export default PermittedCineroomModal;
