import React from 'react';
import { observer } from 'mobx-react';
import { Table } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { FormTable, Polyglot } from 'shared/components';
import { Language } from 'shared/components/Polyglot';

import { CardContentsQueryModel } from 'card/card/model/CardContentsQueryModel';

interface Props {
  isUpdatable: boolean;
  cardContentsQuery: CardContentsQueryModel;
  changeCardContentsQueryProps: (name: string, value: any) => void;
}

@observer
@reactAutobind
class CardAdditionalInfoView extends React.Component<Props> {
  //
  render() {
    //
    const { isUpdatable, cardContentsQuery, changeCardContentsQueryProps } = this.props;

    return (
      <FormTable title="추가 정보">
        <FormTable.Row name="Report 출제">
          <Table celled>
            <colgroup>
              <col width="20%" />
              <col width="80%" />
            </colgroup>
            <Table.Body>
              <Table.Row>
                <Table.Cell className="tb-header">Report 명</Table.Cell>
                <Table.Cell>
                  <Polyglot.Input
                    name="reportFileBox.reportName"
                    onChangeProps={changeCardContentsQueryProps}
                    languageStrings={cardContentsQuery.reportFileBox.reportName}
                    maxLength="200"
                    readOnly={!isUpdatable}
                    placeholder="Report 명을 입력해주세요. (200자까지 입력가능)"
                  />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="tb-header">작성 가이드</Table.Cell>
                <Table.Cell>
                  <Polyglot.TextArea
                    name="reportFileBox.reportQuestion"
                    onChangeProps={changeCardContentsQueryProps}
                    languageStrings={cardContentsQuery.reportFileBox.reportQuestion}
                    maxLength={3000}
                    readOnly={!isUpdatable}
                    placeholder="작성 가이드 및 문제를 입력해주세요. (3,000자까지 입력가능)"
                    oneLanguage={Language.Ko}
                    disabledTab={true}
                  />
                  <div className="margin-bottom10" />
                  <Polyglot.TextArea
                    name="reportFileBox.reportQuestion"
                    onChangeProps={changeCardContentsQueryProps}
                    languageStrings={cardContentsQuery.reportFileBox.reportQuestion}
                    maxLength={3000}
                    readOnly={!isUpdatable}
                    placeholder="작성 가이드 및 문제를 입력해주세요. (3,000자까지 입력가능)"
                    oneLanguage={Language.En}
                    disabledTab={true}
                  />
                  <div className="margin-bottom10" />
                  <Polyglot.TextArea
                    name="reportFileBox.reportQuestion"
                    onChangeProps={changeCardContentsQueryProps}
                    languageStrings={cardContentsQuery.reportFileBox.reportQuestion}
                    maxLength={3000}
                    readOnly={!isUpdatable}
                    placeholder="작성 가이드 및 문제를 입력해주세요. (3,000자까지 입력가능)"
                    oneLanguage={Language.Zh}
                    disabledTab={true}
                  />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default CardAdditionalInfoView;
