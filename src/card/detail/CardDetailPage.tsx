import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Container, Form, Tab } from 'semantic-ui-react';

import { Params } from 'shared/model';
import { alert, AlertModel, confirm, ConfirmModel, PageTitle } from 'shared/components';

import { getUserGroupMap } from 'usergroup/group/present/logic/usergroup.util';
import { useFindAllUserGroup } from 'usergroup/group/present/logic/usergroup.hook';

import { cardBreadcrumb } from '../shared/utiles';
import { useFindCardByIdMutation } from '../list/CardList.hook';

import CardDetailStore from './CardDetail.store';
import { getCardDetailTabMenus, setCardCreateByCardContents, setCardLearningByCardContents } from './CardDetail.util';
import { approvalCard } from '../../_data/lecture/cards/api/CardApi';
import { modifyCardLogic } from '../create/learning/CardLearningInfoPage.util';
import CardCreateStore from '../create/CardCreate.store';
import { getCardThumbnailUrl } from 'card/create/basic/components/cardThumbnail/cardThumbnail.utils';
import LearningStore from '../create/learning/Learning.store';
import LearningContentsStore from '../create/learning/learningPlan/LearningContents/LearningContents.store';
import EnrollmentCubeStore from '../create/learning/learningPlan/enrollmentCube/EnrollmentCube.store';
import { setEnrollmentCubeDetail } from '../create/learning/Learning.util';
import { baseUrl } from '../../Routes';

import { cineroomIdFromUrl } from 'lib/common';
import { learningManagementUrl } from 'Routes';

interface Param extends Params {
  cardId: string;
  cubeId: string;
}

const CardDetailPage = observer(() => {
  //
  const { cardId, cubeId } = useParams<Param>();
  const { readonly, activeIndex, setReadonly, setActiveIndex, setDetailPageLoading, setIsDetailLoading, reset } =
    CardDetailStore.instance;

  const { data: UserGroups, isLoading: isUserGroupsLoading } = useFindAllUserGroup();
  const mutation = useFindCardByIdMutation();

  const { reset: createReset, setThumbnailImagePath } = CardCreateStore.instance;
  const { reset: learningReset } = LearningStore.instance;
  const { reset: learningContentReset } = LearningContentsStore.instance;
  const { setSelectedCubeId } = EnrollmentCubeStore.instance;

  const { cineroomId } = useParams<{ cineroomId: string }>();
  const history = useHistory();

  useEffect(() => {
    //
    reset();
    createReset();
    learningReset();
    learningContentReset();
    setIsDetailLoading(true);
  }, [cardId]);

  useEffect(() => {
    //
    findCardById();
  }, [isUserGroupsLoading]);

  const setCubeModifyForm = async () => {
    //
    await setEnrollmentCubeDetail(cubeId);
    setSelectedCubeId(cubeId);
  };

  const findCardById = async () => {
    //
    const userGroupMap = getUserGroupMap(UserGroups?.results || []);

    const cardWithContentsAndRelatedCount = await mutation.mutateAsync(cardId);

    if (cardWithContentsAndRelatedCount) {
      await setCardCreateByCardContents(userGroupMap, cardWithContentsAndRelatedCount, mutation);
      await setCardLearningByCardContents(cardWithContentsAndRelatedCount);

      if (cubeId) {
        //
        setActiveIndex(1);
        setReadonly(false);
        await setCubeModifyForm();
      }
    }

    setIsDetailLoading(false);
  };

  const onClickNext = async () => {
    if (!readonly) {
      const thumbnailUrl = await getCardThumbnailUrl();
      setThumbnailImagePath(thumbnailUrl);
    }
    //
    setActiveIndex(1);
  };

  const onClickPrev = () => {
    //
    setActiveIndex(0);
  };

  const onClickUpdate = async () => {
    //
    if (readonly) {
      setReadonly(false);
    } else {
      setReadonly(true);
      setIsDetailLoading(true);
      await findCardById();
    }
  };

  const onClickApprovalCard = async () => {
    confirm(
      ConfirmModel.getOpenApprovalConfirm(async () => {
        await approvalCard(cardId);
        alert(
          AlertModel.getOpenApprovalSuccessAlert(async () => {
            await findCardById();
          })
        );
      }, 'Card'),
      false
    );
  };

  const onClickTab = (e: any, data: any) => {
    //
    if (activeIndex === 0 && data.activeIndex === 1) {
      // 카드 정보에서 수강 정보로 이동시에
      onClickNext().then((_) => {});
    } else if (activeIndex === 1 && data.activeIndex === 0) {
      // 수강 정보에서 카드 정보로 이동시에
      onClickPrev();
    } else {
      setActiveIndex(data.activeIndex);
    }
  };

  const onClickModifyButton = async () => {
    //
    setDetailPageLoading(true);

    if (activeIndex === 0) {
      const { setThumbnailImagePath } = CardCreateStore.instance;

      const thumbnailUrl = await getCardThumbnailUrl();
      setThumbnailImagePath(thumbnailUrl);
    }

    await modifyCardLogic(cardId, cineroomId, history);
    setDetailPageLoading(false);
  };

  const getOpenedTab = () => {
    //
    return getCardDetailTabMenus(
      cardId,
      onClickNext,
      onClickPrev,
      onClickUpdate,
      onClickApprovalCard,
      onClickModifyButton,
      onClickMoveToCardList
    );
  };

  function cardListUrl() {
    return `/cineroom/${cineroomIdFromUrl()}/${learningManagementUrl}/cards/card-list`;
  }

  const onClickMoveToCardList = () => {
    history.push(cardListUrl());
  };

  return (
    <>
      <Container fluid>
        <PageTitle breadcrumb={cardBreadcrumb}>
          Card 관리{' '}
          <Button primary as="a" download href={baseUrl + 'resources/[mySUNI]_Card관리_가이드.pdf'}>
            Card 관리 가이드
          </Button>
        </PageTitle>

        <Form>
          <Tab
            panes={getOpenedTab()}
            menu={{ secondary: true, pointing: true }}
            activeIndex={activeIndex}
            className="styled-tab tab-wrap"
            onTabChange={onClickTab}
          />
        </Form>
      </Container>
    </>
  );
});

export default CardDetailPage;
