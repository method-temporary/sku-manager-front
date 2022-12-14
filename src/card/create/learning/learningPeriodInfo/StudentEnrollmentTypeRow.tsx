import React from 'react';
import { observer } from 'mobx-react';
import { Form, Table } from 'semantic-ui-react';
import { confirm, ConfirmModel, RadioGroup } from 'shared/components';
import LearningStore from '../Learning.store';
import CardDetailStore from '../../../detail/CardDetail.store';
import { StudentEnrollmentType } from '../../../../_data/lecture/cards/model/vo/StudentEnrollmentType';
import EnrollmentCubeStore from '../learningPlan/enrollmentCube/EnrollmentCube.store';
import LearningContentsStore from '../learningPlan/LearningContents/LearningContents.store';
import { LearningContentWithOptional } from '../LearningContents/model/learningContentWithOptional';

interface Props {
  //
  readonly?: boolean;
}

const StudentEnrollmentTypeRow = observer(({ readonly }: Props) => {
  //
  const { cardState } = CardDetailStore.instance;
  const { studentEnrollmentType, setStudentEnrollmentType } = LearningStore.instance;
  const { reset: enrollmentCubeReset } = EnrollmentCubeStore.instance;
  const { learningContents, setLearningContents } = LearningContentsStore.instance;

  const onChangeStudentEnrollmentType = (studentEnrollmentType: StudentEnrollmentType) => {
    //

    if (studentEnrollmentType === 'Anyone') {
      //
      let isEnrollment: boolean = false;
      const nextLearningContents: LearningContentWithOptional[] = [];

      learningContents?.map((learningContent) => {
        //
        if (learningContent.learningContentType === 'Chapter') {
          //
          const children = learningContent.children;
          const nextChildren: LearningContentWithOptional[] = [];

          if (children) {
            //
            children.map((childrenLearningContent) => {
              //
              if (childrenLearningContent.learningContentType === 'Cube') {
                //
                if (childrenLearningContent.enrollmentRequired) {
                  isEnrollment = true;
                } else {
                  nextChildren.push(childrenLearningContent);
                }
              } else {
                nextChildren.push(childrenLearningContent);
              }
            });

            nextLearningContents.push({ ...learningContent, children: nextChildren });
          }
        } else if (learningContent.learningContentType === 'Cube') {
          //
          if (learningContent.enrollmentRequired) {
            isEnrollment = true;
          } else {
            nextLearningContents.push(learningContent);
          }
        } else {
          nextLearningContents.push(learningContent);
        }
      });

      if (isEnrollment) {
        //
        confirm(
          ConfirmModel.getCustomConfirm(
            '??????',
            '??????????????? ?????????, ???????????? E-learning, Classroom ??? ???????????????. \n?????????????????????????',
            true,
            '??????',
            '??????',
            () => {
              setLearningContents(nextLearningContents);
              setStudentEnrollmentType(studentEnrollmentType);
              enrollmentCubeReset();
            }
          )
        );
      } else {
        setStudentEnrollmentType(studentEnrollmentType);
        enrollmentCubeReset();
      }
    } else {
      setStudentEnrollmentType(studentEnrollmentType);
    }
  };

  return (
    <>
      <Table.Row>
        <Table.Cell className="tb-header">
          ?????? ??????<span className="required"> *</span>
        </Table.Cell>
        <Table.Cell colSpan={3}>
          {!readonly ? (
            <>
              <Form.Group>
                <RadioGroup
                  value={studentEnrollmentType}
                  values={['Anyone', 'Enrollment']}
                  labels={['?????????', '???????????????']}
                  disabled={cardState === 'Opened'}
                  onChange={(e: any, data: any) => onChangeStudentEnrollmentType(data.value)}
                />
              </Form.Group>
              <div>
                <span className="span-information">
                  * ????????? : ?????? ?????? ?????? ??????????????? ?????? ????????? ??? ?????? ?????? (Classroom / E-learning ?????? ??????)
                </span>
              </div>
              <div>
                <span className="span-information">
                  * ??????????????? : ??????????????? ????????? ?????? ????????? ????????????, ???????????? ?????? ??? ????????? ??? ?????? ?????? (Classroom
                  / E-learning ?????? ??????)
                </span>
              </div>
            </>
          ) : (
            <>{studentEnrollmentType === 'Anyone' ? '?????????' : '???????????????'}</>
          )}
        </Table.Cell>
      </Table.Row>
    </>
  );
});

export default StudentEnrollmentTypeRow;
