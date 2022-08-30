import React from 'react';
import { List, Radio, Table } from 'semantic-ui-react';
import { reactAutobind } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import { AnswerItemModel } from '../../../answer/model/AnswerItemModel';
import { NumberValue } from '../../../form/model/NumberValue';
import { QuestionModel } from '../../../form/model/QuestionModel';
import { MatrixItem } from '../../../analysis/model/MatrixItem';
import Image from 'shared/components/Image';

interface Props {
  question: QuestionModel;
  answer: AnswerItemModel;
  rowItems: NumberValue[];
  columnItems: NumberValue[];
}

interface State {}

@reactAutobind
@observer
class MatrixView extends React.Component<Props, State> {
  //
  render() {
    const { answer, question, rowItems, columnItems } = this.props;

    return (
      <>
        {question.sentencesImageUrl && (
          <div style={{ margin: '20px 0' }}>
            {question.sentencesImageUrl && <Image src={question.sentencesImageUrl} />}
          </div>
        )}
        <Table celled className="test-table" style={{ marginTop: '20px' }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              {columnItems.map((key, columnIndex) => {
                return <Table.HeaderCell>{columnItems[columnIndex].values.langStringMap.get('ko')}</Table.HeaderCell>;
              })}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rowItems.map((rowItem, rowIndex) => {
              return (
                <Table.Row>
                  <Table.Cell>{rowItems[rowIndex].values.langStringMap.get('ko')}</Table.Cell>
                  {columnItems.map((key, columnIndex) => {
                    const index = (columnIndex + 1).toString();
                    return (
                      <Table.Cell>
                        <Radio
                          className="base"
                          name={`survey_matrix_${question.sequence.toSequenceString()}_${rowIndex}`}
                          value={index}
                          readOnly
                          checked={
                            answer.matrixItem[rowIndex] && answer.matrixItem[rowIndex].columnSelectedNumber === index
                          }
                        />
                      </Table.Cell>
                    );
                  })}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </>
    );
  }
}

export default MatrixView;
