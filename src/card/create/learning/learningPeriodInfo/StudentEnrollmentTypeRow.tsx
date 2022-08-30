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
            '알림',
            '상시형으로 변경시, 등록하신 E-learning, Classroom 이 지워집니다. \n변경하시겠습니까?',
            true,
            '확인',
            '취소',
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
          과정 유형<span className="required"> *</span>
        </Table.Cell>
        <Table.Cell colSpan={3}>
          {!readonly ? (
            <>
              <Form.Group>
                <RadioGroup
                  value={studentEnrollmentType}
                  values={['Anyone', 'Enrollment']}
                  labels={['상시형', '수강신청형']}
                  disabled={cardState === 'Opened'}
                  onChange={(e: any, data: any) => onChangeStudentEnrollmentType(data.value)}
                />
              </Form.Group>
              <div>
                <span className="span-information">
                  * 상시형 : 승인 절차 없이 학습자들이 바로 학습할 수 있는 형태 (Classroom / E-learning 유형 제외)
                </span>
              </div>
              <div>
                <span className="span-information">
                  * 수강신청형 : 학습자들이 원하는 교육 기간을 선택하고, 승인권자 승인 후 학습할 수 있는 형태 (Classroom
                  / E-learning 유형 포함)
                </span>
              </div>
            </>
          ) : (
            <>{studentEnrollmentType === 'Anyone' ? '상시형' : '수강신청형'}</>
          )}
        </Table.Cell>
      </Table.Row>
    </>
  );
});

export default StudentEnrollmentTypeRow;
