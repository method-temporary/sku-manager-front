import moment from 'moment';
import React, { useCallback, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Checkbox, Form, Grid, Icon, Pagination, Table, Select, Modal, Input, Search } from 'semantic-ui-react';
import XLSX, { WorkBook } from 'xlsx';

import { reactAlert, reactConfirm } from '@nara.platform/accent';

import { NaOffsetElementList, SelectType, NameValueList } from 'shared/model';
import { SubActions } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { removeConcepts, modifyConcept, registerConcepts } from 'board/tag/api/tagApi';
import { getConceptCdo } from 'board/tag/store/ConceptCdoStore';
import ConceptCdo, { getEmptyConceptCdo, addCreatorConceptCdos } from 'board/tag/model/ConceptCdo';
import {
  requestFindAllConcept,
  requestFindConcept,
  requestFindAllConceptExcel,
  requestExistsConcept,
  requestFindConceptNames,
  selectField,
} from 'board/tag/service/requestTag';
import { setSearchBox } from 'board/tag/store/SearchBoxStore';
import Term, { convertToExcel } from 'board/tag/model/Term';
import Concept from 'board/tag/model/Concept';
import { convertToNames } from 'board/tag/model/Concept';
import { SearchBox } from 'board/tag/model/SearchBox';

interface ConceptListViewProps {
  conceptList: NaOffsetElementList<Term>;
  searchBox: SearchBox;
}

function timeToDateString(time: number) {
  return moment(time).format('YYYY.MM.DD');
}

const ConceptListView: React.FC<ConceptListViewProps> = function ConceptListView({ conceptList, searchBox }) {
  const location = useLocation();
  const history = useHistory();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [concepts, setConcepts] = useState<any[]>();
  const [selectedList, setSelectedList] = useState<(string | undefined)[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(true);
  const [conceptId, setConceptId] = useState<string>('');
  const [activePage, setActivePage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);

  const [conceptCdoList, setConceptCdoList] = useState<ConceptCdo[]>();

  const [searchResult, setSearchResult] = useState<string[]>();
  const [originTerm, setOriginTerm] = useState<string>();

  const CREATE_REQUIRE_ERROR = 'Concept을 입력해주세요.';
  const CREATE_EXIST_ERROR = '중복된 Term가 존재합니다.';
  const CREATE_SUCCESS = '저장되었습니다.';

  const fileInputRef = React.createRef<HTMLInputElement>();

  useEffect(() => {
    setConcepts(selectField());
  }, []);

  const routeToCreate = useCallback(() => {
    setConceptId('');
    setConceptCdoList([getEmptyConceptCdo()]);
    setModalOpen(true);
  }, []);

  const routeToDetail = useCallback(
    async (termId) => {
      setConceptCdoList([getEmptyConceptCdo()]);

      const cdo = getEmptyConceptCdo();
      setConceptId(termId);
      requestFindConcept(termId).then((term) => {
        // conceptCdoList[0].termName
        setOriginTerm(term.name);
        cdo.conceptId = term.concept.id;
        cdo.termName = term.name;
        cdo.synonymTag = term.synonymTag;
        cdo.conceptName = term.concept.name;
        setConceptCdoList([cdo]);
        setModalOpen(true);
      });
    },
    [location, history]
  );

  const requestSave = useCallback(
    async (exceldata?: ConceptCdo[]) => {
      const conceptCdo = getConceptCdo() || getEmptyConceptCdo();
      if (conceptCdoList && conceptCdoList[0].conceptName === '') {
        reactAlert({ title: '안내', message: CREATE_REQUIRE_ERROR });
        return;
      }

      if (exceldata) {
        await registerConcepts(exceldata);
        requestFindAllConcept();
        return;
      }

      if (conceptId === '' && conceptCdoList !== undefined) {
        setConceptCdoList(
          conceptCdoList.map((cdo, i) => {
            cdo.conceptId = conceptCdoList[0].conceptId;
            cdo.conceptName = conceptCdoList[0].conceptName;

            return cdo;
          })
        );
        conceptCdoList.some(async (concept, index) => {
          /* eslint-disable */
          await requestExistsConcept(concept).then(async (flag) => {
            if (flag) {
              reactAlert({ title: '안내', message: CREATE_EXIST_ERROR });
              return;
            } else {
              await registerConcepts(conceptCdoList).then(() => setModalOpen(false));
            }
          });
          /* eslint-enable */
          reactAlert({ title: '안내', message: CREATE_SUCCESS });
          requestFindAllConcept();
        });
      } else {
        const nameValueList = new NameValueList();
        if (conceptCdoList !== undefined) {
          nameValueList.nameValues.push({
            name: 'name',
            value: conceptCdoList[0].termName || '',
          });
          nameValueList.nameValues.push({
            name: 'synonymTag',
            value: conceptCdoList[0].synonymTag || '',
          });
          nameValueList.nameValues.push({
            name: 'conceptName',
            value: conceptCdoList[0].conceptName,
          });
          nameValueList.nameValues.push({
            name: 'conceptId',
            value: conceptCdoList[0].conceptId,
          });
          const name = localStorage.getItem('nara.displayName')!;
          nameValueList.nameValues.push({
            name: 'modifierName',
            value: name,
          });
        }

        conceptCdoList &&
          (await requestExistsConcept(conceptCdoList[0]).then(async (flag) => {
            if (originTerm !== conceptCdoList[0].termName && flag) {
              reactAlert({ title: '안내', message: CREATE_EXIST_ERROR });
            } else {
              await modifyConcept(conceptId, nameValueList).then(() => setModalOpen(false));
              reactAlert({ title: '안내', message: CREATE_SUCCESS });
            }
          }));

        requestFindAllConcept();
      }
    },
    [conceptId, conceptCdoList]
  );

  const checkAll = useCallback(() => {
    if (selectAll) {
      setSelectedList(conceptList && conceptList.results.map((item) => item.id));
      setSelectAll(!selectAll);
    } else {
      setSelectedList([]);
      setSelectAll(!selectAll);
    }
  }, [selectAll, conceptList]);

  const checkOne = (conceptId: string) => {
    const copiedSelectedList: (string | undefined)[] = [...selectedList];
    const index = copiedSelectedList.indexOf(conceptId);

    if (index >= 0) {
      const newSelectedList = copiedSelectedList.slice(0, index).concat(copiedSelectedList.slice(index + 1));
      setSelectedList(newSelectedList);
    } else {
      copiedSelectedList.push(conceptId);
      setSelectedList(copiedSelectedList);
    }
  };

  const deleteConcepts = useCallback(() => {
    if (selectedList && selectedList.length === 0) {
      reactAlert({ title: '알림', message: 'Term을 선택해 주세요.' });
      return;
    }

    reactConfirm({
      title: '알림',
      message: '선택한 항목을 삭제하시겠습니까?',
      onOk: async () => {
        await removeConcepts(selectedList);
        setSelectedList([]);
        requestFindAllConcept();
      },
    });
  }, [selectedList, searchBox]);

  const deleteConceptDetail = useCallback((conceptId: string) => {
    reactConfirm({
      title: '알림',
      message: '선택한 항목을 삭제하시겠습니까?',
      onOk: async () => {
        await removeConcepts([conceptId]);
        setSelectedList([]);
        requestFindAllConcept();
        setModalOpen(false);
      },
    });
  }, []);

  const changePage = useCallback(
    (_: any, data: any) => {
      const activePage: number = data.activePage;
      setActivePage(data.activePage);
      const offset = (activePage - 1) * limit;
      setOffset(offset);
      setSearchBox({
        ...searchBox,
        offset,
        limit,
      });
      requestFindAllConcept();
    },
    [limit]
  );

  const changeLimit = useCallback(
    (_: any, data: any) => {
      const limit: number = data.value;
      setActivePage(1);
      setLimit(limit);
      setSearchBox({
        ...searchBox,
        offset,
        limit,
      });
      requestFindAllConcept();
    },
    [offset, limit]
  );

  const createFrom = useCallback(() => {
    if (conceptCdoList !== undefined) {
      setConceptCdoList([...conceptCdoList, getEmptyConceptCdo()]);
    }
  }, [conceptCdoList]);

  const deleteFrom = useCallback(
    (formIndex: number) => {
      if (conceptCdoList !== undefined) {
        setConceptCdoList(conceptCdoList.filter((cdo, index) => index !== formIndex));
      }
    },
    [conceptCdoList]
  );

  const requestExcel = useCallback(async () => {
    const fileName = 'Concept.xlsx';
    await requestFindAllConceptExcel().then(({ results, empty }) => {
      if (!empty) {
        const excel = XLSX.utils.json_to_sheet(convertToExcel(results));
        const temp = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(temp, excel, 'Concept');
        XLSX.writeFile(temp, fileName, { compression: true });
      }
    });
    return fileName;
  }, []);

  const uploadFile = useCallback((file: File) => {
    const fileReader = new FileReader();

    fileReader.onload = (e: any) => {
      let binary: string = '';
      const data = new Uint8Array(e.target.result);

      const length = data.byteLength;
      for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(data[i]);
      }
      const workbook: WorkBook = XLSX.read(binary, { type: 'binary' });

      workbook.SheetNames.forEach(async (item: any) => {
        const jsonArray = XLSX.utils.sheet_to_json<ConceptCdo>(workbook.Sheets[item]);

        if (jsonArray.length === 0) {
          return;
        }
        await requestSave(addCreatorConceptCdos(jsonArray));
        reactAlert({ title: '안내', message: CREATE_SUCCESS });
      });
    };
    if (file && file instanceof File) {
      fileReader.readAsArrayBuffer(file);
    }
  }, []);

  return (
    <>
      <Grid className="list-info">
        <Grid.Row>
          <Grid.Column width={8}>
            <span>
              {conceptList ? '총' : '전체'} <strong>{conceptList.totalCount}</strong>
              {conceptList.results ? '개의 Term 검색 결과' : '개 Term 등록'}
            </span>
          </Grid.Column>
          <Grid.Column width={8}>
            <div className="right">
              <Select
                className="ui small-border dropdown m0"
                value={limit}
                control={Select}
                options={SelectType.limit}
                onChange={changeLimit}
              />
              <Button
                type="button"
                onClick={() => {
                  if (fileInputRef && fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
              >
                <Icon name="file excel outline" />
                <input
                  id="file"
                  type="file"
                  ref={fileInputRef}
                  accept=".xlsx, .xls"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => e.target.files && uploadFile(e.target.files[0])}
                  onClick={(e: any) => {
                    e.target.value = '';
                  }}
                  hidden
                />
                엑셀 업로드
              </Button>
              <SubActions.ExcelButton download onClick={async () => requestExcel()} />
              <Button type="button" onClick={() => deleteConcepts()}>
                <Icon name="minus" />
                Delete
              </Button>
              <Button type="button" onClick={routeToCreate}>
                <Icon name="plus" />
                Create
              </Button>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Table celled selectable>
        <colgroup>
          <col width="4%" />
          <col width="5%" />
          <col width="12%" />
          <col width="12%" />
          <col width="12%" />
          <col width="12%" />
          <col width="12%" />
          <col width="12%" />
          <col width="12%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">
              <Checkbox
                className="base"
                label=""
                name="radioGroup"
                checked={selectedList && selectedList.length > 0 && selectedList.length === conceptList.results.length}
                value={selectAll ? 'Yes' : 'No'}
                onChange={(e: any, data: any) => checkAll()}
              />
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Concept</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Term</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">유사어</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">등록일</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">생성자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">최종업데이트</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">수정자</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {conceptList && conceptList.results && conceptList.results.length === 0 && (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={10}>
                <div className="no-cont-wrap no-contents-icon">
                  <Icon className="no-contents80" />
                  <div className="sr-only">콘텐츠 없음</div>
                  <div className="text">검색 결과를 찾을 수 없습니다.</div>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
          {conceptList &&
            conceptList.results.length > 0 &&
            conceptList.results.map((concept, index) => (
              <Table.Row key={concept.id}>
                <Table.Cell textAlign="center">
                  <Checkbox
                    className="base"
                    label=""
                    name="radioGroup"
                    value={concept.id}
                    checked={selectedList && selectedList.includes(concept.id)}
                    onChange={(e: any) => checkOne(concept.id)}
                  />
                </Table.Cell>
                <Table.Cell textAlign="center">{conceptList?.totalCount - index - (activePage - 1) * limit}</Table.Cell>

                <Table.Cell onClick={() => routeToDetail(concept.id)}>{concept.concept.name}</Table.Cell>
                <Table.Cell onClick={() => routeToDetail(concept.id)}>{concept.name}</Table.Cell>
                <Table.Cell onClick={() => routeToDetail(concept.id)}>{concept.synonymTag}</Table.Cell>
                <Table.Cell textAlign="center" onClick={() => routeToDetail(concept.id)}>
                  {timeToDateString(concept.registeredTime)}
                </Table.Cell>
                <Table.Cell onClick={() => routeToDetail(concept.id)}>
                  {getPolyglotToAnyString(concept.registrantName)}
                </Table.Cell>
                <Table.Cell onClick={() => routeToDetail(concept.id)}>
                  {concept.modifiedTime ? timeToDateString(concept.modifiedTime) : ''}
                </Table.Cell>
                <Table.Cell onClick={() => routeToDetail(concept.id)}>
                  {getPolyglotToAnyString(concept.modifierName)}
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      <div className="center">
        <Pagination
          activePage={activePage}
          totalPages={Math.ceil(conceptList.totalCount === 0 ? 1 : conceptList.totalCount / searchBox.limit!)}
          onPageChange={changePage}
        />
      </div>
      <Modal
        open={modalOpen}
        // className="category-modal main-channel"
        size="large"
      >
        <Modal.Header className="res">Term 등록</Modal.Header>
        <Modal.Content scrolling className="fit-layout">
          <Form>
            {conceptCdoList && (
              <Table celled>
                <colgroup>
                  <col width="15%" />
                  <col width="35%" />
                  <col width="15%" />
                  <col width="30%" />
                </colgroup>

                <Table.Body>
                  <Table.Row>
                    <Table.Cell className="tb-header">
                      concept <span className="required">*</span>
                    </Table.Cell>
                    <Table.Cell colSpan={3}>
                      <Search
                        disabled={conceptId !== ''}
                        loading={false}
                        onResultSelect={(e, data) => {
                          // dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title })
                          setConceptCdoList(
                            conceptCdoList.map((cdo, i) => {
                              if (i === 0) {
                                cdo.conceptName = data.result.title;
                              }
                              return cdo;
                            })
                          );
                          setSearchResult([]);
                        }}
                        // onSearchChange={handleSearchChange}
                        results={searchResult ? convertToNames(searchResult) : ''}
                        onSearchChange={async (e: any) => {
                          setConceptCdoList(
                            conceptCdoList.map((cdo, i) => {
                              if (i === 0) {
                                cdo.conceptName = e.target.value;
                              }
                              return cdo;
                            })
                          );
                          setSearchResult(await requestFindConceptNames(e.target.value));
                        }}
                        value={conceptCdoList[0].conceptName}
                      />
                    </Table.Cell>
                  </Table.Row>
                  {conceptId !== '' && (
                    <>
                      <Table.Row>
                        <Table.Cell className="tb-header">Term</Table.Cell>
                        <Table.Cell>
                          <Form.Group>
                            <Form.Field
                              control={Input}
                              width={16}
                              value={conceptCdoList[0].termName}
                              onChange={(e: any) =>
                                setConceptCdoList(
                                  conceptCdoList.map((cdo, i) => {
                                    if (i === 0) {
                                      cdo.termName = e.target.value;
                                    }
                                    return cdo;
                                  })
                                )
                              }
                            />
                          </Form.Group>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell className="tb-header">유사어</Table.Cell>
                        <Table.Cell>
                          <Form.Group>
                            <Form.Field
                              control={Input}
                              width={16}
                              value={conceptCdoList[0].synonymTag}
                              onChange={(e: any) =>
                                setConceptCdoList(
                                  conceptCdoList.map((cdo, i) => {
                                    if (i === 0) {
                                      cdo.synonymTag = e.target.value;
                                    }
                                    return cdo;
                                  })
                                )
                              }
                            />
                          </Form.Group>
                        </Table.Cell>
                      </Table.Row>
                    </>
                  )}
                  {conceptId == '' &&
                    conceptCdoList?.map((concept, index) => (
                      <>
                        <Table.Row>
                          <Table.Cell className="tb-header">
                            Term <Button onClick={() => createFrom()}>+</Button>
                            {conceptCdoList.length !== 1 && <Button onClick={() => deleteFrom(index)}>-</Button>}
                          </Table.Cell>
                          <Table.Cell>
                            <Form.Group>
                              <Form.Field
                                control={Input}
                                width={8}
                                value={conceptCdoList[index].termName}
                                onChange={(e: any) =>
                                  setConceptCdoList(
                                    conceptCdoList.map((cdo, i) => {
                                      if (index === i) {
                                        cdo.termName = e.target.value;
                                      }
                                      return cdo;
                                    })
                                  )
                                }
                              />
                            </Form.Group>
                          </Table.Cell>
                          <Table.Cell className="tb-header">유사어</Table.Cell>
                          <Table.Cell>
                            <Form.Group>
                              <Form.Field
                                control={Input}
                                width={8}
                                value={conceptCdoList[index].synonymTag}
                                onChange={(e: any) =>
                                  setConceptCdoList(
                                    conceptCdoList.map((cdo, i) => {
                                      if (index === i) {
                                        cdo.synonymTag = e.target.value;
                                      }
                                      return cdo;
                                    })
                                  )
                                }
                              />
                            </Form.Group>
                          </Table.Cell>
                        </Table.Row>
                      </>
                    ))}
                </Table.Body>
              </Table>
            )}
          </Form>
        </Modal.Content>

        <Modal.Actions>
          {conceptId !== '' && (
            <Button
              className="w190 d"
              onClick={async () => {
                deleteConceptDetail(conceptId);
              }}
            >
              Delete
            </Button>
          )}
          <Button
            className="w190 d"
            onClick={() => {
              setModalOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            className="w190 p"
            onClick={() => {
              requestSave();
            }}
          >
            OK
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default ConceptListView;
