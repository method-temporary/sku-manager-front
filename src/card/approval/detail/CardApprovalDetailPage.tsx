import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Accordion, Container, Form, Header, Icon, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react';

import { Params } from 'shared/model';
import {
  AccessRuleSettings,
  alert,
  AlertModel,
  confirm,
  ConfirmModel,
  DimmerLoader,
  PageTitle,
  Polyglot,
} from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { getUserGroupMap } from 'usergroup/group/present/logic/usergroup.util';
import { useFindAllUserGroup } from 'usergroup/group/present/logic/usergroup.hook';
import { TestSheetModalContainer } from 'exam/ui/logic/TestSheetModalContainer';

import { cardApprovalBreadcrumb } from '../../shared/utiles';

import CardCreateStore from '../../create/CardCreate.store';
import CardApprovalInfo from './components/CardApprovalInfo';
import PreRequisiteCard from '../../create/basic/components/PreRequisiteCard';
import CardBasicInfo from '../../create/basic/components/CardBasicInfo';
import CardExposureInfo from '../../create/basic/components/CardExposureInfo';
import CardAdditionalInfo from '../../create/basic/components/CardAdditionalInfo';
import CardMoreInfo from '../../create/basic/components/CardMoreInfo';

import { useFindCardByIdMutation } from '../../list/CardList.hook';
import { setCardCreateByCardContents, setCardLearningByCardContents } from '../../detail/CardDetail.util';
import RoundInfo from '../../create/learning/components/RoundInfo';

import CardApprovalDetailStore from './CardApprovalDetail.store';
import { useOpenedCard, useRejectedCard } from './CardApprovalDetail.hook';
import { getRejectedParams } from './CardApprovalDetail.util';
import { LearningPlan } from 'card/create/learning/learningPlan/LearningPlan';
import { LearningPeriodInfo } from '../../create/learning/learningPeriodInfo/LearningPeriodInfo';
import LearningStore from '../../create/learning/Learning.store';
import LearningContentsStore from '../../create/learning/learningPlan/LearningContents/LearningContents.store';
import CardDetailStore from '../../detail/CardDetail.store';

interface Param extends Params {
  cardId: string;
}

const CardApprovalDetailPage = observer(() => {
  //
  const { cardId } = useParams<Param>();
  const { langSupports, name, hasPrerequisite } = CardCreateStore.instance;
  const { activeIndex, isApprovalDetailLoading, setActiveIndex, setIsApprovalDetailLoading, setNewRemark } =
    CardApprovalDetailStore.instance;

  const { reset } = CardDetailStore.instance;
  const { reset: createReset } = CardCreateStore.instance;
  const { reset: learningReset, studentEnrollmentType } = LearningStore.instance;
  const { reset: learningContentReset } = LearningContentsStore.instance;

  const { data: UserGroups, isLoading: isUserGroupsLoading } = useFindAllUserGroup();
  const mutation = useFindCardByIdMutation();

  const openedMutation = useOpenedCard();
  const rejectedMutation = useRejectedCard();

  useEffect(() => {
    //
    reset();
    createReset();
    learningReset();
    learningContentReset();

    setActiveIndex(-1);
    setIsApprovalDetailLoading(true);
  }, [cardId]);

  useEffect(() => {
    //
    findCardById();
  }, [isUserGroupsLoading]);

  const findCardById = async () => {
    //
    const userGroupMap = getUserGroupMap(UserGroups?.results || []);

    const cardWithContentsAndRelatedCount = await mutation.mutateAsync(cardId);

    if (cardWithContentsAndRelatedCount) {
      await setCardCreateByCardContents(userGroupMap, cardWithContentsAndRelatedCount, mutation);
      await setCardLearningByCardContents(cardWithContentsAndRelatedCount);
    }

    setIsApprovalDetailLoading(false);
  };

  const onClickAccordion = (e: any, titleProps: any) => {
    //
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;

    setActiveIndex(newIndex);
  };

  const onClickOpened = () => {
    //
    confirm(
      ConfirmModel.getApprovalConfirm('Card', () => {
        setIsApprovalDetailLoading(true);
        openedMutation.mutateAsync(cardId).then(() => {
          alert(AlertModel.getApprovalSuccessAlert(() => findCardById()));
        });
      }),
      false
    );
  };

  const onClickRejected = () => {
    //
    const { newRemark } = CardApprovalDetailStore.instance;

    rejectedMutation.mutateAsync(getRejectedParams(cardId, newRemark)).then(() => {
      //
      setNewRemark('');
      setIsApprovalDetailLoading(true);
      findCardById();
    });
  };

  return (
    <>
      <Container>
        <Form>
          <PageTitle breadcrumb={cardApprovalBreadcrumb} />

          <Header as="h3" className="learning-tit">
            {getPolyglotToAnyString(name)}
          </Header>

          <Polyglot languages={langSupports}>
            {/*승인 정보*/}
            <DimmerLoader active={isApprovalDetailLoading}>
              <CardApprovalInfo onClickOpen={onClickOpened} onClickReject={onClickRejected} />
            </DimmerLoader>

            {/*기본 정보*/}
            <Accordion fluid>
              <Accordion.Title active={activeIndex === 1} index={1} onClick={onClickAccordion}>
                <Segment>
                  <Icon name="dropdown" />
                  기본 정보
                </Segment>
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 1}>
                <CardBasicInfo readonly />
              </Accordion.Content>

              {/*노출 정보*/}
              <Accordion.Title active={activeIndex === 2} index={2} onClick={onClickAccordion}>
                <Segment>
                  <Icon name="dropdown" />
                  노출 정보
                </Segment>
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 2}>
                <CardExposureInfo readonly />
              </Accordion.Content>

              {/*접근 제어*/}
              <Accordion.Title active={activeIndex === 3} index={3} onClick={onClickAccordion}>
                <Segment>
                  <Icon name="dropdown" />
                  접근 제어 정보
                </Segment>
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 3}>
                <AccessRuleSettings readOnly multiple={false} />
              </Accordion.Content>

              {/*선수 Card 정보*/}
              {hasPrerequisite === 'Yes' && (
                <>
                  <Accordion.Title active={activeIndex === 4} index={4} onClick={onClickAccordion}>
                    <Segment>
                      <Icon name="dropdown" />
                      선수 Card 정보
                    </Segment>
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === 4}>
                    <PreRequisiteCard readonly />
                  </Accordion.Content>
                </>
              )}

              {/*부가 정보*/}
              <Accordion.Title active={activeIndex === 5} index={5} onClick={onClickAccordion}>
                <Segment>
                  <Icon name="dropdown" />
                  부가 정보
                </Segment>
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 5}>
                <CardAdditionalInfo readonly />
              </Accordion.Content>

              {/*추가 정보*/}
              <Accordion.Title active={activeIndex === 6} index={6} onClick={onClickAccordion}>
                <Segment>
                  <Icon name="dropdown" />
                  Report/Survey/Test
                </Segment>
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 6}>
                <CardMoreInfo readonly />
              </Accordion.Content>

              {/*과정 기간 정보*/}
              <Accordion.Title active={activeIndex === 7} index={7} onClick={onClickAccordion}>
                <Segment>
                  <Icon name="dropdown" />
                  과정 기본 정보
                </Segment>
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 7}>
                <LearningPeriodInfo readonly />
              </Accordion.Content>

              {/*차수 운영 정보*/}
              {studentEnrollmentType === 'Enrollment' && (
                <>
                  <Accordion.Title active={activeIndex === 8} index={8} onClick={onClickAccordion}>
                    <Segment>
                      <Icon name="dropdown" />
                      차수 운영 정보
                    </Segment>
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === 8}>
                    <RoundInfo readonly />
                  </Accordion.Content>
                </>
              )}

              {/*Chapter / Cube / Talk List 정보 정보*/}
              <Accordion.Title active={activeIndex === 9} index={9} onClick={onClickAccordion}>
                <Segment>
                  <Icon name="dropdown" />
                  Chapter / Cube / Talk List 정보
                </Segment>
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 9}>
                <LearningPlan readonly />
              </Accordion.Content>
            </Accordion>
          </Polyglot>
        </Form>
      </Container>
      <TestSheetModalContainer />
    </>
  );
});

export default CardApprovalDetailPage;
