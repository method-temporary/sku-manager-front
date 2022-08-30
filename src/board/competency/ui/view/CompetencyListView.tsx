import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Checkbox, Form, Grid, Icon, Pagination, Table, Select, Modal, Input, Search } from 'semantic-ui-react';
import XLSX, { WorkBook } from 'xlsx';

import { reactAlert, reactConfirm } from '@nara.platform/accent';

import { SubActions } from 'shared/components';
import { SelectType, NaOffsetElementList, NameValueList } from 'shared/model';

import { SearchBox } from 'board/competency/model/SearchBox';
import { removeCompetencys, modifyCompetency, registerCompetencys } from 'board/competency/api/competencyApi';
import { getCompetencyCdo } from 'board/competency/store/CompetencyCdoStore';
import CompetencyCdo, { getEmptyCompetencyCdo, addCreatorCompetencyCdos } from 'board/competency/model/CompetencyCdo';
import {
  requestFindAllCompetency,
  requestFindCompetency,
  requestFindAllCompetencyExcel,
  requestExistsCompetency,
  requestFindCompetencyNames,
} from 'board/competency/service/requestCompetency';
import { setSearchBox } from 'board/competency/store/SearchBoxStore';
import Competency, { CompetencyViewModel, convertToExcel, convertToNames } from '../../model/Competency';

interface CompetencyListViewProps {
  competencyList: NaOffsetElementList<CompetencyViewModel>;
  searchBox: SearchBox;
}

function timeToDateString(time: number) {
  return moment(time).format('YYYY.MM.DD');
}

const CompetencyListView: React.FC<CompetencyListViewProps> = function CompetencyListView({
  competencyList,
  searchBox,
}) {
  // const [filterLimit] = useCompetencyRdoLimit();
  const location = useLocation();
  const history = useHistory();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [selectedList, setSelectedList] = useState<(string | undefined)[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(true);
  const [competencyId, setCompetencyId] = useState<string>('');
  const [activePage, setActivePage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);

  const [competencyCdoList, setCompetencyCdoList] = useState<CompetencyCdo[]>();

  const [searchResult, setSearchResult] = useState<string[]>();

  const CREATE_REQUIRE_ERROR = '역량군과 역량명을 모두 입력해주세요.';
  const CREATE_EXIST_ERROR = '중복된 역량이 존재합니다.';
  const CREATE_SUCCESS = '저장되었습니다.';

  const COMPETENCY_TYPE_OPTIONS = [
    { key: 'DT', text: 'DT', value: 'DT' },
    { key: 'AI', text: 'AI', value: 'AI' },
  ];
  const fileInputRef = React.createRef<HTMLInputElement>();

  const routeToCreate = useCallback(() => {
    setCompetencyId('');
    setCompetencyCdoList([getEmptyCompetencyCdo()]);
    setModalOpen(true);
  }, []);
  const routeToDetail = useCallback(
    async (competencyId) => {
      setCompetencyCdoList([getEmptyCompetencyCdo()]);

      const cdo = getEmptyCompetencyCdo();
      setCompetencyId(competencyId);
      requestFindCompetency(competencyId).then((competency) => {
        cdo.competencyGroup = competency.competencyGroup;
        cdo.skill = competency.skill;
        cdo.synonym = competency.synonym;
        cdo.competencyName = competency.competencyName;
        setCompetencyCdoList([cdo]);
        setModalOpen(true);
      });
    },
    [location, history]
  );

  const requestSave = useCallback(
    async (exceldata?: CompetencyCdo[]) => {
      const competencyCdo = getCompetencyCdo() || getEmptyCompetencyCdo();
      if (
        competencyCdoList &&
        (competencyCdoList.find((cdo, index) => cdo.competencyGroup === '') ||
          competencyCdoList.find((cdo, index) => cdo.competencyName === ''))
      ) {
        reactAlert({ title: '안내', message: CREATE_REQUIRE_ERROR });
        return;
      }

      if (exceldata) {
        await registerCompetencys(exceldata);
        requestFindAllCompetency();
        return;
      }

      if (competencyId === '' && competencyCdoList !== undefined) {
        competencyCdoList.some(async (competency, index) => {
          /* eslint-disable */
          await requestExistsCompetency(competency).then(async (flag) => {
            if (flag) {
              reactAlert({ title: '안내', message: CREATE_EXIST_ERROR });
              return;
            } else {
              await registerCompetencys(competencyCdoList).then(() => setModalOpen(false));
            }
          });
          /* eslint-enable */
          if (competencyCdoList.length - 1 === index) {
            requestFindAllCompetency();
          }
        });
      } else {
        const nameValueList = new NameValueList();
        if (competencyCdoList !== undefined) {
          nameValueList.nameValues.push({
            name: 'skill',
            value: competencyCdoList[0].skill || '',
          });
          nameValueList.nameValues.push({
            name: 'synonym',
            value: competencyCdoList[0].synonym || '',
          });
          nameValueList.nameValues.push({
            name: 'competencyGroup',
            value: competencyCdoList[0].competencyGroup,
          });
          nameValueList.nameValues.push({
            name: 'competencyName',
            value: competencyCdoList[0].competencyName,
          });
          const name = localStorage.getItem('nara.displayName')!;
          const email = localStorage.getItem('nara.email')!;
          nameValueList.nameValues.push({
            name: 'name',
            value: name,
          });
          nameValueList.nameValues.push({
            name: 'email',
            value: email,
          });
        }
        await modifyCompetency(competencyId, nameValueList).then(() => setModalOpen(false));
        requestFindAllCompetency();
      }
      reactAlert({ title: '안내', message: CREATE_SUCCESS });
    },
    [competencyId, competencyCdoList]
  );

  const checkAll = useCallback(() => {
    if (selectAll) {
      setSelectedList(competencyList && competencyList.results.map((item) => item.competencyId));
      setSelectAll(!selectAll);
    } else {
      setSelectedList([]);
      setSelectAll(!selectAll);
    }
  }, [selectAll, competencyList]);

  const checkOne = (competencyId: string) => {
    const copiedSelectedList: (string | undefined)[] = [...selectedList];
    const index = copiedSelectedList.indexOf(competencyId);

    if (index >= 0) {
      const newSelectedList = copiedSelectedList.slice(0, index).concat(copiedSelectedList.slice(index + 1));
      setSelectedList(newSelectedList);
    } else {
      copiedSelectedList.push(competencyId);
      setSelectedList(copiedSelectedList);
    }
  };

  const deleteCompetencys = useCallback(() => {
    if (selectedList && selectedList.length === 0) {
      reactAlert({ title: '알림', message: '역량을 선택해 주세요.' });
      return;
    }

    reactConfirm({
      title: '알림',
      message: '선택한 항목을 삭제하시겠습니까?',
      onOk: async () => {
        await removeCompetencys(selectedList);
        setSelectedList([]);
        requestFindAllCompetency();
      },
    });
  }, [selectedList, searchBox]);

  const deleteCompetencyDetail = useCallback((competencyId: string) => {
    reactConfirm({
      title: '알림',
      message: '선택한 항목을 삭제하시겠습니까?',
      onOk: async () => {
        await removeCompetencys([competencyId]);
        setSelectedList([]);
        requestFindAllCompetency();
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
      requestFindAllCompetency();
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
      requestFindAllCompetency();
    },
    [offset, limit]
  );

  const createFrom = useCallback(() => {
    if (competencyCdoList !== undefined) {
      setCompetencyCdoList([...competencyCdoList, getEmptyCompetencyCdo()]);
    }
  }, [competencyCdoList]);

  const deleteFrom = useCallback(
    (formIndex: number) => {
      if (competencyCdoList !== undefined) {
        setCompetencyCdoList(competencyCdoList.filter((cdo, index) => index !== formIndex));
      }
    },
    [competencyCdoList]
  );

  const requestExcel = useCallback(async () => {
    const fileName = 'Competency.xlsx';
    await requestFindAllCompetencyExcel().then(({ results, empty }) => {
      if (!empty) {
        const excel = XLSX.utils.json_to_sheet(convertToExcel(results));
        const temp = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(temp, excel, 'Competency');
        XLSX.writeFile(temp, fileName);
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
        // console.log('item : ', item);
        const jsonArray = XLSX.utils.sheet_to_json<CompetencyCdo>(workbook.Sheets[item]);

        if (jsonArray.length === 0) {
          return;
        }
        requestSave(addCreatorCompetencyCdos(jsonArray));
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
              {competencyList ? '총' : '전체'}
              <strong>{competencyList.totalCount}</strong>
              {competencyList.results ? '개의 역량 검색 결과' : '개 역량 등록'}
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
                  hidden
                />
                엑셀 업로드
              </Button>
              <SubActions.ExcelButton download onClick={async () => requestExcel()} />
              <Button type="button" onClick={() => deleteCompetencys()}>
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
          <col width="12%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">
              {' '}
              <Checkbox
                className="base"
                label=""
                name="radioGroup"
                checked={
                  selectedList && selectedList.length > 0 && selectedList.length === competencyList.results.length
                }
                value={selectAll ? 'Yes' : 'No'}
                onChange={(e: any, data: any) => checkAll()}
              />
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">역량군</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">역량명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Skill</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">유사어</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">등록일</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">생성자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">최종업데이트</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">수정자</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {competencyList && competencyList.results && competencyList.results.length === 0 && (
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
          {competencyList &&
            competencyList.results.length > 0 &&
            competencyList.results.map((competency, index) => (
              <Table.Row key={competency.competencyId}>
                <Table.Cell textAlign="center">
                  <Checkbox
                    className="base"
                    label=""
                    name="radioGroup"
                    value={competency.competencyId}
                    checked={selectedList && selectedList.includes(competency.competencyId)}
                    onChange={(e: any) => checkOne(competency.competencyId)}
                  />
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {competencyList?.totalCount - index - (activePage - 1) * limit}
                </Table.Cell>

                <Table.Cell onClick={() => routeToDetail(competency.competencyId)}>
                  {competency.competencyGroup}
                </Table.Cell>
                <Table.Cell onClick={() => routeToDetail(competency.competencyId)}>
                  {competency.competencyName}
                </Table.Cell>
                <Table.Cell onClick={() => routeToDetail(competency.competencyId)}>{competency.skill}</Table.Cell>
                <Table.Cell onClick={() => routeToDetail(competency.competencyId)}>{competency.synonym}</Table.Cell>
                <Table.Cell textAlign="center" onClick={() => routeToDetail(competency.competencyId)}>
                  {timeToDateString(competency.createTime)}
                </Table.Cell>
                <Table.Cell onClick={() => routeToDetail(competency.competencyId)}>
                  {competency.creator.name}
                </Table.Cell>
                <Table.Cell onClick={() => routeToDetail(competency.competencyId)}>
                  {competency.updateTime ? timeToDateString(competency.updateTime) : ''}
                </Table.Cell>
                <Table.Cell onClick={() => routeToDetail(competency.competencyId)}>
                  {competency.updater && competency.updater.name}
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      <div className="center">
        <Pagination
          activePage={activePage}
          totalPages={Math.ceil(competencyList.totalCount === 0 ? 1 : competencyList.totalCount / searchBox.limit!)}
          onPageChange={changePage}
        />
      </div>

      <Modal
        open={modalOpen}
        // className="category-modal main-channel"
        size="large"
      >
        <Modal.Header className="res">역량 등록</Modal.Header>
        <Modal.Content scrolling className="fit-layout">
          <Form>
            {competencyCdoList?.map((competency, index) => (
              <Table celled>
                <colgroup>
                  <col width="20%" />
                  <col width="80%" />
                </colgroup>

                <Table.Body key={index}>
                  <Table.Row>
                    <Table.Cell className="tb-header">
                      역량군 <span className="required">*</span>
                    </Table.Cell>
                    <Table.Cell>
                      <Form.Group>
                        {competencyId === '' && (
                          <Form.Field
                            control={Select}
                            placeholder="Select"
                            options={COMPETENCY_TYPE_OPTIONS}
                            onChange={(e: any, data: any) =>
                              setCompetencyCdoList(
                                competencyCdoList.map((cdo, i) => {
                                  if (index === i) {
                                    cdo.competencyGroup = data.value;
                                  }
                                  return cdo;
                                })
                              )
                            }
                          />
                        )}
                        {competencyId !== '' && (
                          <Form.Field
                            control={Input}
                            width={10}
                            value={competencyCdoList[index].competencyGroup}
                            disabled={competencyId !== ''}
                            onChange={(e: any) =>
                              setCompetencyCdoList(
                                competencyCdoList.map((cdo, i) => {
                                  if (index === i) {
                                    cdo.competencyGroup = e.target.value;
                                  }
                                  return cdo;
                                })
                              )
                            }
                          />
                        )}
                      </Form.Group>
                    </Table.Cell>
                    {competencyId === '' && (
                      <>
                        <Table.Cell rowSpan={5}>
                          <Button onClick={() => createFrom()}>+</Button>
                        </Table.Cell>

                        {competencyCdoList.length !== 1 && (
                          <Table.Cell rowSpan={5}>
                            <Button onClick={() => deleteFrom(index)}>-</Button>
                          </Table.Cell>
                        )}
                      </>
                    )}
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="tb-header">
                      역량명 <span className="required">*</span>
                    </Table.Cell>
                    <Table.Cell>
                      <Search
                        disabled={competencyId !== ''}
                        loading={false}
                        onResultSelect={(e, data) => {
                          // dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title })
                          setCompetencyCdoList(
                            competencyCdoList.map((cdo, i) => {
                              if (index === i) {
                                cdo.competencyName = data.result.title;
                              }
                              return cdo;
                            })
                          );
                          setSearchResult([]);
                        }}
                        // onSearchChange={handleSearchChange}
                        results={searchResult ? convertToNames(searchResult) : ''}
                        onSearchChange={async (e: any) => {
                          setCompetencyCdoList(
                            competencyCdoList.map((cdo, i) => {
                              if (index === i) {
                                cdo.competencyName = e.target.value;
                              }
                              return cdo;
                            })
                          );
                          setSearchResult(await requestFindCompetencyNames(e.target.value));
                        }}
                        value={competencyCdoList[index].competencyName}
                      />
                      {/* <Form.Group>
                        <Form.Field
                          control={Input}
                          width={16}
                          value={competencyCdoList[index].competencyName}
                          disabled={competencyId !== ''}
                          onChange={(e: any) =>
                            setCompetencyCdoList(
                              competencyCdoList.map((cdo, i) => {
                                if (index === i) {
                                  cdo.competencyName = e.target.value;
                                }
                                return cdo;
                              })
                            )
                          }
                        />
                      </Form.Group> */}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="tb-header">Skill</Table.Cell>
                    <Table.Cell>
                      <Form.Group>
                        <Form.Field
                          control={Input}
                          width={16}
                          value={competencyCdoList[index].skill}
                          onChange={(e: any) =>
                            setCompetencyCdoList(
                              competencyCdoList.map((cdo, i) => {
                                if (index === i) {
                                  cdo.skill = e.target.value;
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
                          value={competencyCdoList[index].synonym}
                          onChange={(e: any) =>
                            setCompetencyCdoList(
                              competencyCdoList.map((cdo, i) => {
                                if (index === i) {
                                  cdo.synonym = e.target.value;
                                }
                                return cdo;
                              })
                            )
                          }
                        />
                      </Form.Group>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            ))}
          </Form>
        </Modal.Content>

        <Modal.Actions>
          {competencyId !== '' && (
            <Button
              className="w190 d"
              onClick={async () => {
                deleteCompetencyDetail(competencyId);
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

export default CompetencyListView;
