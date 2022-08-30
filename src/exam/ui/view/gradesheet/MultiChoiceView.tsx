import React from 'react';
import { Checkbox, List } from 'semantic-ui-react';
import { QuestionItem } from 'exam/viewmodel/GradeSheetViewModel';
import { Image } from 'shared/components';
import './gradeSheet.css';

interface MultiChoiceViewProps {
  answer: string;
  questionItems: QuestionItem[];
}

export function MultiChoiceView({
  answer,
  questionItems,
}: MultiChoiceViewProps) {
  const multiAnswers = answer.split(',');

  return (
    <List>
      {
        questionItems &&
        questionItems.length > 0 &&
        questionItems.map(questionItem => (
          <List.Item className="problem-list-item" key={`item_${questionItem.itemNo}`}>
            <div
              className="problem-list-item-radio"
              style={{ margin: '1rem 0' }}
            >
              <Checkbox
                className="check-radio"
                label={
                  <label
                    dangerouslySetInnerHTML={{
                      __html: `${questionItem.itemNo}. ${questionItem.itemText}`,
                    }}
                  />
                }
                value={questionItem.itemNo}
                checked={multiAnswers.includes(questionItem.itemNo)}
                readOnly
              />
              {
                questionItem.imgSrc &&
                (
                  <div>
                    <Image
                      src={questionItem.imgSrc}
                      className="img-list max-width-100"
                    />
                  </div>
                )
              }

            </div>
          </List.Item>
        ))
      }
    </List>
  );
}
