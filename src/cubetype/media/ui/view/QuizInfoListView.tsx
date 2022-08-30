import { MediaService } from 'cube/media';
import QuizTableList from 'cubetype/quiz/model/QuizTableList';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { useDownloadQuizAnswerExcel } from '../../../quiz/Quiz.hook';
import { QuizAnswerExcelFunc } from '../../../quiz/QuizAnswerExcel.util';

const QuizInfoListView = ({
  findQuizData,
  mediaService,
  updateQuizTable,
  createQuizModalOpen,
}: {
  createQuizModalOpen: boolean;
  findQuizData: () => any;
  mediaService?: MediaService;
  updateQuizTable: (table: QuizTableList) => void;
}) => {
  const [data, setData] = useState<QuizTableList[]>([]);

  const { mutateAsync: downloadExcel } = useDownloadQuizAnswerExcel();

  const memo = useMemo(() => {
    findQuizData() ? findQuizData().then((res: any) => setData(res)) : setData([]);
  }, [findQuizData]);

  useEffect(() => {}, [memo]);

  const getTimeStringSeconds = useCallback((seconds: number) => {
    let min: number | string = 0;
    let sec: number | string = 0;
    let hour: number | string = 0;

    hour = Math.floor(seconds / 3600);
    min = Math.floor((seconds % 3600) / 60);
    sec = Math.floor(seconds % 60);

    if (hour.toString().length === 1) hour = '0' + hour;
    if (min.toString().length === 1) min = '0' + min;
    if (sec.toString().length === 1) sec = '0' + sec;

    return hour + ':' + min + ':' + sec;
  }, []);

  const onClickDownloadQuizResultExcel = useCallback(
    async (quizId: string, quizName: string) => {
      const downloadList = await downloadExcel(quizId);
      QuizAnswerExcelFunc.downloadExcel(quizName, downloadList || []);
    },
    [downloadExcel]
  );

  return (
    <>
      {data && data.length > 0 && (
        <Table celled>
          <colgroup>
            <col width="45%" />
            <col width="20%" />
            <col width="20%" />
            <col width="15%" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">제목</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">영상 이어보기 조건</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">퀴즈 노출 시간</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">결과 다운로드</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data?.map((row, index) => (
              <Table.Row style={{ cursor: 'pointer' }} key={index}>
                <Table.Cell onClick={() => updateQuizTable(row)}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `${row?.name}`,
                    }}
                  />
                </Table.Cell>
                <Table.Cell style={{ textAlign: 'center' }} onClick={() => updateQuizTable(row)}>
                  {row?.quizQuestions[0]?.answer ? '정답 제출' : '답안 제출'}
                </Table.Cell>
                <Table.Cell style={{ textAlign: 'center' }} onClick={() => updateQuizTable(row)}>
                  {`${getTimeStringSeconds(row.showTime)} / ${getTimeStringSeconds(
                    Math.floor(Number(mediaService?.media?.mediaContents.internalMedias[0]?.duration))
                  )}`}
                </Table.Cell>
                <Table.Cell style={{ textAlign: 'center' }}>
                  <Button onClick={() => onClickDownloadQuizResultExcel(row.id, row.name)}>다운로드</Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </>
  );
};

export default QuizInfoListView;
