import moment from 'moment';

import { CardService } from '../../index';

import { PatronKey, PolyglotModel, CubeType } from 'shared/model';
import { LoaderService } from 'shared/components/Loader';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { SurveyFormService } from '../../../../survey';

import { cardStateDisplay, divisionCategories } from './CardHelper';

import { CubeService } from '../../../../cube';
import { findCommunity } from '../../../../community/community';
import { CubeWithContents } from '../../../../cube/cube';
import Discussion from '../../../../discussion/model/Discussion';
import { DiscussionService } from '../../../../discussion';
import MemberService from '../../../../approval/present/logic/MemberService';
import { InstructorService } from '../../../../instructor/instructor';

import { CardStates } from '../../../../_data/lecture/cards/model/vo/CardStates';
import { CardOpenResponse } from '../../model/vo/CardOpenResponse';
import { LearningContentModel } from '../../../../_data/lecture/cards/model/vo/LearningContentModel';
import { LearningContentType } from '../../model/vo/LearningContentType';
import CardInstructorsModel from '../../model/vo/CardInstructorsModel';
import { CubeTermModel } from '../../../../cube/cube/model/CubeTermModel';
import { PrerequisiteCard } from '../../../../_data/lecture/cards/model/vo/PrerequisiteCard';
import { InstructorWithUserIdentity } from '../../../../instructor/instructor/model/InstructorWithUserIdentity';

export async function setPrerequisiteCards(cardService: CardService) {
  //
  const { cardContentsQuery, findCardsForAdminByIds, setPrerequisiteCards, changeCardContentsQueryProps } = cardService;

  const prerequisiteCards = [...cardContentsQuery.prerequisiteCards];
  const newPrerequisiteCards: PrerequisiteCard[] = [];

  const ids = prerequisiteCards.map((cards) => cards.prerequisiteCardId);

  if (ids.length === 0) return;

  const cards = await findCardsForAdminByIds(ids);
  await setPrerequisiteCards(cards);

  await prerequisiteCards.forEach((preCard) => {
    cards.forEach((cardWiths) => {
      const { card } = cardWiths;
      if (card.id === preCard.prerequisiteCardId) {
        newPrerequisiteCards.push(
          new PrerequisiteCard({
            ...preCard,
            groupBasedAccessRule: card.groupBasedAccessRule,
          })
        );
      }
    });
  });

  changeCardContentsQueryProps('prerequisiteCards', newPrerequisiteCards);

  LoaderService.instance.closeLoader(true, 'prerequisite');
}

// export async function setCardOperator(cardService: CardService, memberService: MemberService) {
//   //
//   const { changeCardContentsQueryProps } = cardService;
//
//   const operator = await memberService.findMemberById(cardService.cardContentsQuery.cardOperator.id);
//
//   changeCardContentsQueryProps('cardOperator.name', operator.name);
//   changeCardContentsQueryProps('cardOperator.email', operator.email);
//   changeCardContentsQueryProps('cardOperator.companyCode', operator.companyCode);
//   changeCardContentsQueryProps(
//     'cardOperator.companyName',
//     MemberViewModel.getLanguageStringByLanguage(operator.companyNames, operator.companyNames.defaultLanguage)
//   );
// }

export async function setRelatedCards(cardService: CardService) {
  //
  const { cardContentsQuery, findCardsForAdminByIds, setRelatedCards } = cardService;

  const ids = cardContentsQuery.relatedCards && cardContentsQuery.relatedCards.map((cards) => cards.relatedCardId);

  if (!ids || ids.length === 0) return;

  const cards = await findCardsForAdminByIds(ids);
  await setRelatedCards(cards);
}

export async function setCubeInfoAndTerm(
  cardService: CardService,
  cubeService: CubeService,
  collegesMap: Map<string, string>,
  channelMap: Map<string, string>
) {
  //
  const { cardContentsQuery } = cardService;
  const { findCubeWithContentsByIds } = cubeService;

  const { learningContents } = cardContentsQuery;

  if (learningContents.length === 0) return;

  const cubeIds: string[] = [];
  const cubeMap = new Map<string, CubeWithContents>();

  learningContents &&
    learningContents.forEach((contents) => {
      if (contents.learningContentType === LearningContentType.Chapter) {
        contents.children &&
          contents.children.forEach((cContents) => {
            if (cContents.learningContentType === LearningContentType.Cube) {
              cubeIds.push(cContents.contentId);
            }
          });
      } else if (contents.learningContentType === LearningContentType.Cube) {
        cubeIds.push(contents.contentId);
      }
    });

  const cubeWithContents = await findCubeWithContentsByIds(cubeIds);

  await setTerm(cubeWithContents, cardService);

  await cubeWithContents.map((cubeWithContent) => cubeMap.set(cubeWithContent.cube.id, cubeWithContent));

  await learningContents?.forEach((content, index) => {
    if (content.learningContentType === LearningContentType.Chapter) {
      content.children?.forEach((cContent, cIndex) => {
        if (cContent.learningContentType === LearningContentType.Cube) {
          const cubeWithContent = cubeMap.get(cContent.contentId);

          if (cubeWithContent) {
            const contents = getLearningContentCube(cubeWithContent, collegesMap, channelMap);

            cardService.changeChildrenLearningContentProps(index, cIndex, 'id', contents.id);
            cardService.changeChildrenLearningContentProps(index, cIndex, 'name', contents.name);
            cardService.changeChildrenLearningContentProps(
              index,
              cIndex,
              'contentDetailType',
              contents.contentDetailType
            );
            cardService.changeChildrenLearningContentProps(index, cIndex, 'time', contents.time);
            cardService.changeChildrenLearningContentProps(index, cIndex, 'registrantName', contents.registrantName);
            cardService.changeChildrenLearningContentProps(index, cIndex, 'channel', contents.channel);
          }
        }
      });
    } else if (content.learningContentType === LearningContentType.Cube) {
      const cubeWithContent = cubeMap.get(content.contentId);

      if (cubeWithContent) {
        const contents = getLearningContentCube(cubeWithContent, collegesMap, channelMap);

        cardService.changeCardContentsLearningContentProps(index, 'id', contents.id);
        cardService.changeCardContentsLearningContentProps(index, 'name', contents.name);
        cardService.changeCardContentsLearningContentProps(index, 'contentDetailType', contents.contentDetailType);
        cardService.changeCardContentsLearningContentProps(index, 'time', contents.time);
        cardService.changeCardContentsLearningContentProps(index, 'registrantName', contents.registrantName);
        cardService.changeCardContentsLearningContentProps(index, 'channel', contents.channel);
      }
    }
  });
}

function setTerm(cubeWithContents: CubeWithContents[], cardService: CardService) {
  //
  const concepts: CubeTermModel[] = [];

  cubeWithContents?.forEach((cubeWithContent) => {
    cubeWithContent.cubeContents?.terms?.forEach((concept) => {
      //
      let newConceptId: string = '';

      concepts.forEach((value, index) => {
        if (value.id === concept.id) {
          const prevTerms = value.terms;
          const newTerms = [...prevTerms];

          concept.terms.forEach((term) => {
            if (prevTerms.filter((pTerm) => pTerm.id === term.id).length === 0) {
              newTerms.push(term);
            }
          });

          value.terms = newTerms;

          concepts[index] = value;

          newConceptId = value.id;
        }
      });

      // 먼저 선택한 Cube 에 해당 Concept 이 없으면
      if (newConceptId === '') {
        concepts.push(concept);
      }
    });
  });

  cardService.changeCardContentsQueryProps('terms', concepts);

  LoaderService.instance.closeLoader(true, 'exposure');
}

export async function setDiscussionInfo(cardService: CardService, discussionService: DiscussionService) {
  //
  const { cardContentsQuery, changeCardContentsLearningContentProps, changeChildrenLearningContentProps } = cardService;

  const learningContents = cardContentsQuery.learningContents;

  const discussionIds: string[] = [];
  // const discussionMap = new Map<string, Discussion>();

  await learningContents?.forEach((contents) => {
    if (contents.learningContentType === LearningContentType.Chapter) {
      contents.children?.forEach((cContents) => {
        if (cContents.learningContentType === LearningContentType.Discussion) {
          discussionIds.push(cContents.contentId);
        }
      });
    } else if (contents.learningContentType === LearningContentType.Discussion) {
      discussionIds.push(contents.contentId);
    }
  });

  const discussionMap = await getDiscussion(discussionIds, discussionService);

  await learningContents?.forEach((content, index) => {
    if (content.learningContentType === LearningContentType.Chapter) {
      content.children?.forEach((cContents, cIndex) => {
        if (cContents.learningContentType === LearningContentType.Discussion) {
          const discussion = discussionMap.get(cContents.contentId);

          if (discussion) {
            changeChildrenLearningContentProps(index, cIndex, 'discussion', { ...discussion });
          }
        }
      });
    } else if (content.learningContentType === LearningContentType.Discussion) {
      const discussion = discussionMap.get(content.contentId);

      if (discussion) {
        changeCardContentsLearningContentProps(index, 'discussion', { ...discussion });
      }
    }
  });
}

async function getDiscussion(discussionIds: string[], discussionService: DiscussionService) {
  //
  const discussionMap = new Map<string, Discussion>();

  await Promise.all(
    discussionIds.map(async (feedbackId, index) => {
      const discussion = await discussionService.findDiscussion(feedbackId);

      discussionMap.set(discussion.id, discussion);
    })
  );

  await discussionService.clearDiscussion();

  return discussionMap;
}

function getLearningContentCube(
  cubeWithContent: CubeWithContents,
  collegesMap: Map<string, string>,
  channelMap: Map<string, string>
) {
  //
  const { mainCategory } = divisionCategories(cubeWithContent ? cubeWithContent.cube.categories : []);

  const channel = `${collegesMap.get(mainCategory.collegeId)} > ${channelMap.get(mainCategory.channelId)}`;

  return LearningContentModel.asCube(
    cubeWithContent ? cubeWithContent.cube.id : '',
    cubeWithContent ? cubeWithContent.cube.name : new PolyglotModel(),
    cubeWithContent ? cubeWithContent.cube.type : CubeType.Empty,
    cubeWithContent ? cubeWithContent.cube.registeredTime : 0,
    cubeWithContent ? cubeWithContent.cubeContents.registrantName : new PolyglotModel(),
    channel
  );
}

export async function setInstructorInfo(cardService: CardService, instructorService: InstructorService) {
  //
  const { cardContentsQuery, changeCardContentsQueryProps } = cardService;
  const { instructors } = cardContentsQuery;

  if (instructors.length === 0) return;

  const ids = instructors.map((instructor) => instructor.instructorId);
  // const ids = ['IS-0001', 'IS-0002', 'IS-0003']; // Sample

  const instructorsMap = new Map<string, InstructorWithUserIdentity>();
  const newInstructors: CardInstructorsModel[] = [];

  await instructorService.findInstructorsByIds(ids);

  await instructorService.instructors?.forEach((instructorWiths) => {
    instructorsMap.set(instructorWiths.instructor.id, instructorWiths);
  });

  await instructors?.forEach((cardInstructor) => {
    const { instructor, user } = instructorsMap.get(cardInstructor.instructorId) || new InstructorWithUserIdentity();
    newInstructors.push(
      CardInstructorsModel.asCardInstructorsModel(
        instructor.id,
        getPolyglotToAnyString(user.name) || getPolyglotToAnyString(instructor.name),
        getPolyglotToAnyString(user.departmentName) || getPolyglotToAnyString(instructor.organization),
        user.email || instructor.email,
        cardInstructor.representative
      )
    );
  });

  await changeCardContentsQueryProps('instructors', [...newInstructors]);
}

export async function setSurvey(cardService: CardService, surveyFormService: SurveyFormService) {
  //
  const { cardContentsQuery, changeCardContentsQueryProps } = cardService;

  if (!cardContentsQuery.surveyCaseId) return;

  if (cardContentsQuery.surveyTitle === '') {
    await surveyFormService.findSurveyForm(cardContentsQuery.surveyId);

    changeCardContentsQueryProps('surveyTitle', surveyFormService.surveyForm.title);
    changeCardContentsQueryProps('surveyDesignerName', surveyFormService.surveyForm.formDesignerName);
  }
}

export function getApprovalInfo(cardService: CardService, memberService: MemberService) {
  //
  const { cardQuery, cardContentsQuery } = cardService;

  // Open 일 때만 시간, 이름
  if (cardQuery.cardState === CardStates.Opened || cardQuery.cardState === CardStates.Rejected) {
    const request = cardContentsQuery.openRequests[cardContentsQuery.openRequests.length - 1];

    const response = request && request.response ? request.response : new CardOpenResponse();

    const res = response.approver ? response : { time: 0, approver: new PatronKey() };

    const {
      time,
      approver: { keyString },
    } = res;

    const remark = response.remark ? response.remark : '';

    let employeeName = '';
    return keyString !== ''
      ? memberService
          .findMemberById(keyString)
          .then((response) => (employeeName = getPolyglotToAnyString(response.name)))
          .then(() => ({
            approvalInfo: `${moment(time).format('YYYY.MM.DD HH:mm:ss')} | ${cardStateDisplay(cardQuery.cardState)} | ${
              employeeName || ''
            }`,
            remark,
          }))
          .catch(() => ({
            approvalInfo: `${moment(time).format('YYYY.MM.DD HH:mm:ss')} | ${cardStateDisplay(cardQuery.cardState)}`,
            remark,
          }))
      : {
          approvalInfo: cardStateDisplay(cardQuery.cardState),
          remark,
        };
  } else {
    return {
      approvalInfo: cardStateDisplay(cardQuery.cardState),
      remark: '',
    };
  }
}

export async function setCommunity(cardService: CardService) {
  //
  const { cardContentsQuery, changeCardContentsQueryProps } = cardService;

  const community = await findCommunity(cardContentsQuery.communityId);

  changeCardContentsQueryProps('communityName', community?.name);
}
