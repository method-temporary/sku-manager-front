import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { alert, AlertModel, Modal, SubActions } from '../../../../shared/components';
import CardStudentStore from '../CardStudent.store';
import { useFindCardStudentForAdminStudent, useModifyCardStudentRound } from '../CardStudent.hooks';
import { useFindCardById } from '../../../list/CardList.hook';
import { Button, Icon, Select, Table } from 'semantic-ui-react';
import { ChangeStudentRoundResultModel } from '../../model/ChangeStudentRoundResultModel';
import { Loader, LoaderService } from 'shared/components/Loader';
import { useQueryClient } from 'react-query';
import { queryKeys } from 'query/queryKeys';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CardStudentRoundChangeModal = observer(({ open, onClose }: Props) => {
  //
  const {
    cardStudentParams,
    selectedCardStudentIds,
    cardStudentQuery,
    toRound,
    toRounds,
    changeStudentRoundResults,
    isUpdatable,
    setToRound,
    setChangeStudentRoundResults,
    setIsUpdatable,
  } = CardStudentStore.instance;

  const { openLoader, closeLoader } = LoaderService.instance;
  const { data: students } = useFindCardStudentForAdminStudent(cardStudentParams);
  const { mutateAsync: cardStudentRoundMutate } = useModifyCardStudentRound();
  const [loaderText, setLoaderText] = useState<string>();

  const changeToRound = (round: number) => {
    //
    setToRound(round);
  };

  const getErrorMessage = (errorCode: string = '') => {
    switch (errorCode) {
      case 'limitationIsOver':
        return '정원이 초과되었습니다.';

      case 'theRoundOfEnrollmentNotFound':
        return '잘못 된 차수입니다. 다시 확인해주세요.';

      case 'alreadyPassedStudent':
        return '이미 학습 완료한 학습자입니다.';

      default:
        return '차수 변경에 실패하였습니다. 학습자 또는 차수 정보를 다시 확인해주세요.';
    }
  };

  const validate = () => {
    //
  };

  const onOk = async () => {
    //
    validate();

    const results: ChangeStudentRoundResultModel[] = [];
    const selectedStudents =
      students?.results.filter((studentWiths) => selectedCardStudentIds.includes(studentWiths.student.id)) || [];
    let isLimitationOver = false;
    let loadingCount = 0;

    openLoader(true);

    /* eslint-disable no-await-in-loop */
    for (const student of selectedStudents) {
      //
      setLoaderText(`일괄 변경 중 (${loadingCount}/${selectedStudents.length})`);

      if (isLimitationOver) {
        results.push(
          ChangeStudentRoundResultModel.asChangeStudentRoundResultModel(
            false,
            student.student,
            getErrorMessage('limitationIsOver')
          )
        );
      } else {
        await cardStudentRoundMutate({
          studentId: student.student.id,
          round: toRound,
        })
          .then(() => {
            results.push(ChangeStudentRoundResultModel.asChangeStudentRoundResultModel(true, student.student, ''));
          })
          .catch((e) => {
            const errCode = e.response.headers['x-message-code'];

            if (errCode === 'limitationIsOver') {
              isLimitationOver = true;
            }

            results.push(
              ChangeStudentRoundResultModel.asChangeStudentRoundResultModel(
                false,
                student.student,
                getErrorMessage(errCode)
              )
            );
          });
      }

      loadingCount++;
    }

    setChangeStudentRoundResults(results);

    setIsUpdatable(false);
    closeLoader(true);
  };

  const getResultCount = (isSuccess: boolean) => {
    return changeStudentRoundResults
      ?.filter((result) => result.isSuccess === isSuccess)
      .reduce((acc, cur) => acc + 1, 0);
  };

  const closeModal = () => {
    //
    onClose();
  };

  return (
    <Modal size="small" open={open}>
      <Modal.Header>차수 변경</Modal.Header>
      <Modal.Content style={{ overflow: 'auto', height: 700 }}>
        <Loader loaderText={loaderText}>
          <Table celled style={{ marginBottom: 0 }}>
            <colgroup>
              <col width="20%" />
              <col width="80%" />
            </colgroup>
            <Table.Body>
              <Table.Row>
                <Table.Cell>현재 차수</Table.Cell>
                <Table.Cell>{cardStudentQuery.round}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>변경 차수</Table.Cell>
                <Table.Cell>
                  <Select
                    className="ui small-border dropdown m0"
                    value={toRound}
                    options={toRounds}
                    onChange={(e: any, data: any) => {
                      changeToRound(data.value);
                    }}
                  />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          <SubActions>
            <SubActions.Left>
              <span>
                총 <strong>{changeStudentRoundResults?.length}</strong> 건 중 <strong>{getResultCount(true)}</strong> 건
                성공 / <strong>{getResultCount(false)}</strong> 건 실패
              </span>
            </SubActions.Left>
          </SubActions>
          <Table celled style={{ marginBottom: 0 }}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="center">성명</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">결과</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">비고</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {(changeStudentRoundResults?.length > 0 &&
                changeStudentRoundResults.map((result, index) => {
                  return (
                    <Table.Row key={index}>
                      <Table.Cell textAlign="center">{result.name}</Table.Cell>
                      <Table.Cell textAlign="center">{result.isSuccess === true ? '성공' : '실패'}</Table.Cell>
                      <Table.Cell textAlign="center">{result.errorMessage}</Table.Cell>
                    </Table.Row>
                  );
                })) || (
                <Table.Row>
                  <Table.Cell textAlign="center" colSpan={3}>
                    <div className="no-cont-wrap no-contents-icon">
                      <Icon className="no-contents80" />
                      <div className="sr-only">콘텐츠 없음</div>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Loader>
      </Modal.Content>
      <Modal.Actions>
        <Button type="button" onClick={() => closeModal()}>
          닫기
        </Button>

        {isUpdatable && (
          <Button primary type="button" onClick={() => onOk()}>
            저장
          </Button>
        )}
      </Modal.Actions>
    </Modal>
  );
});
