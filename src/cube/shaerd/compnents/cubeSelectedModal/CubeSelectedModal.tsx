import React from 'react';
import { observer } from 'mobx-react';
import { Button, PaginationProps } from 'semantic-ui-react';

import { alert, AlertModel, DimmerLoader, Modal, SubActions } from 'shared/components';
import TempSearchBoxService from 'shared/components/TempSearchBox/logic/TempSearchBoxService';
import { Pagination } from 'shared/ui';

import { CubeWithReactiveModel } from '../../../cube';

import CubeSelectedModalStore from './CubeSelectedModal.store';
import { useFindCubeByRdoForModal } from './CubeSelectedModal.hook';
import CubeSelectedModalSearchBox from './components/CubeSelectedModalSearchBox';
import CubeSelectedModalList from './components/CubeSelectedModalList';

interface Props {
  readonly?: boolean;
  selectedCubes?: CubeWithReactiveModel | CubeWithReactiveModel[];
  onCancel?: () => void;
  onOk?: (selectedCubes: CubeWithReactiveModel[]) => void;
  trigger?: React.ReactElement;
}

const CubeSelectedModal = observer(({ readonly, selectedCubes, onCancel, onOk, trigger }: Props) => {
  //
  const { cubeAdminRdo, offset, limit, setOffset, setCubeAdminRdo, setCubeAdminRdoForPage, setSelectedCubes, reset } =
    CubeSelectedModalStore.instance;

  const { data, isLoading: isLoading } = useFindCubeByRdoForModal(cubeAdminRdo);

  const totalPages = () => {
    if (data === undefined) {
      return 0;
    }

    return Math.ceil(data.totalCount / limit);
  };

  const onPageChange = (_: React.MouseEvent, data: PaginationProps) => {
    //
    const { isSearch } = TempSearchBoxService.instance;

    const offset = data.activePage as number;
    setOffset(offset);
    setCubeAdminRdoForPage(isSearch);
  };

  const onMount = () => {
    //
    if (selectedCubes) {
      if (Array.isArray(selectedCubes)) {
        setSelectedCubes([...selectedCubes]);
      } else {
        setSelectedCubes([selectedCubes]);
      }
    }

    setCubeAdminRdo();
  };

  const onClickCancel = (_: React.MouseEvent<HTMLButtonElement>, close: () => void) => {
    //
    reset();
    onCancel && onCancel();
    close();
  };

  const onClickOk = (_: React.MouseEvent<HTMLButtonElement>, close: () => void) => {
    //
    const { selectedCubes } = CubeSelectedModalStore.instance;

    if (selectedCubes.length === 0) {
      //
      alert(AlertModel.getRequiredChoiceAlert('Cube'));
      return;
    }

    onOk && onOk(selectedCubes);
    onClickCancel(_, close);
  };

  return readonly ? null : (
    <Modal
      size="large"
      trigger={
        trigger ? (
          trigger
        ) : (
          <Button type="button" disabled={readonly}>
            Cube 선택
          </Button>
        )
      }
      onMount={onMount}
    >
      <Modal.Header className="res">불러오기</Modal.Header>
      <Modal.Content className="fit-layout">
        <>
          <CubeSelectedModalSearchBox />
          <span className="span-information-modal">* Classroom / E-learning 교육 제외</span>
          <DimmerLoader active={isLoading}>
            <CubeSelectedModalList cubes={data?.results || []} />
          </DimmerLoader>
          <Pagination offset={offset} totalPages={totalPages()} onPageChange={onPageChange} />
        </>
      </Modal.Content>
      <Modal.Actions>
        <Modal.CloseButton className="w190 d" onClickWithClose={onClickCancel}>
          CANCEL
        </Modal.CloseButton>
        <Modal.CloseButton className="w190 p" onClickWithClose={onClickOk}>
          OK
        </Modal.CloseButton>
      </Modal.Actions>
    </Modal>
  );
});

export default CubeSelectedModal;
