import React from 'react';
import { observer } from 'mobx-react';
import { Button, PaginationProps } from 'semantic-ui-react';

import { alert, AlertModel, DimmerLoader, Modal } from 'shared/components';
import { GroupBasedAccessRule } from 'shared/model';
import { Pagination } from 'shared/ui';

import CardSelectModalStore from './CardSelectModal.store';
import { useFindCardByRdoForModal, useFindCardByRdoIgnoreAccessRule } from './CardSelectModel.hook';

import CardSelectModalSearchBox from './components/CardSelectModalSearchBox';
import CardSelectModalList from './components/CardSelectModalList';
import { CardWithAccessAndOptional } from './model/CardWithAccessAndOptional';
import TempSearchBoxService from '../../../../shared/components/TempSearchBox/logic/TempSearchBoxService';

interface Props {
  isMulti?: boolean;
  readonly?: boolean;
  selectedCards?: CardWithAccessAndOptional | CardWithAccessAndOptional[];
  groupAccessRoles: GroupBasedAccessRule;
  onCancel?: () => void;
  onOk?: (selectedCards: CardWithAccessAndOptional[]) => void;
  trigger?: React.ReactElement;
  ignoreAccess?: boolean;
}

const CardSelectModal = observer(
  ({ readonly, selectedCards, groupAccessRoles, isMulti, onCancel, onOk, trigger, ignoreAccess }: Props) => {
    //
    const { cardRdo, offset, limit, setCardRdo, setOffset, setSelectedCards, setCardRdoForPage, reset } =
      CardSelectModalStore.instance;

    const { data, isLoading: isLoading } = ignoreAccess
      ? useFindCardByRdoIgnoreAccessRule(cardRdo, groupAccessRoles)
      : useFindCardByRdoForModal(cardRdo, groupAccessRoles);

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
      setCardRdoForPage(isSearch);
    };

    const onMount = () => {
      //
      if (selectedCards) {
        if (Array.isArray(selectedCards)) {
          setSelectedCards([...selectedCards]);
        } else {
          setSelectedCards([selectedCards]);
        }
      }

      setCardRdo();
    };

    const onClickCancel = (_: React.MouseEvent<HTMLButtonElement>, close: () => void) => {
      //
      reset();
      onCancel && onCancel();
      close();
    };

    const onClickOk = (_: React.MouseEvent<HTMLButtonElement>, close: () => void) => {
      //
      const { selectedCards } = CardSelectModalStore.instance;

      if (selectedCards.length === 0) {
        //
        alert(AlertModel.getRequiredChoiceAlert('Card'));
        return;
      }

      onOk && onOk(selectedCards);
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
              Card 선택
            </Button>
          )
        }
        onMount={onMount}
      >
        <Modal.Header className="res">불러오기</Modal.Header>
        <Modal.Content className="fit-layout">
          <>
            <CardSelectModalSearchBox />
            <span className="span-information-modal">* 제공상태가 승인이 아닌 Card 선택 불가</span>
            <DimmerLoader active={isLoading}>
              <CardSelectModalList
                isMulti={isMulti}
                cardWithAccessRule={data?.results || []}
                ignoreAccess={ignoreAccess}
              />
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
  }
);

export default CardSelectModal;
