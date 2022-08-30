import moment from 'moment';
import React, { useCallback, useState } from 'react';
import {
  Breadcrumb,
  Button,
  Checkbox,
  Container,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Radio,
  Select,
  Table,
} from 'semantic-ui-react';
import DatePicker from 'react-datepicker';

import { SelectType } from 'shared/model';
import { FormTable, Polyglot } from 'shared/components';
import { Language, LanguageTypes, getPolyglotToAnyString } from 'shared/components/Polyglot';

interface DashBoardSentenceDetailViewProps {
  type?: string;
  detailData: any;
  handleDataChange: (name: string, e: any) => void;
  handleExposureChange: (name: string, value: boolean) => void;
  handleDateChange: (name: string, value: any) => void;
  routeToList: () => void;
  handleTempSave: () => void;
  handleSave: () => void;
  handleTxtListChange: (type: any, value: number, index?: number, lang?: Language) => void;
  changeSentenceList: (type: string, value?: any, index?: any, lang?: Language) => void;
  exposureDateOptionChange: (value: boolean) => void;
}

const BREADCRUMB_PATH = [
  { key: 'Home', content: 'HOME', link: true },
  { key: 'Support', content: '전시 관리', link: true },
  { key: 'Tag', content: '대시보드 문구 관리', active: true },
];

const DashBoardSentenceDetailView: React.FC<DashBoardSentenceDetailViewProps> = function LectureListView({
  type,
  detailData,
  handleDataChange,
  handleExposureChange,
  handleDateChange,
  routeToList,
  handleTempSave,
  handleSave,
  handleTxtListChange,
  changeSentenceList,
  exposureDateOptionChange,
}) {
  const [allCheckBoxKR, setAllCheckBoxKR] = useState<boolean>(false);
  const [allCheckBoxEN, setAllCheckBoxEN] = useState<boolean>(false);
  const [allCheckBoxZH, setAllCheckBoxZH] = useState<boolean>(false);

  const [checkedList, setCheckedList] = useState<string[]>([]);

  const checkAll = useCallback(
    (data: any, lang: Language) => {
      if (!data) {
        const arr: string[] = [];
        if (lang === Language.Ko) {
          detailData.koreanTexts.map((value: any, index: number) => {
            arr.push(`checkbox_${lang}_${index}`);
          });
          setAllCheckBoxKR(!data);
        }
        if (lang === Language.En) {
          detailData.englishTexts.map((value: any, index: number) => {
            arr.push(`checkbox_${lang}_${index}`);
          });
          setAllCheckBoxEN(!data);
        }
        if (lang === Language.Zh) {
          detailData.chineseTexts.map((value: any, index: number) => {
            arr.push(`checkbox_${lang}_${index}`);
          });
          setAllCheckBoxZH(!data);
        }
        setCheckedList(arr);
      } else {
        if (lang === Language.Ko) {
          setAllCheckBoxKR(!data);
        }
        if (lang === Language.En) {
          setAllCheckBoxEN(!data);
        }
        if (lang === Language.Zh) {
          setAllCheckBoxZH(!data);
        }
        setCheckedList([]);
      }
    },
    [detailData]
  );

  const removeSelectedSentence = useCallback(
    (lang: Language) => {
      if (
        (lang === Language.Ko && allCheckBoxKR) ||
        (lang === Language.En && allCheckBoxEN) ||
        (lang === Language.Zh && allCheckBoxZH)
      ) {
        //전체선택 되있는 상태에서 삭제 하는 경우
        changeSentenceList('allDelete', 0, 0, lang);
        if (lang === Language.Ko) {
          setAllCheckBoxKR(false);
        }
        if (lang === Language.En) {
          setAllCheckBoxEN(false);
        }
        if (lang === Language.Zh) {
          setAllCheckBoxZH(false);
        }
        // setCheckedList([]);
      } else {
        let selectedArr: any[] = [];
        selectedArr = checkedList.filter((target) => target.match(`checkbox_${lang}`));
        selectedArr.forEach((value) => {
          const indexOfValue = value.split('_');
          let targetValue = '';
          if (lang === Language.Ko) {
            targetValue = detailData.koreanTexts[Number(indexOfValue[2])];
          }
          if (lang === Language.En) {
            targetValue = detailData.koreanTexts[Number(indexOfValue[2])];
          }
          if (lang === Language.Zh) {
            targetValue = detailData.koreanTexts[Number(indexOfValue[2])];
          }
          changeSentenceList('delete', targetValue, 0, lang);
        });
      }
      setCheckedList([]);
    },
    [checkedList, detailData]
  );

  const addSelectedSentence = useCallback((lang: Language) => {
    changeSentenceList('add', 0, 0, lang);
  }, []);

  const editTxtListChange = useCallback((value: any, index: number, lang: Language) => {
    handleTxtListChange('txt', value, index, lang);
  }, []);

  const checkSentence = useCallback(
    (id: string, lang: Language) => {
      const index = checkedList.indexOf(id);
      if (index === -1) {
        checkedList.push(id);
        handelAllCheckBox();
      } else {
        checkedList.splice(index, 1);
        if (lang === Language.Ko) {
          setAllCheckBoxKR(false);
        }
        if (lang === Language.En) {
          setAllCheckBoxEN(false);
        }
        if (lang === Language.Zh) {
          setAllCheckBoxZH(false);
        }
      }
      setCheckedList([...checkedList]);
    },
    [checkedList, detailData]
  );

  const handelAllCheckBox = useCallback(() => {
    // if (!detailData) {
    //   return;
    // }
    // if (checkedList.length === detailData.texts.length) {
    //   setAllCheckBox(true);
    // }
  }, [checkedList, detailData]);

  const checkedOrderDown = useCallback((value: any, lang: Language) => {
    handleTxtListChange('orderDown', value, 0, lang);
  }, []);

  const checkedOrderUp = useCallback((value: any, lang: Language) => {
    handleTxtListChange('orderUp', value, 0, lang);
  }, []);

  const nameCount = (detailData && detailData.name && detailData.name.length) || 0;

  return (
    <Container fluid>
      <div>
        <Breadcrumb icon="right angle" sections={BREADCRUMB_PATH} />
        <Header as="h2">대시보드 문구 관리</Header>
      </div>

      <div className="content">
        <Form>
          <Polyglot languages={detailData && detailData.languages}>
            {type !== 'add' && detailData && detailData.state !== 'temp' && (
              <Table celled>
                <colgroup>
                  <col width="20%" />
                  <col width="80%" />
                </colgroup>

                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell colSpan={2} className="title-header">
                      생성 정보
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  <Table.Row>
                    <Table.Cell className="tb-header">생성자 및 일시</Table.Cell>
                    <Table.Cell>
                      {detailData && getPolyglotToAnyString(detailData.registrantName)} | {'  '}
                      {detailData && moment(detailData!.registeredTime).format('YYYY.MM.DD HH:mm:ss')}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="tb-header">수정자 및 일시</Table.Cell>
                    <Table.Cell>
                      {detailData && getPolyglotToAnyString(detailData.modifierName)} | {'  '}
                      {detailData && moment(detailData!.modifiedTime).format('YYYY.MM.DD HH:mm:ss')}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="tb-header">문구 Set 상태</Table.Cell>
                    {(detailData && detailData.state === 'temp' && <Table.Cell>임시저장</Table.Cell>) ||
                      (detailData && detailData.state === 'regular' && detailData.show === true && (
                        <Table.Cell>노출중</Table.Cell>
                      )) ||
                      (detailData && detailData.state === 'regular' && detailData.show === false && (
                        <Table.Cell>Hide</Table.Cell>
                      ))}
                  </Table.Row>
                </Table.Body>
              </Table>
            )}
            <Table celled>
              <colgroup>
                <col width="20%" />
                <col width="80%" />
              </colgroup>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan={2} className="title-header">
                    기본 정보
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  {/*  <Table.Cell className="tb-header">*/}
                  {/*    지원 언어<span className="required">*</span>*/}
                  {/*  </Table.Cell>*/}
                  {/*  <Table.Cell>*/}
                  {/*    <Polyglot.Languages onChangeProps={handleExposureChange} />*/}
                  {/*  </Table.Cell>*/}
                  {/*</Table.Row>*/}
                  {/*<Table.Row>*/}
                  {/*  <Table.Cell className="tb-header">*/}
                  {/*    기본 언어<span className="required">*</span>*/}
                  {/*  </Table.Cell>*/}
                  {/*<Table.Cell>*/}
                  {/*  <Polyglot.Default onChangeProps={handleExposureChange} />*/}
                  {/*</Table.Cell>*/}
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="tb-header">
                    문구 Set 명<span className="required">*</span>
                  </Table.Cell>
                  <Table.Cell>
                    <Form.Group>
                      {/*<Polyglot.Input*/}
                      {/*  languageStrings={detailData.name}*/}
                      {/*  name="name"*/}
                      {/*  onChangeProps={handleExposureChange}*/}
                      {/*  maxLength={30}*/}
                      {/*/>*/}
                      <div className={nameCount > 30 ? 'ui right-top-count input error' : 'ui right-top-count input'}>
                        <span className="count">
                          <span className="now">{nameCount}</span>/<span className="max">30</span>
                        </span>
                        <Form.Field
                          control={Input}
                          width={16}
                          placeholder="문구 Set명을 입력해주세요. (30자까지 입력가능)"
                          value={detailData && detailData.name}
                          onChange={(e: any) => handleDataChange('name', e)}
                          maxLength={30}
                        />
                      </div>
                    </Form.Group>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="tb-header">
                    문구 Set 대시보드 노출 여부<span className="required">*</span>
                  </Table.Cell>
                  <Table.Cell>
                    <Form.Group>
                      <Form.Field
                        control={Select}
                        options={SelectType.dashBoardSentenceDetailShow}
                        value={detailData && detailData.show}
                        onChange={(e: any, data: any) => handleExposureChange('show', data.value)}
                      />
                    </Form.Group>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="tb-header">
                    노출 기간
                    <span className="required">*</span>
                  </Table.Cell>
                  <Table.Cell>
                    <Form.Group>
                      <Form.Field
                        control={Radio}
                        label="상시 노출"
                        checked={detailData && detailData.exposureDateOption === true}
                        onChange={() => {
                          exposureDateOptionChange(true);
                        }}
                      />
                      <Form.Field
                        control={Radio}
                        label="기간 설정"
                        checked={detailData && detailData.exposureDateOption === false}
                        onChange={() => {
                          exposureDateOptionChange(false);
                        }}
                      />
                    </Form.Group>
                    {!detailData.exposureDateOption && (
                      <Form.Group>
                        {detailData && detailData.startDate !== undefined && detailData.endDate !== undefined && (
                          <>
                            <Form.Field>
                              <div className="ui input right icon">
                                <DatePicker
                                  placeholderText="시작날짜를 선택해주세요."
                                  selected={moment(detailData.startDate).toDate()}
                                  onChange={(e) => handleDateChange('startDate', e)}
                                  dateFormat="yyyy.MM.dd"
                                  minDate={moment().toDate()}
                                />
                                <Icon name="calendar alternate outline" />
                              </div>
                            </Form.Field>
                            <div className="dash">-</div>
                            <Form.Field>
                              <div className="ui input right icon">
                                <DatePicker
                                  placeholderText="종료날짜를 선택해주세요."
                                  selected={moment(detailData.endDate).toDate()}
                                  onChange={(e) => handleDateChange('endDate', e)}
                                  dateFormat="yyyy.MM.dd"
                                  minDate={moment(detailData.startDate).toDate()}
                                />
                                <Icon name="calendar alternate outline" />
                              </div>
                            </Form.Field>
                          </>
                        )}
                      </Form.Group>
                    )}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <FormTable title="문구 리스트">
              {LanguageTypes.map((language, index) => {
                let texts: any[] = [];
                let checked = false;
                if (language.value.lang === Language.Ko) {
                  texts = detailData.koreanTexts;
                  checked = allCheckBoxKR;
                } else if (language.value.lang === Language.En) {
                  texts = detailData.englishTexts;
                  checked = allCheckBoxEN;
                } else if (language.value.lang === Language.Zh) {
                  texts = detailData.chineseTexts;
                  checked = allCheckBoxZH;
                }
                return (
                  <FormTable.Row name={language.text} key={index}>
                    <Table celled>
                      <colgroup>
                        <col width="15%" />
                        <col width="85%" />
                      </colgroup>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell colSpan={2}>
                            <Grid verticalAlign="middle">
                              <Grid.Column width={3}>
                                <Form.Field
                                  label="전체 선택"
                                  control={Checkbox}
                                  checked={checked}
                                  onChange={() => checkAll(checked, language.value.lang)}
                                />
                              </Grid.Column>
                              <Grid.Column width={13}>
                                <div className="right">
                                  <Button onClick={() => removeSelectedSentence(language.value.lang)}>Delete</Button>
                                  <Button onClick={() => addSelectedSentence(language.value.lang)}>추가</Button>
                                </div>
                              </Grid.Column>
                            </Grid>
                          </Table.Cell>
                        </Table.Row>
                        {texts &&
                          texts.map((text: string, idx) => {
                            return (
                              <Table.Row key={idx}>
                                <Table.Cell className="tb-header">
                                  <Form.Field
                                    label={idx + 1}
                                    control={Checkbox}
                                    checked={checkedList.includes(`checkbox_${language.value.lang}_${idx}`)}
                                    onChange={() => {
                                      return checkSentence(
                                        `checkbox_${language.value.lang}_${idx}`,
                                        language.value.lang
                                      );
                                    }}
                                  />
                                  <div className="action-btn-group">
                                    {text.length > 0 ? (
                                      <>
                                        <Button
                                          icon
                                          size="mini"
                                          basic
                                          onClick={() => checkedOrderDown('checkbox_' + idx, language.value.lang)}
                                        >
                                          <Icon name="angle down" />
                                        </Button>
                                        <Button
                                          icon
                                          size="mini"
                                          basic
                                          onClick={() => checkedOrderUp('checkbox_' + idx, language.value.lang)}
                                        >
                                          <Icon name="angle up" />
                                        </Button>
                                      </>
                                    ) : null}
                                  </div>
                                </Table.Cell>
                                <Table.Cell>
                                  <Form.Field
                                    control={Input}
                                    name={0}
                                    value={text && text}
                                    onChange={(e: any, data: any) =>
                                      editTxtListChange(data.value, idx, language.value.lang)
                                    }
                                  />
                                </Table.Cell>
                              </Table.Row>
                            );
                          })}
                      </Table.Body>
                    </Table>
                  </FormTable.Row>
                );
              })}
            </FormTable>
          </Polyglot>
        </Form>
      </div>

      <div className="btn-group">
        <Button onClick={routeToList} type="button">
          목록
        </Button>
        <div className="fl-right">
          {detailData && detailData.state === 'temp' && (
            <Button basic onClick={() => handleTempSave()} type="button">
              임시저장
            </Button>
          )}
          {type === 'add' && (
            <Button basic onClick={() => handleTempSave()} type="button">
              임시저장
            </Button>
          )}
          <Button primary onClick={() => handleSave()} type="button">
            저장
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default DashBoardSentenceDetailView;
