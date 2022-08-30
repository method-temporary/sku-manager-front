import React from 'react';
import { List, Radio } from 'semantic-ui-react';
import { QuestionItem } from 'exam/viewmodel/GradeSheetViewModel';
import { Image } from 'shared/components';
import './gradeSheet.css';


interface SingleChoiceViewProps {
  questionNo: number;
  answer: string;
  questionItems: QuestionItem[];
}

export function SingleChoiceView({ questionNo, answer, questionItems }: SingleChoiceViewProps) {
  return (
    <List>
      {questionItems &&
        questionItems.length > 0 &&
        questionItems.map((questionItem) => (
          <List.Item className="problem-list-item" key={`item_${questionItem.itemNo}`}>
            <div
              className="problem-list-item-radio"
              style={{ margin: '1rem 0' }}
            >
              <Radio
                className="check-radio"
                name={`test_${questionNo}`}
                value={questionItem.itemNo}
                label={`${questionItem.itemNo}. ${questionItem.itemText}`}
                checked={answer === questionItem.itemNo}
                readOnly
              />
              {questionItem.imgSrc && (
                <div>
                  <Image src={questionItem.imgSrc} className="img-list max-width-100" />
                </div>
              )}
            </div>
          </List.Item>
        ))}
    </List>
  );
}
