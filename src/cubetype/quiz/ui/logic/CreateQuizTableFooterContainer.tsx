import React, { useRef, useCallback } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { HtmlEditor } from 'shared/ui';
import { QuillModel } from 'cubetype/quiz/model/SelectType';
import { upload } from 'cubetype/quiz/api/FileApi';
import QuizMessage from 'cubetype/quiz/model/QuizMessage';

interface Props {
  quizFooterState: QuizMessage | undefined;
  setQuizFooterState: (state: any) => void;
}

const CreateQuizTableFooterContainer: React.FC<Props> = ({ quizFooterState, setQuizFooterState }) => {
  const FileInputRef = useRef<HTMLInputElement>(null);

  const onChangeFooterState = useCallback(
    (type: string, value: string | number) => {
      setQuizFooterState({
        ...quizFooterState,
        [type]: value,
      });
    },
    [quizFooterState]
  );

  const onChangeFileName = useCallback(
    async (e: any) => {
      await upload(e)?.then((thumbnailId) => {
        const filePath = `files/community/${thumbnailId}`;
        onChangeFooterState('img', filePath);
      });
    },
    [onChangeFooterState]
  );

  return (
    <Table celled>
      <colgroup>
        <col width="85px" />
        <col width="auto" />
      </colgroup>
      <Table.Body>
        <Table.Row>
          <Table.Cell className="tb-header" style={{ textAlign: 'center' }}>
            완료
            <br />
            메시지
          </Table.Cell>
          <Table.Cell colSpan={5} className="pop-editor">
            <HtmlEditor
              modules={QuillModel.modules}
              formats={QuillModel.formats}
              value={quizFooterState?.message}
              height={85}
              onChange={(html) => onChangeFooterState('message', html === '<p><br></p>' ? '' : html)}
            />

            <Button
              className="file-select-btn"
              content="파일 선택"
              labelPosition="left"
              icon="file"
              onClick={() => {
                if (FileInputRef && FileInputRef.current) {
                  FileInputRef.current.click();
                }
              }}
            />
            <input
              id="file"
              type="file"
              ref={FileInputRef}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeFileName(e)}
              hidden
            />
            {quizFooterState?.img !== '' && (
              <span style={{ display: 'inlineBlock', marginLeft: '10px' }}>{quizFooterState?.img}</span>
            )}
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export default React.memo(CreateQuizTableFooterContainer);
