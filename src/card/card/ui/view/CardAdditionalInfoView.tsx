import React from 'react';
import { Button, Icon, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';

import { reactAutobind } from '@nara.platform/accent';
import { FileBox, PatronType, ValidationType } from '@nara.drama/depot';

import { FormTable } from 'shared/components';
import Polyglot from 'shared/components/Polyglot';
import { DepotUtil } from 'shared/ui';

import { CardTestListContainer } from 'exam/ui/logic/CardTestListContainer';
import SurveyModal from '../../../../cube/cube/ui/logic/SurveyModal';
import { SurveyFormModel, SurveyListModal } from '../../../../survey';
import { CardContentsQueryModel } from '../../model/CardContentsQueryModel';

interface Props {
  isUpdatable: boolean;
  cardContentsQuery: CardContentsQueryModel;
  changeCardContentsQueryProps: (name: string, value: any) => void;
  getFileBoxIdForReport: (id: string) => void;
  onClickTestSelect: () => void;
  onClickSurveyModalOk: (selectedSurveyForm: SurveyFormModel) => void;
  onClickSurveyForm: (surveyFormId: string) => void;
  onClickSurveyDeleteRow: (event: any) => void;
}

@observer
@reactAutobind
class CardAdditionalInfoView extends React.Component<Props> {
  //
  render() {
    //
    const {
      isUpdatable,
      cardContentsQuery,
      changeCardContentsQueryProps,
      getFileBoxIdForReport,
      onClickTestSelect,
      onClickSurveyModalOk,
      onClickSurveyForm,
      onClickSurveyDeleteRow,
    } = this.props;

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
                  {/*{isUpdatable ? (*/}
                  {/*  <div*/}
                  {/*    className={*/}
                  {/*      reportNameLength >= 100 ? 'ui right-top-count input error' : 'ui right-top-count input'*/}
                  {/*    }*/}
                  {/*  >*/}
                  {/*    <span className="count">*/}
                  {/*      <span className="now">{reportNameLength}</span>/<span className="max">100</span>*/}
                  {/*    </span>*/}
                  {/*    <input*/}
                  {/*      type="text"*/}
                  {/*      placeholder="Please enter the report name. (Up to 100 characters)"*/}
                  {/*      value={*/}
                  {/*        (cardContentsQuery &&*/}
                  {/*          cardContentsQuery.reportFileBox &&*/}
                  {/*          cardContentsQuery.reportFileBox.reportName) ||*/}
                  {/*        ''*/}
                  {/*      }*/}
                  {/*      onChange={(e: any) => onChangeCardIntroProps('reportFileBox.reportName', e.target.value)}*/}
                  {/*    />*/}
                  {/*  </div>*/}
                  {/*) : (*/}
                  {/*  cardContentsQuery.reportFileBox && cardContentsQuery.reportFileBox.reportName*/}
                  {/*)}*/}

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
                  {/*{isUpdatable ? (*/}
                  {/*  <div*/}
                  {/*    className={*/}
                  {/*      reportQuestionLength >= 1000 ? 'ui right-top-count input error' : 'ui right-top-count input'*/}
                  {/*    }*/}
                  {/*  >*/}
                  {/*    <span className="count">*/}
                  {/*      <span className="now">{reportQuestionLength}</span>/<span className="max">1000</span>*/}
                  {/*    </span>*/}
                  {/*    <TextArea*/}
                  {/*      placeholder="작성 가이드 및 문제를 입력해주세요. (1,000자까지 입력가능)"*/}
                  {/*      rows={3}*/}
                  {/*      value={*/}
                  {/*        (cardContentsQuery &&*/}
                  {/*          cardContentsQuery.reportFileBox &&*/}
                  {/*          cardContentsQuery.reportFileBox.reportQuestion) ||*/}
                  {/*        ''*/}
                  {/*      }*/}
                  {/*      onChange={(e: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) =>*/}
                  {/*        onChangeCardIntroProps('reportFileBox.reportQuestion', `${data.value}`)*/}
                  {/*      }*/}
                  {/*    />*/}
                  {/*  </div>*/}
                  {/*) : (*/}
                  {/*  cardContentsQuery.reportFileBox && cardContentsQuery.reportFileBox.reportQuestion*/}
                  {/*)}*/}

                  <Polyglot.TextArea
                    name="reportFileBox.reportQuestion"
                    onChangeProps={changeCardContentsQueryProps}
                    languageStrings={cardContentsQuery.reportFileBox.reportQuestion}
                    maxLength={3000}
                    readOnly={!isUpdatable}
                    placeholder="작성 가이드 및 문제를 입력해주세요. (3,000자까지 입력가능)"
                  />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="tb-header">양식 업로드</Table.Cell>
                <Table.Cell>
                  {/* fileBoxId 하나만 넘기면 fileBoxId 리스트 가져와서 뿌린다. */}
                  <FileBox
                    options={{ readonly: !isUpdatable }}
                    fileBoxId={
                      (cardContentsQuery &&
                        cardContentsQuery.reportFileBox &&
                        cardContentsQuery.reportFileBox.fileBoxId) ||
                      ''
                    }
                    id={
                      (cardContentsQuery &&
                        cardContentsQuery.reportFileBox &&
                        cardContentsQuery.reportFileBox.fileBoxId) ||
                      ''
                    }
                    vaultKey={{
                      keyString: 'sku-depot',
                      patronType: PatronType.Pavilion,
                    }}
                    patronKey={{
                      keyString: 'sku-denizen',
                      patronType: PatronType.Denizen,
                    }}
                    validations={[
                      {
                        type: ValidationType.Duplication,
                        validator: DepotUtil.duplicationValidator,
                      },
                      {
                        type: ValidationType.Extension,
                        validator: DepotUtil.extensionValidatorByDocument,
                      },
                    ]}
                    onChange={getFileBoxIdForReport}
                  />

                  {isUpdatable && (
                    <>
                      <p className="info-text-gray">- DOC,PDF,EXL 파일을 등록하실 수 있습니다.</p>
                      <p className="info-text-gray">- 최대 10MB 용량의 파일을 등록하실 수 있습니다.</p>
                    </>
                  )}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </FormTable.Row>
        <FormTable.Row name="Survey 추가">
          {isUpdatable && <SurveyListModal handleOk={onClickSurveyModalOk} type="card" />}
          {cardContentsQuery && cardContentsQuery.surveyId ? (
            <Table celled>
              <colgroup>
                {isUpdatable && <col width="5%" />}
                <col width="70%" />
                <col width="25%" />
              </colgroup>
              <Table.Header>
                <Table.Row>
                  {isUpdatable && <Table.HeaderCell textAlign="center" />}
                  <Table.HeaderCell textAlign="center">설문 제목</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">설문 작성자</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <SurveyModal
                  surveyId={cardContentsQuery.surveyId}
                  trigger={
                    <Table.Row className="pointer" onClick={() => onClickSurveyForm(cardContentsQuery.surveyId)}>
                      {isUpdatable && (
                        <Table.Cell>
                          <Button icon size="mini" basic onClick={(event) => onClickSurveyDeleteRow(event)}>
                            <Icon name="minus" />
                          </Button>
                        </Table.Cell>
                      )}
                      <Table.Cell>{cardContentsQuery.surveyTitle}</Table.Cell>
                      <Table.Cell>{cardContentsQuery.surveyDesignerName}</Table.Cell>
                    </Table.Row>
                  }
                />
              </Table.Body>
            </Table>
          ) : null}
        </FormTable.Row>
        {isUpdatable ? (
          <FormTable.Row
            name="Test 추가"
            subText=" Test를 변경하거나 삭제할 경우 이수 처리 오류 및 학습자 혼선이 생길 수 있습니다. 사전 학습자 공지를 반드시 부탁드리며, 수정에 유의하시기 바랍니다."
          >
            <Button type="button" onClick={onClickTestSelect}>
              Test 선택
            </Button>
            {cardContentsQuery.tests != null && cardContentsQuery.tests.length > 0 ? (
              <CardTestListContainer readonly={!isUpdatable} />
            ) : null}
          </FormTable.Row>
        ) : (
          <FormTable.Row name="Test 추가">
            {cardContentsQuery.tests != null && cardContentsQuery.tests.length > 0 ? (
              <CardTestListContainer readonly={!isUpdatable} />
            ) : null}
          </FormTable.Row>
        )}
      </FormTable>
    );
  }
}

export default CardAdditionalInfoView;
