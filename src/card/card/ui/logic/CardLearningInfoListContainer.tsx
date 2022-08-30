import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';

import { CubeType } from 'shared/model';
import { alert, AlertModel } from 'shared/components';

import { CardService } from '../../index';
import { InstructorService } from '../../../../instructor/instructor';
import { LearningContentType } from '../../model/vo/LearningContentType';
import { LearningContentModel } from '../../../../_data/lecture/cards/model/vo/LearningContentModel';

import { divisionCategories } from './CardHelper';
import { setInstructorInfo } from './CardLoadQueryModelHelper';
import CardInstructorsModel from '../../model/vo/CardInstructorsModel';
import { CubeWithReactiveModel } from '../../../../cube/cube';
import CardLearningInfoView from '../view/CardLearningInfoView';
import { CubeService } from '../../../../cube';
import Discussion from '../../../../discussion/model/Discussion';
import { CubeTermModel } from '../../../../cube/cube/model/CubeTermModel';

interface Props {
  isUpdatable: boolean;
  cineroomId: string;
  cardService: CardService;
  instructorService?: InstructorService;
  cubeService?: CubeService;
  collegesMap: Map<string, string>;
  channelMap: Map<string, string>;
}

@observer
@reactAutobind
class CardLearningInfoListContainer extends React.Component<Props> {
  //
  onClickAddDiscussion(discussion: Discussion, index: number, pIndex: number) {
    //
    const { cardContentsQuery, changeCardContentsQueryProps, changeChildrenLearningContentProps } =
      this.props.cardService;
    const copiedContents = [...cardContentsQuery.learningContents];

    if ((index === 0 || index > -1) && (pIndex === 0 || pIndex > -1)) {
      // Chapter 안의 Discussion
      changeChildrenLearningContentProps(pIndex, index, 'id', discussion.id);
      changeChildrenLearningContentProps(pIndex, index, 'discussion', discussion);
      changeChildrenLearningContentProps(pIndex, index, 'name', discussion.title);
    } else if (index === 0 || index > -1) {
      // Learning 안의 Discussion
      changeCardContentsQueryProps(`learningContents[${index}].id`, discussion.id);
      changeCardContentsQueryProps(`learningContents[${index}].discussion`, discussion);
      changeCardContentsQueryProps(`learningContents[${index}].name`, discussion.title);
    } else {
      // 새로 추가된 Discussion
      copiedContents.push(LearningContentModel.asDiscussion(discussion.title, discussion));
      changeCardContentsQueryProps('learningContents', copiedContents);
    }
  }

  onClickDeleteLearningContents(index: number) {
    //
    const { cardContentsQuery, changeCardContentsQueryProps } = this.props.cardService;

    const copiedLearningContents = [...cardContentsQuery.learningContents];

    const removeList = this.removeInList(index, copiedLearningContents);

    changeCardContentsQueryProps('learningContents', removeList);

    this.setInstructorAndTerm();
  }

  onClickSortLearningContents(learningContentModel: LearningContentModel, seq: number, newSeq: number) {
    //
    const { cardContentsQuery, changeCardContentsQueryProps } = this.props.cardService;
    const copiedLearningContents = [...cardContentsQuery.learningContents];

    copiedLearningContents.splice(seq, 1);
    copiedLearningContents.splice(newSeq, 0, learningContentModel);

    changeCardContentsQueryProps('learningContents', copiedLearningContents);
  }

  onClickCubeListOk(cubes: CubeWithReactiveModel[], cubeIds: string[]) {
    //
    const { cardService, collegesMap, channelMap } = this.props;
    const { cardContentsQuery, changeCardContentsQueryProps } = cardService;
    const copiedContents = [...cardContentsQuery.learningContents];
    const contentCubeIds: string[] = [];
    const newLearningContents: LearningContentModel[] = [];

    copiedContents &&
      copiedContents.forEach((content) => {
        if (content.learningContentType === LearningContentType.Chapter) {
          const newChildren: LearningContentModel[] = [];

          content.children &&
            content.children.forEach((cContent) => {
              if (cContent.learningContentType === LearningContentType.Cube) {
                contentCubeIds.push(cContent.contentId);

                if (cubeIds.includes(cContent.contentId)) {
                  newChildren.push({ ...cContent });
                }
              } else {
                newChildren.push({ ...cContent });
              }
            });

          const children = [...newChildren];

          newChildren.length > 0 && newLearningContents.push({ ...content, children });
        } else if (content.learningContentType === LearningContentType.Cube) {
          contentCubeIds.push(content.contentId);

          if (cubeIds.includes(content.contentId)) {
            newLearningContents.push({ ...content });
          }
        } else {
          newLearningContents.push({ ...content });
        }
      });

    cubes &&
      cubes.forEach((cubeWiths) => {
        // const { cube, cubeContents } = cubeWiths;

        if (!contentCubeIds.includes(cubeWiths.cubeId)) {
          const { mainCategory } = divisionCategories(cubeWiths.categories);
          const channel = `${collegesMap.get(mainCategory.collegeId)} > ${channelMap.get(mainCategory.channelId)}`;

          contentCubeIds.push(cubeWiths.cubeId);

          newLearningContents.push(
            LearningContentModel.asCube(
              cubeWiths.cubeId,
              cubeWiths.name,
              cubeWiths.type,
              cubeWiths.registeredTime,
              cubeWiths.registrantName,
              channel
            )
          );
        }
      });

    if (this.checkCubeType(newLearningContents)) {
      alert(
        AlertModel.getCustomAlert(
          false,
          'Cube 선택 안내',
          'ClassRoom 또는 E-Learning Cube는 2개 이상 선택할 수 없습니다.',
          'OK'
        )
      );

      return false;
    } else {
      changeCardContentsQueryProps('learningContents', newLearningContents);

      this.setInstructorAndTerm();

      return true;
    }
  }

  checkCubeType(learningContents: LearningContentModel[]) {
    //
    let classRoomCnt = 0;
    let eLearningCnt = 0;

    learningContents &&
      learningContents.forEach((content) => {
        if (content.learningContentType === LearningContentType.Chapter) {
          content.children &&
            content.children.forEach((cContent) => {
              if (cContent.learningContentType === LearningContentType.Cube) {
                if (cContent.contentDetailType === CubeType.ClassRoomLecture) {
                  classRoomCnt++;
                }

                if (cContent.contentDetailType === CubeType.ELearning) {
                  eLearningCnt++;
                }
              }
            });
        } else if (content.learningContentType === LearningContentType.Cube) {
          if (content.learningContentType === LearningContentType.Cube) {
            if (content.contentDetailType === CubeType.ClassRoomLecture) {
              classRoomCnt++;
            }
            if (content.contentDetailType === CubeType.ELearning) {
              eLearningCnt++;
            }
          }
        }
      });

    if (classRoomCnt > 1 || eLearningCnt > 1 || (classRoomCnt >= 1 && eLearningCnt >= 1)) {
      return true;
    }
    return false;
  }

  async setInstructorAndTerm() {
    //
    const { cardService, cubeService, instructorService } = this.props;

    const cubeIds: string[] = [];
    const instructorIds: string[] = [];
    const instructors: CardInstructorsModel[] = [];
    const concepts: CubeTermModel[] = [];

    let learningTime: number = 0;

    await cardService.cardContentsQuery.learningContents?.forEach((content) => {
      if (content.learningContentType === LearningContentType.Chapter) {
        content.children?.forEach((cContent) => {
          if (cContent.learningContentType === LearningContentType.Cube) {
            cubeIds.push(cContent.contentId);
          }
        });
      } else if (content.learningContentType === LearningContentType.Cube) {
        cubeIds.push(content.contentId);
      }
    });

    await cubeService?.findCubeWithContentsByIds(cubeIds);
    const cubeWithContents = cubeService?.cubeWithContents;

    cubeWithContents?.forEach((cubeWithContent) => {
      learningTime += cubeWithContent.cube.learningTime;

      cubeWithContent.cubeContents.instructors?.forEach((instructor) => {
        if (!instructorIds.includes(instructor.instructorId)) {
          instructorIds.push(instructor.instructorId);
          instructors.push(CardInstructorsModel.asCardInstructorsModel(instructor.instructorId, '', '', '', false));
        }
      });

      cubeWithContent.cubeContents.terms &&
        cubeWithContent.cubeContents.terms.forEach((concept) => {
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

    cardService.changeCardQueryProps('learningTime', learningTime);

    cardService.changeCardContentsQueryProps('terms', concepts);
    cardService.changeCardContentsQueryProps('instructors', instructors);

    instructorService && setInstructorInfo(cardService, instructorService);
  }

  // select remove
  removeInList(index: number, oldList: any[]) {
    //
    return oldList.slice(0, index).concat(oldList.slice(index + 1));
  }

  render() {
    //
    const { isUpdatable, cineroomId, cardService } = this.props;

    return (
      <CardLearningInfoView
        isUpdatable={isUpdatable}
        cineroomId={cineroomId}
        cardService={cardService}
        onClickAddDiscussion={this.onClickAddDiscussion}
        onClickDeleteLearningContents={this.onClickDeleteLearningContents}
        onClickSortLearningContents={this.onClickSortLearningContents}
        onClickCubeListOk={this.onClickCubeListOk}
      />
    );
  }
}

export default CardLearningInfoListContainer;
