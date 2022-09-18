import { alert, AlertModel, confirm, ConfirmModel } from 'shared/components';
import { getCurrentHistory } from 'shared/store';

import { setTestPreviewModalViewModel } from 'exam/store/TestPreviewModalStore';
import { getTestCreateFormViewModel, setTestCreateFormViewModel } from 'exam/store/TestCreateFormStore';
import { QuestionType } from '../model/QuestionType';
import { QuestionSelectionType, QuestionSelectionTypeText } from '../model/QuestionSelectionType';
import { Question } from '../viewmodel/TestSheetViewModel';
import { registerTest } from '../service/registerTest';
import { updateTest, updateTestFinalCopy } from '../service/updateTest';
import { getTestEditPath, getTestListPath } from '../routePath';
import { removeTest } from '../service/removeTest';
import { checkDuplicateTest } from '../service/validationTest';
import {
  getInitialQuestionSelectionConfig,
  QuestionSelectionConfig,
  TestCreateFormViewModel,
} from '../viewmodel/TestCreateFormViewModel';

export const onClickStep = (index: 1 | 2) => {
  //
  const testCreateForm = getTestCreateFormViewModel();

  if (testCreateForm !== undefined) {
    if (index === 2) {
      if (!testInfoValidationCheck(testCreateForm)) {
        return;
      }
      if (!testQuestionValidationCheck(testCreateForm)) {
        return;
      }

      checkDuplicateTest()
        .then((response) => {
          if (response === undefined) {
            alert(
              AlertModel.getCustomAlert(
                true,
                '일시적인 오류 발생',
                '일시적인 오류가 발생했습니다. 잠시후 다시 시도해 주세요.',
                '확인'
              )
            );

            return true;
          } else {
            if (response) {
              alert(AlertModel.getOverlapAlert('Test 이름'));
              return true;
            }
          }

          return false;
        })
        .then((isDuplicate) => {
          if (!isDuplicate) {
            const {
              totalPoint,
              successPoint,
              questionCount,
              mandatoryCount,
              totalQuestionCount,
              questionSelectionConfig,
            } = setResultViewValues(testCreateForm.questionSelectionType);

            setTestCreateFormViewModel({
              ...testCreateForm,
              stepIndex: index,
              totalPoint,
              successPoint,
              questionCount,
              mandatoryCount,
              totalQuestionCount,
              questionSelectionConfig,
            });
          }
        });
    } else {
      setTestCreateFormViewModel({
        ...testCreateForm,
        stepIndex: index,
      });
    }
  }
};

export const onClickPreview = () => {
  setTestPreviewModalViewModel({
    isOpen: true,
  });
};

export const onClickSaveQuestions = () => {
  //
  const testCreateForm = getTestCreateFormViewModel();

  if (testCreateForm !== undefined) {
    const testId = testCreateForm.id;

    if (!testInfoValidationCheck(testCreateForm)) {
      return;
    }
    if (!testQuestionValidationCheck(testCreateForm)) {
      return;
    }

    checkDuplicateTest()
      .then((response) => {
        if (response === undefined) {
          alert(
            AlertModel.getCustomAlert(
              true,
              '일시적인 오류 발생',
              '일시적인 오류가 발생했습니다. 잠시후 다시 시도해 주세요.',
              '확인'
            )
          );

          return true;
        } else {
          if (response) {
            alert(AlertModel.getOverlapAlert('Test 이름'));
            return true;
          }
        }

        return false;
      })
      .then((isDuplicate) => {
        if (!isDuplicate) {
          confirm(
            ConfirmModel.getCustomConfirm(
              '저장 안내',
              '문제를 저장하시겠습니까?\n' +
                '현재까지 작성한 문제는 저장되며,\n' +
                '시험지 출제를 원할 경우 출제 방식을 설정해주세요.\n',
              false,
              '저장',
              '취소',
              () => {
                if (testId) {
                  updateTest(testId, 'update').catch(() =>
                    alert(AlertModel.getCustomAlert(true, '저장 오류 안내', '저장 중 오류가 발생했습니다.', '확인'))
                  );
                } else {
                  registerTest('create').then((id) => {
                    if (id) {
                      setTestCreateFormViewModel({
                        ...testCreateForm,
                        id,
                      });
                      window.history.pushState('', '', getTestEditPath(id));
                    } else {
                      alert(AlertModel.getCustomAlert(true, '저장 오류 안내', '저장 중 오류가 발생했습니다.', '확인'));
                    }
                  });
                }
              }
            )
          );
        }
      });
  }
};

export const onClickSubmit = (finalCopy: boolean) => {
  //
  const testCreateForm = getTestCreateFormViewModel();

  if (testCreateForm === undefined) return;

  const testId = testCreateForm.id;
  const questionSelectionType = testCreateForm.questionSelectionType;

  if (questionSelectionType === QuestionSelectionType.BY_GROUP) {
    if (!byGroupValidationCheck(testCreateForm)) {
      return;
    }
  }

  if (questionSelectionType === QuestionSelectionType.FIXED_COUNT) {
    if (!FixedValidationCheck(testCreateForm)) {
      return;
    }
  }

  if (!ResultValidationCheck(testCreateForm)) {
    return;
  }

  confirm(
    ConfirmModel.getCustomConfirm(
      '저장 안내',
      '문제 및 출제방식 설정을 저장하시겠습니까?',
      false,
      '저장',
      '취소',
      () => {
        setPointByQuestionSelectType(testCreateForm, finalCopy).then(() => {
          if (testId) {
            updateTest(testId).then(() => {
              if (finalCopy) {
                confirm(
                  ConfirmModel.getCustomConfirm(
                    '시험지를 출제 가능한 최종본으로 변경하시겠습니까?',
                    getFinalCopyConfirmMessage(testCreateForm),
                    false,
                    '저장',
                    '취소',
                    () => {
                      updateTestFinalCopy(testId).then(() => {
                        onClickList();
                      });
                    },
                    () => {
                      onClickList();
                    }
                  )
                );
              }
            });
          } else {
            registerTest().then((id) => {
              if (id) {
                setTestCreateFormViewModel({
                  ...testCreateForm,
                  id,
                });
                window.history.pushState('', '', getTestEditPath(id));

                if (finalCopy) {
                  confirm(
                    ConfirmModel.getCustomConfirm(
                      '시험지를 출제 가능한 최종본으로 변경하시겠습니까?',
                      getFinalCopyConfirmMessage(testCreateForm),
                      false,
                      '저장',
                      '취소',
                      () => {
                        updateTestFinalCopy(id).then(() => {
                          onClickList();
                        });
                      },
                      () => {
                        onClickList();
                      }
                    )
                  );
                }
              } else {
                alert(AlertModel.getCustomAlert(true, '저장 오류 안내', '저장 중 오류가 발생했습니다.', '확인'));
              }
            });
          }
        });
      }
    )
  );
};

export const onClickDelete = (testId: string) => {
  confirm(
    ConfirmModel.getCustomConfirm('Test 삭제', '작성한 Test를 삭제하겠습니까?', false, '삭제', '취소', () => {
      removeTest(testId).then((result) => {
        if (result === 'success') {
          alert(
            AlertModel.getCustomAlert(false, '삭제 안내', '시험지 삭제 성공했습니다.', '확인', () => {
              const history = getCurrentHistory();
              history?.push(getTestListPath());
            })
          );
        } else {
          alert(AlertModel.getCustomAlert(false, '삭제 안내', '시험지 삭제 실패했습니다.', '확인'));
        }
      });
    })
  );
};

export const onClickList = () => {
  //
  const currentHistory = getCurrentHistory();
  currentHistory?.push(getTestListPath());
};

export const testInfoValidationCheck = (testCreateForm: TestCreateFormViewModel) => {
  //
  // Test 이름
  if (testCreateForm.title.trim() === '') {
    alert(AlertModel.getRequiredInputAlert('Test 이름'));
    return false;
  }

  // Test 설명
  // if (testCreateForm.description.trim() === '') {
  //   alert(AlertModel.getRequiredInputAlert('Test 설명'));
  //   return false;
  // }

  // 테스트 문항이 0개 일 경우
  if (testCreateForm.newQuestions.length === 0) {
    alert(AlertModel.getCustomAlert(true, '문항 갯수 오류', '문항이 없습니다. 문항을 추가해 주세요.', '확인'));
    return false;
  }

  return true;
};

export const testQuestionValidationCheck = (testCreateForm: TestCreateFormViewModel) => {
  // 문항 validation Check
  const questions = testCreateForm.newQuestions;
  const questionSequences: number[] = [];

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];

    questionSequences.push(question.sequence);

    if (question.question.trim() === '') {
      alert(
        AlertModel.getCustomAlert(
          true,
          '문제 필수 입력 안내',
          `${question.sequence} 번의 문제가 비어 있습니다.`,
          '확인'
        )
      );
      return false;
    }

    if (
      !testCreateForm.finalCopy &&
      testCreateForm.questionSelectionType === QuestionSelectionType.ALL &&
      question.point === '0'
    ) {
      alert(
        AlertModel.getCustomAlert(
          true,
          '점수 필수 입력 안내',
          `${question.sequence} 번의 점수가 비어 있습니다.`,
          '확인'
        )
      );
      return false;
    }

    const { answer } = question.questionAnswer;

    // 단일 객관식, 다중 객관식
    if (question.questionType === QuestionType.SingleChoice || question.questionType === QuestionType.MultiChoice) {
      const items = question.items;

      for (let j = 0; j < items.length; j++) {
        const item = items[j];

        if (item.itemText.trim() === '' && item.imgSrc === '') {
          alert(
            AlertModel.getCustomAlert(
              true,
              '답항 필수 입력 안내',
              `${question.sequence} 번 문항의 ${item.itemNo} 번의 답항이 비어 있습니다.`,
              '확인'
            )
          );
          return false;
        }
      }

      // 답 선택 안했을 경우
      if (answer === '') {
        alert(AlertModel.getRequiredChoiceAlert(`${question.sequence} 번 문항의 객관식 정답`));
        return false;
      }

      // 다중 객관식 정답이 1개 일 경우
      if (question.questionType === QuestionType.MultiChoice && answer.split(',').length === 1) {
        alert(
          AlertModel.getCustomAlert(
            true,
            '다중 객관식 단일 정답 선택 안내',
            `${question.sequence} 번 문항의 정답을 \"2개 이상\" 선택하거나, 유형을 \"단일 객관식\"으로 수정해 주세요.`,
            '확인'
          )
        );
        return false;
      }
    }

    // 주관식 정답 입력 안했을 경우
    if (question.questionType === QuestionType.ShortAnswer && answer.trim() === '') {
      alert(AlertModel.getRequiredInputAlert(`${question.sequence} 번 문항의 주관식 정답`));
      return false;
    }
  }

  return true;
};

const byGroupValidationCheck = (testCreateForm: TestCreateFormViewModel) => {
  //
  const questions = testCreateForm.newQuestions;
  const groups = testCreateForm.questionSelectionConfig.questionGroups;
  const pointPerGroups: string[] = [];

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];

    if (question.groupName.trim() === '') {
      alert(
        AlertModel.getCustomAlert(
          true,
          '문항 그룹 미설정 안내',
          '그룹 미설정 상태인 문항이 있습니다. 그룹 설정을 통해 미지정 문항을 그룹 설정해 주세요.',
          '확인'
        )
      );
      return false;
    }
  }

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];

    // 미지정 그룹은 Validation Check 에서 제외
    if (group.name !== '') {
      if (group.totalQuestionCount === 0) {
        alert(
          AlertModel.getCustomAlert(
            true,
            '빈 그룹 안내',
            '문항이 지정되지 않은 그룹이 있습니다. 그룹에 삭제 하시거나, 그룹에 문항을 1개 이상 지정해주세요.',
            '확인'
          )
        );
        return false;
      }

      if (group.pointPerGroup !== '0') {
        // if (pointPerGroups.includes(group.pointPerGroup)) {
        //   alert(
        //     AlertModel.getCustomAlert(true, '그룹 점수 동일 안내', '그룹 별 점수를 차등적으로 설정해 주세요.', '확인')
        //   );
        //   return false;
        // }

        pointPerGroups.push(group.pointPerGroup);
      }

      if (group.pointPerGroup === '0' && group.questionCount !== '0') {
        alert(
          AlertModel.getCustomAlert(
            true,
            '그룹별 점수 입력 안내',
            `${group.name} 그룹의 점수를 최소 1 이상 설정해 주세요.`,
            '확인'
          )
        );
        return false;
      }
    }
  }

  if (testCreateForm.questionCount === 0) {
    alert(AlertModel.getCustomAlert(true, '출제 문항 미설정 안내', '출제 문항 개수를 1개 이상 설정해 주세요.', '확인'));
    return false;
  }

  return true;
};

const FixedValidationCheck = (testCreateForm: TestCreateFormViewModel) => {
  //
  const questionSelectConfig = testCreateForm.questionSelectionConfig;

  if (questionSelectConfig.pointPerQuestion === '0') {
    alert(AlertModel.getCustomAlert(true, '문항 점수 미설정 안내', '문항 점수를 최소 1점 이상 설정해 주세요.', '확인'));
    return false;
  }

  if (questionSelectConfig.questionCount === '0') {
    alert(AlertModel.getCustomAlert(true, '출제 문항 미설정 안내', '출제 문항 개수를 1개 이상 설정해 주세요.', '확인'));
    return false;
  }

  return true;
};

const ResultValidationCheck = (testCreateForm: TestCreateFormViewModel) => {
  //
  // if (testCreateForm.successPoint === '0') {
  //   alert(AlertModel.getCustomAlert(true, '합격점수 미설정 안내', '합격점수를 최소 1점 이상 설정해 주세요.', '확인'));
  //   return false;
  // }

  if (Number(testCreateForm.successPoint) > Number(testCreateForm.totalPoint)) {
    alert(
      AlertModel.getCustomAlert(true, '합격점수 설정 안내', '합격점수는 총점을 초과하여 설정할 수 없습니다.', '확인')
    );
    return false;
  }

  return true;
};

interface ResultViewValues {
  totalPoint: number;
  successPoint: string;
  questionCount: number;
  mandatoryCount: number;
  totalQuestionCount: number;
  questionSelectionConfig: QuestionSelectionConfig;
}

const getInitialResultViewValues = () => {
  return {
    totalPoint: 0,
    successPoint: '0',
    questionCount: 0,
    mandatoryCount: 0,
    totalQuestionCount: 0,
    questionSelectionConfig: getInitialQuestionSelectionConfig(),
  };
};

export const setResultViewValues = (type: QuestionSelectionType): ResultViewValues => {
  //
  const testCreateForm = getTestCreateFormViewModel();

  if (testCreateForm !== undefined) {
    const questions = testCreateForm.newQuestions;
    const questionSelectionConfig = testCreateForm.questionSelectionConfig;

    if (questionSelectionConfig === undefined) return getInitialResultViewValues();

    const totalQuestionCount = testCreateForm.newQuestions.length; // 총 문항 갯수
    let questionCount = 0; // 출제 문항 갯수
    let mandatoryCount = 0; // 필수 문항 갯수
    let totalPoint = 0; // 총점
    let successPoint = testCreateForm.successPoint; // 합격 점수

    // 모두 출제
    if (type === QuestionSelectionType.ALL) {
      // 총점 -> 각 문항의 점수의 합
      questions &&
        questions.forEach((question) => {
          totalPoint += Number(question.point);
        });
    }

    // 그룹 셔플
    if (type === QuestionSelectionType.BY_GROUP) {
      const questionGroups = questionSelectionConfig.questionGroups;
      const questions = testCreateForm.newQuestions;
      const groupMandatoryCountMap = new Map<string, number>();
      const groupTotalCountMap = new Map<string, number>();

      // 그룹이 할당된 문항의 갯수 === 총 문항 갯수
      questions &&
        questions.forEach((question) => {
          // 그룹이 지정되지 않은 문항은 미지정 그룹으로 할당
          const groupName = question.groupName;

          // 그룹의 총 문항 갯수 추가
          let groupTotalCount = groupTotalCountMap.get(groupName) || 0;
          groupTotalCount += 1;
          groupTotalCountMap.set(groupName, groupTotalCount);

          // 문항이 필수인 경우 -> 그룹의 필수 문항 갯수 + 1
          if (question.mandatory) {
            let groupCount = groupMandatoryCountMap.get(groupName) || 0;
            groupCount += 1;
            groupMandatoryCountMap.set(groupName, groupCount);
          }
        });

      // 각 그룹에 설정된 출제 문항 갯수의 합 === 출제 문항 갯수
      // 각 그룹의 출제 문항 갯수는 각 그룹의 필수 문항 갯수보다 작을 수 없고( 출제 문항 갯수 >= 필수 문항 갯수 ),
      // 각 그룹의 총 문항 갯수보다 클 수 없다.( 출제 문항 갯수 <= 총 문항 갯수 )
      questionGroups &&
        questionGroups.forEach((group) => {
          // 그룹이 지정되지 않은 문항은 미지정 그룹으로 할당
          const groupName = group.name;

          // 그룹 별 필수 문항 갯수 Map 에 없는 경우 필수 문항이 없는 것으로 판단 0 입력
          group.mandatoryCount = groupMandatoryCountMap.get(groupName) || 0;

          // 그룹 별 총 문항 갯수 Map 에 없는 경우 문항이 없는 것으로 판단 0 입력
          group.totalQuestionCount = groupTotalCountMap.get(groupName) || 0;

          // 그룹 별 출제 문항 갯수 < 그룹 별 필수 문항 갯수 --> 그룹 별 출제 문항 갯수를 필수 문항 갯수로 변경
          if (Number(group.questionCount) < group.mandatoryCount) {
            group.questionCount = String(group.mandatoryCount);
          }

          // 그룹 별 출제 문항 갯수 > 그룹 별 총 문항 갯수 --> 그룹 별 출제 문항 갯수를 총 문항 갯수로 변경
          if (Number(group.questionCount) > group.totalQuestionCount) {
            group.questionCount = String(group.totalQuestionCount);
          }

          questionCount += Number(group.questionCount);

          // 그룹 별 문항 점수 * 그룹 별 출제 문항 갯수 --> 그룹 별 점수
          // 그룹 셔플의 총점은 그룹 별 점수의 합
          totalPoint += Number(group.pointPerGroup) * Number(group.questionCount);
        });

      // 미지정 그룹이 맨 뒤로 가도록
      const nextGroups = questionGroups
        .filter((group) => group.name !== '')
        .concat(questionGroups.filter((group) => group.name === ''));

      questionSelectionConfig.questionGroups = nextGroups;
    }

    // 선택 셔플
    if (type === QuestionSelectionType.FIXED_COUNT) {
      // 필수 문항 갯수
      mandatoryCount = getMandatoryCount(testCreateForm.newQuestions);

      // 출제 문항 갯수 < 필수 문항 갯수 --> 출제 문항 갯수를 필수 문항 갯수로 변경
      if (Number(testCreateForm.questionSelectionConfig.questionCount) < mandatoryCount) {
        questionCount = mandatoryCount;
      } else {
        questionCount = Number(testCreateForm.questionSelectionConfig.questionCount);
      }

      questionSelectionConfig.questionCount = String(questionCount);

      totalPoint = questionCount * Number(testCreateForm.questionSelectionConfig.pointPerQuestion);
    }

    // 공통
    // 합격 점수 > 총점 --> 합격점수를 총점과 동일하게 변경
    if (Number(successPoint) > totalPoint) {
      successPoint = String(totalPoint);
    }

    return {
      totalPoint,
      successPoint,
      questionCount,
      mandatoryCount,
      totalQuestionCount,
      questionSelectionConfig,
    };
  }

  return getInitialResultViewValues();
};

const getMandatoryCount = (questions: Question[]): number => {
  //
  let mandatoryCount = 0;

  questions &&
    questions.forEach((question) => {
      if (question.mandatory) mandatoryCount += 1;
    });

  return mandatoryCount;
};

const getFinalCopyConfirmMessage = (testCreateForm: TestCreateFormViewModel) => {
  //
  const questionSelectionType = testCreateForm.questionSelectionType;
  const questionSelectionConfig = testCreateForm.questionSelectionConfig;

  let message = `차후 시험 문제의 변경이 불가능합니다.\n하단 설정 정보를 확인해 주세요.\n\n`;

  if (questionSelectionType === QuestionSelectionType.ALL) {
    message += `출제방식 : ${QuestionSelectionTypeText.ALL}\n`;
    message += `문항 설정 : 문항 순서 셔플 ${questionSelectionConfig.enableShuffle ? '선택' : '미선택'}\n`;
    message += `합격점 / 총점 : ${testCreateForm.successPoint} / ${testCreateForm.totalPoint}\n`;
    message += `출제 문항 수 : ${testCreateForm.totalQuestionCount} 문항`;
  } else if (questionSelectionType === QuestionSelectionType.BY_GROUP) {
    const groups = questionSelectionConfig.questionGroups;

    message += `출제방식 : ${QuestionSelectionTypeText.BY_GROUP}\n`;
    message += `문항 설정 :`;
    groups.map((group, index) => {
      if (group.name !== '') {
        if (index !== 0) message += ', ';

        message += `${group.name} 그룹 ${group.questionCount}문항`;
      }
    });
    message += '\n';

    message += `합격점 / 총점 : ${testCreateForm.successPoint} / ${testCreateForm.totalPoint}\n`;
    message += `출제 문항 수 : ${testCreateForm.questionCount} 문항`;
  } else if (questionSelectionType === QuestionSelectionType.FIXED_COUNT) {
    message += `출제방식 : ${QuestionSelectionTypeText.FIXED_COUNT}\n`;
    message += `문항 설정 : 문항 점수 ${questionSelectionConfig.pointPerQuestion}\n`;
    message += `합격점 / 총점 : ${testCreateForm.successPoint} / ${testCreateForm.totalPoint}\n`;
    message += `출제 문항 수 : ${questionSelectionConfig.questionCount} 문항`;
  }

  return message;
};

const setPointByQuestionSelectType = async (testCreateForm: TestCreateFormViewModel, finalCopy: boolean) => {
  //

  if (finalCopy) {
    if (testCreateForm.questionSelectionType === QuestionSelectionType.BY_GROUP) {
      const questions = testCreateForm.newQuestions;
      const groups = testCreateForm.questionSelectionConfig.questionGroups;

      const newQuestions = questions.map((question) => {
        const groupName = question.groupName;

        groups.forEach((group) => {
          if (group.name === groupName) {
            question.point = group.pointPerGroup;
          }
        });

        return question;
      });

      setTestCreateFormViewModel({
        ...testCreateForm,
        newQuestions,
      });
    } else if (testCreateForm.questionSelectionType === QuestionSelectionType.FIXED_COUNT) {
      const questions = testCreateForm.newQuestions;
      const point = testCreateForm.questionSelectionConfig.pointPerQuestion;

      const newQuestions = questions.map((question) => {
        question.point = point;

        return question;
      });

      setTestCreateFormViewModel({
        ...testCreateForm,
        newQuestions,
      });
    }
  }
};
