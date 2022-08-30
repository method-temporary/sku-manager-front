import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Container, Form, Tab } from 'semantic-ui-react';

import { AccessRuleSettings, DimmerLoader, PageTitle, Polyglot, SubActions } from 'shared/components';

import { TestSheetModalContainer } from '../../exam/ui/logic/TestSheetModalContainer';
import { cardBreadcrumb } from '../shared/utiles';

import CardCreateStore from './CardCreate.store';
import { onChangeAccessRule, setDefaultSurvey } from './CardCreate.util';
import PreRequisiteCard from './basic/components/PreRequisiteCard';
import CardBasicInfo from './basic/components/CardBasicInfo';
import CardExposureInfo from './basic/components/CardExposureInfo';
import CardAdditionalInfo from './basic/components/CardAdditionalInfo';
import CardMoreInfo from './basic/components/CardMoreInfo';

import { registerCardLogic } from './learning/CardLearningInfoPage.util';
import { LearningPeriodInfo } from './learning/learningPeriodInfo/LearningPeriodInfo';
import { LearningPlan } from './learning/learningPlan/LearningPlan';
import RoundInfo from './learning/components/RoundInfo';
import LearningStore from './learning/Learning.store';
import EnrollmentCubeStore from './learning/learningPlan/enrollmentCube/EnrollmentCube.store';
import LearningContentsStore from './learning/learningPlan/LearningContents/LearningContents.store';
import CardDetailStore from '../detail/CardDetail.store';
import { getCardThumbnailUrl } from './basic/components/cardThumbnail/cardThumbnail.utils';
import { baseUrl, learningManagementUrl } from '../../Routes';
import { cineroomIdFromUrl } from 'lib/common';
import { AccessRuleService } from 'shared/present';

const CardCreatePage = observer(() => {
  //

  const { activeIndex, createLoading, setActiveIndex, reset } = CardCreateStore.instance;
  const { reset: cardDetailReset } = CardDetailStore.instance;

  const { reset: learningReset, studentEnrollmentType } = LearningStore.instance;
  const { reset: enrollmentReset } = EnrollmentCubeStore.instance;
  const { reset: learningContentsReset } = LearningContentsStore.instance;

  useEffect(() => {
    reset();
    cardDetailReset();
    learningReset();
    enrollmentReset();
    setDefaultSurvey();
    learningContentsReset();
  }, []);

  const { cineroomId, cardId } = useParams<{ cineroomId: string; cardId: string }>();
  const history = useHistory();

  const onClickNext = async () => {
    //
    const { setThumbnailImagePath } = CardCreateStore.instance;

    const thumbnailUrl = await getCardThumbnailUrl();
    setThumbnailImagePath(thumbnailUrl);

    setActiveIndex(1);
  };

  const onClickSave = async () => {
    //
    if (activeIndex === 0) {
      const { setThumbnailImagePath } = CardCreateStore.instance;

      const thumbnailUrl = await getCardThumbnailUrl();
      setThumbnailImagePath(thumbnailUrl);
    }

    await registerCardLogic(cineroomId, history, cardId);
  };

  const onClickTab = (e: any, data: any) => {
    //
    if (activeIndex === 0 && data.activeIndex === 1) {
      // 카드 정보에서 수강 정보로 이동시에
      onClickNext().then((_) => {});
    } else {
      setActiveIndex(data.activeIndex);
    }
  };

  const onClickMoveToCardList = () => {
    history.push(`/cineroom/${cineroomIdFromUrl()}/${learningManagementUrl}/cards/card-list`);
  };

  const getOpenedTab = () => {
    //
    const { langSupports, hasPrerequisite } = CardCreateStore.instance;
    const { groupBasedAccessRule } = AccessRuleService.instance;

    return [
      {
        menuItem: 'Card 정보',
        render: () => (
          <Tab.Pane attached={false}>
            <Polyglot languages={langSupports}>
              <CardBasicInfo />
              <CardExposureInfo />
              <AccessRuleSettings
                multiple={false}
                onChange={onChangeAccessRule}
                defaultGroupBasedAccessRule={groupBasedAccessRule}
              />
              {hasPrerequisite === 'Yes' && <PreRequisiteCard />}
              <CardAdditionalInfo />
              <CardMoreInfo />
              <TestSheetModalContainer />

              <SubActions form>
                <SubActions.Right>
                  <Button basic onClick={onClickMoveToCardList}>
                    목록
                  </Button>
                  <Button primary onClick={onClickSave}>
                    저장
                  </Button>
                </SubActions.Right>
              </SubActions>
            </Polyglot>
          </Tab.Pane>
        ),
      },
      {
        menuItem: '학습 정보',
        render: () => (
          <Tab.Pane attached={false}>
            <Polyglot languages={langSupports}>
              <LearningPeriodInfo />
              {studentEnrollmentType === 'Enrollment' && <RoundInfo />}
              <LearningPlan />
            </Polyglot>

            <SubActions form>
              <SubActions.Right>
                <Button primary onClick={onClickSave}>
                  저장
                </Button>
              </SubActions.Right>
            </SubActions>
          </Tab.Pane>
        ),
      },
    ];
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

        <DimmerLoader active={createLoading} page />
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

export default CardCreatePage;
