import { uuidv4 } from 'shared/helper';
import { CubeDetail } from '_data/cube/model/CubeDetail';
import { CubeWithReactiveModel } from 'cube/cube';
import LearningContentsStore from './LearningContents.store';
import { LearningContentWithOptional } from '../../LearningContents/model/learningContentWithOptional';
import { CardDiscussion } from '../../../../../_data/lecture/cards/model/CardDiscussion';
import { findCubesDetailsByIds } from '../../../../../_data/cube/api/cubeApis';
import { LearningContentType } from '../../../../card/model/vo/LearningContentType';
import { setCardInstructors, setCardLearningTime } from '../../CardLearningInfoPage.util';

/**
 * 선택된 LearningContents Cube 선택 모달 체크 여부를 위한 목록으로 변환
 */
export function getSelectedCubes(): CubeWithReactiveModel[] {
  //
  const { learningContents } = LearningContentsStore.instance;

  const result: CubeWithReactiveModel[] = [];

  learningContents.map((learningContent) => {
    //
    if (learningContent.learningContentType === 'Cube') {
      //
      const cube = new CubeWithReactiveModel();
      cube.cubeId = learningContent.contentId;

      result.push(cube);
    } else if (learningContent.learningContentType === 'Chapter') {
      //
      learningContent.children?.forEach((children) => {
        //
        if (children.learningContentType === 'Cube') {
          //
          const cube = new CubeWithReactiveModel();
          cube.cubeId = children.contentId;

          result.push(cube);
        }
      });
    }
  });

  return result;
}

/**
 * Cube 선택 모달에서 OK 눌렀을 때 함수
 * @param selectedCubes
 */
export async function onOkCubeSelect(selectedCubes: CubeWithReactiveModel[]) {
  //
  const { learningContents, setLearningContents } = LearningContentsStore.instance;

  const cubeIds = selectedCubes.map((selectedCube) => selectedCube.cubeId);

  const contentCubeIds: string[] = [];
  const nextLearningContents: LearningContentWithOptional[] = [];
  const cubeDetails: CubeDetail[] = (cubeIds.length > 0 && (await findCubesDetailsByIds(cubeIds))) || [];

  learningContents &&
    learningContents.forEach((content) => {
      if (content.learningContentType === 'Chapter') {
        const newChildren: LearningContentWithOptional[] = [];

        content.children &&
          content.children.forEach((cContent) => {
            if (cContent.learningContentType === 'Cube') {
              contentCubeIds.push(cContent.contentId);

              if (cubeIds.includes(cContent.contentId)) {
                newChildren.push({ ...cContent });
              }
            } else {
              newChildren.push({ ...cContent });
            }
          });

        const children = [...newChildren];

        newChildren.length > 0 && nextLearningContents.push({ ...content, children });
      } else if (content.learningContentType === LearningContentType.Cube) {
        contentCubeIds.push(content.contentId);

        if (cubeIds.includes(content.contentId)) {
          nextLearningContents.push({ ...content });
        }
      } else {
        nextLearningContents.push({ ...content });
      }
    });

  selectedCubes &&
    selectedCubes.forEach((selectedCube) => {
      if (!contentCubeIds.includes(selectedCube.cubeId)) {
        contentCubeIds.push(selectedCube.cubeId);

        const cubeDetail = cubeDetails.find((cubeDetail) => cubeDetail.cube.id === selectedCube.cubeId);

        nextLearningContents.push({
          chapter: false,
          contentId: selectedCube.cubeId,
          contentDetailType: selectedCube.type,
          name: selectedCube.name,
          parentId: '',
          learningContentType: 'Cube',
          enrollmentRequired: false,
          cubeWithMaterial: cubeDetail,
        } as LearningContentWithOptional);
      }
    });

  setLearningContents(nextLearningContents);

  // // 이미 선택되어 있던 Cube 는 그대로 냅두고
  // // 선택 해제된 Cube 는 제거 한 후에
  // const { contents, residualCubeIds } = getLearningContentsWithOutNonChecked(learningContents, selectedCubes);
  //
  // nextLearningContents.push(...contents);
  //
  // // 1) 선택한 Cube의 Detail 값을 불러옴
  // const ids = selectedCubes.map((cube) => cube.cubeId) || [];
  // const cubeDetails: CubeDetail[] = (ids.length > 0 && (await findCubesDetailsByIds(ids))) || [];
  //
  // // 새로 추가된 Cube 를 뒤에 추가 한다.
  // selectedCubes.forEach((selectedCube) => {
  //   //
  //   if (!residualCubeIds.some((residualCubeId) => residualCubeId === selectedCube.cubeId)) {
  //     //
  //     const cubeDetail = cubeDetails.find((detail) => detail.cube.id === selectedCube.cubeId);
  //
  //     nextLearningContents.push({
  //       chapter: false,
  //       contentId: selectedCube.cubeId,
  //       contentDetailType: selectedCube.type,
  //       name: selectedCube.name,
  //       parentId: '',
  //       learningContentType: 'Cube',
  //       enrollmentRequired: false,
  //       cubeWithMaterial: cubeDetail,
  //     } as LearningContentWithOptional);
  //   }
  // });
  //
  // setLearningContents(nextLearningContents);

  // card의 강사 세팅
  setCardInstructors();
  // Card 학습 시간 설정
  setCardLearningTime();
}

/**
 * 선택해제된 Cube 는 제외하고, 선택되어 있는 Cube 는 남기고, 새로 선택된 Cube 는 push 해주는 함수
 * @param learningContents
 * @param selectedCubes
 */
function getLearningContentsWithOutNonChecked(
  learningContents: LearningContentWithOptional[],
  selectedCubes: CubeWithReactiveModel[]
) {
  //
  // const nextLearningContents: LearningContentWithOptional[] = [];
  // const residualCubeIds: string[] = [];
  //
  // learningContents.map((learningContent) => {
  //   //
  //   if (learningContent.learningContentType === 'Cube') {
  //     //
  //     const cube = selectedCubes.find((selectedCube) => selectedCube.cubeId === learningContent.contentId);
  //
  //     if (cube) {
  //       //
  //       residualCubeIds.push(learningContent.contentId);
  //       nextLearningContents.push(learningContent);
  //     }
  //   } else if (learningContent.learningContentType === 'Chapter') {
  //     //
  //     const children = learningContent.children;
  //
  //     // children 없는 Chapter 는 없음
  //     if (children) {
  //       const { contents, residualCubeIds } = getLearningContentsWithOutNonChecked(children, selectedCubes);
  //
  //       residualCubeIds.push(...residualCubeIds);
  //       nextLearningContents.push({
  //         ...learningContent,
  //         children: contents,
  //       });
  //     }
  //   } else {
  //     nextLearningContents.push(learningContent);
  //   }
  // });
  //
  // return { contents: nextLearningContents, residualCubeIds };
}

/**
 * 토론 OK 눌렀을 때 함수
 * @param discussion
 */
export function onOkDiscussion(discussion: CardDiscussion) {
  //
  const { learningContents, setLearningContents } = LearningContentsStore.instance;

  const nextLearningContents: LearningContentWithOptional[] = [];
  let isDiscussionUpdate: boolean = false;

  // LearningContent 를 다 훑으면서 Discussion 이면서 contentId 와 id 가 같으면
  // 새로 생성이 아닌 수정으로 판별
  // 값 들을 새로 들어온 discussion 으로 수정하고 LearningContents 에 추가
  learningContents.map((learningContent) => {
    //
    if (learningContent.learningContentType === 'Chapter') {
      //
      const children: LearningContentWithOptional[] = [];

      if (learningContent.children) {
        //
        learningContent.children.map((childrenLearningContent) => {
          if (
            childrenLearningContent.learningContentType === 'Discussion' &&
            childrenLearningContent.contentId === discussion.id
          ) {
            //
            isDiscussionUpdate = true;
            children.push({
              ...childrenLearningContent,
              contentId: discussion.id,
              name: discussion.title,
              cardDiscussion: discussion,
              inChapter: false,
              selected: false,
            } as LearningContentWithOptional);
          } else {
            //
            children.push(childrenLearningContent);
          }
        });
        nextLearningContents.push({ ...learningContent, children });
      }
    } else if (learningContent.learningContentType === 'Discussion' && learningContent.contentId === discussion.id) {
      //
      isDiscussionUpdate = true;
      nextLearningContents.push({
        ...learningContent,
        contentId: discussion.id,
        name: discussion.title,
        cardDiscussion: discussion,
        inChapter: false,
        selected: false,
      } as LearningContentWithOptional);
    } else {
      //
      nextLearningContents.push(learningContent);
    }
  });

  // isDiscussionUpdate 가 ture 면 수정이고,
  // false 이면 새로 생성된 Discussion 이기 때문에 LearningContents 맨 마지막에 붙여준다.
  // 새로 생성된 Discussion 이기 때문에 contentId 가 없어서 uuidv4 로 랜덤 Id 부여
  const newId = uuidv4();

  !isDiscussionUpdate
    ? setLearningContents([
        ...nextLearningContents,
        {
          chapter: false,
          contentId: newId,
          name: discussion.title,
          parentId: '',
          learningContentType: 'Discussion',
          cardDiscussion: { ...discussion, id: newId },
          contentDetailType: '',
          selected: false,
          inChapter: false,
          enrollmentRequired: false,
        } as LearningContentWithOptional,
      ])
    : setLearningContents([...nextLearningContents]);
}
