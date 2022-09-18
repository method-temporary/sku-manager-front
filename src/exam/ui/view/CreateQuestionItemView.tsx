import React, { useRef } from 'react';
import { Button, Checkbox, Form, Input, InputOnChangeData, Radio, Table } from 'semantic-ui-react';

import { Image } from 'shared/components';

import {
  onClickAddItem,
  onClickRemoveItem,
  onChangeChoiceAnswer,
  onChangeItemText,
  onChangeItemImage,
} from '../../handler/TestCreateQuestionItemHandler';

import { QuestionItem } from 'exam/viewmodel/TestSheetViewModel';
import { QuestionType } from '../../model/QuestionType';

interface CreateQuestionItemViewProps {
  index: number;
  finalCopy: boolean;
  questionNo: number;
  questionType: QuestionType;
  questionAnswer: string;
  newQuestionItem: QuestionItem;
  itemCount: number;
}

export function CreateQuestionItemView({
  index,
  finalCopy,
  questionNo,
  questionType,
  questionAnswer,
  newQuestionItem,
  itemCount,
}: CreateQuestionItemViewProps) {
  const itemImgRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {/* {index === 0 ? (
        <Table.Cell rowSpan={itemCount} textAlign="center" className="tb-header">
          <span>보기 번호</span>
        </Table.Cell>
      ) : (
        <Table.Cell className="none" />
      )} */}
      {/* <Table.Cell textAlign="center">
        <Form.Field
          readOnly={finalCopy}
          control={questionType === QuestionType.SingleChoice ? Radio : Checkbox}
          checked={questionAnswer.includes(newQuestionItem.itemNo)}
          onChange={(e: React.ChangeEvent, data: InputOnChangeData) =>
            onChangeChoiceAnswer(
              questionType,
              questionNo,
              newQuestionItem.itemNo,
              questionType === QuestionType.SingleChoice ? undefined : data.checked
            )
          }
        />
      </Table.Cell> */}
      <Table.Cell textAlign="center" className="tb-header">
        <span>
          보기 <Table.Cell textAlign="center">{newQuestionItem.itemNo}</Table.Cell>
        </span>
      </Table.Cell>
      <Table.Cell colSpan={9}>
        {!finalCopy && (
          <>
            <Button icon="minus" size="mini" basic onClick={() => onClickAddItem(questionNo, newQuestionItem.itemNo)}>
              보기 추가
            </Button>

            {/* <Button icon="plus" size="mini" basic onClick={() => onClickAddItem(questionNo, newQuestionItem.itemNo)} /> */}
            {itemCount !== 1 && (
              <Button
                icon="minus"
                size="mini"
                basic
                onClick={() => onClickRemoveItem(questionNo, newQuestionItem.itemNo)}
              >
                삭제
              </Button>
            )}
          </>
        )}
        <Form.Field
          control={Input}
          value={newQuestionItem.itemText}
          onChange={(e: React.ChangeEvent) => onChangeItemText(e, questionNo, newQuestionItem.itemNo)}
        />
        {/* <Button
          size="mini"
          className="file-select-btn only-margin-button"
          content="파일 선택"
          labelPosition="left"
          icon="file"
          onClick={() => {
            if (itemImgRef && itemImgRef.current) {
              itemImgRef.current.click();
            }
          }}
        /> */}
        <input
          type="file"
          ref={itemImgRef}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            e.target.files && onChangeItemImage(questionNo, newQuestionItem.itemNo, e.target.files[0])
          }
          hidden
        />

        {newQuestionItem && newQuestionItem.imgSrc && (
          <div>
            <Image src={`${newQuestionItem.imgSrc}`} size="small" verticalAlign="bottom" className="max-width-100" />
          </div>
        )}
      </Table.Cell>
      <Table.Row>
        <Table.Cell>
          <Form.Field
            readOnly={finalCopy}
            control={questionType === QuestionType.SingleChoice ? Radio : Checkbox}
            checked={questionAnswer.includes(newQuestionItem.itemNo)}
            onChange={(e: React.ChangeEvent, data: InputOnChangeData) =>
              onChangeChoiceAnswer(
                questionType,
                questionNo,
                newQuestionItem.itemNo,
                questionType === QuestionType.SingleChoice ? undefined : data.checked
              )
            }
          />
        </Table.Cell>
        <Table.Cell>정답</Table.Cell>
      </Table.Row>
    </>
  );
}
