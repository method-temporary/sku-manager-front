import moment from 'moment';
import React, { useCallback, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Checkbox, Form, Grid, Icon, Pagination, Table, Select, Modal, Input, Search } from 'semantic-ui-react';
import XLSX, { WorkBook } from 'xlsx';

import { reactAlert, reactConfirm } from '@nara.platform/accent';

import { SelectType, NameValueList, NaOffsetElementList } from 'shared/model';
import { SubActions } from 'shared/components';

import { SearchBox } from 'board/capability/model/SearchBox';
import { removeCapabilitys, modifyCapability, registerCapabilitys } from 'board/capability/api/capabilityApi';
import { getCapabilityCdo } from 'board/capability/store/CapabilityCdoStore';
import CapabilityCdo, { getEmptyCapabilityCdo, addCreatorCapabilityCdos } from 'board/capability/model/CapabilityCdo';
import {
  requestFindAllCapability,
  requestFindCapability,
  requestFindAllCapabilityExcel,
  requestExistsCapability,
  requestFindCapabilityNames,
  selectField,
} from 'board/capability/service/requestCapability';
import { setSearchBox } from 'board/capability/store/SearchBoxStore';
import Skill, { convertToExcel } from 'board/capability/model/Skill';
import { convertToNames } from 'board/capability/model/Capability';
import CapabilityListModal from './CapabilityListModal';

interface CapabilityListViewProps {
  capabilityList: NaOffsetElementList<Skill>;
  searchBox: SearchBox;
}

function timeToDateString(time: number) {
  return moment(time).format('YYYY.MM.DD');
}

const CapabilityListView: React.FC<CapabilityListViewProps> = function CapabilityListView({
  capabilityList,
  searchBox,
}) {
  // const [filterLimit] = useCapabilityRdoLimit();
  // const capabilityGroups = selectField();

  const location = useLocation();
  const history = useHistory();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [capabilityModalOpen, setCapabilityModalOpen] = useState<boolean>(false);

  const [capabilityGroups, setCapabilityGroups] = useState<any[]>();
  const [selectedList, setSelectedList] = useState<(string | undefined)[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(true);
  const [capabilityId, setCapabilityId] = useState<string>('');
  const [activePage, setActivePage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);

  const [capabilityCdoList, setCapabilityCdoList] = useState<CapabilityCdo[]>();

  const [searchResult, setSearchResult] = useState<string[]>();

  const CREATE_REQUIRE_ERROR = '역량군과 역량명을 모두 입력해주세요.';
  const CREATE_EXIST_ERROR = '중복된 역량이 존재합니다.';
  const CREATE_SUCCESS = '저장되었습니다.';

  const fileInputRef = React.createRef<HTMLInputElement>();

  useEffect(() => {
    setCapabilityGroups(selectField());
  }, []);

  const routeToCreate = useCallback(() => {
    setCapabilityId('');
    setCapabilityCdoList([getEmptyCapabilityCdo()]);
    setModalOpen(true);
  }, []);

  const routeToModal = useCallback(() => {
    setCapabilityModalOpen(true);
  }, []);

  const routeToDetail = useCallback(
    async (skillId) => {
      setCapabilityCdoList([getEmptyCapabilityCdo()]);

      const cdo = getEmptyCapabilityCdo();
      setCapabilityId(skillId);
      requestFindCapability(skillId).then((skill) => {
        cdo.capabilityGroupId = skill.capability.capabilityGroup.id;
        cdo.skillName = skill.name;
        cdo.synonymTag = skill.synonymTag;
        cdo.capabilityName = skill.capability.name;
        setCapabilityCdoList([cdo]);
        setModalOpen(true);
      });
    },
    [location, history]
  );

  const requestSave = useCallback(
    async (exceldata?: CapabilityCdo[]) => {
      const capabilityCdo = getCapabilityCdo() || getEmptyCapabilityCdo();
      if (
        capabilityCdoList &&
        (capabilityCdoList[0].capabilityGroupId === '' || capabilityCdoList[0].capabilityName === '')
      ) {
        reactAlert({ title: '안내', message: CREATE_REQUIRE_ERROR });
        return;
      }

      if (exceldata) {
        await registerCapabilitys(exceldata);
        requestFindAllCapability();
        return;
      }

      if (capabilityId === '' && capabilityCdoList !== undefined) {
        setCapabilityCdoList(
          capabilityCdoList.map((cdo, i) => {
            cdo.capabilityGroupId = capabilityCdoList[0].capabilityGroupId;
            cdo.capabilityName = capabilityCdoList[0].capabilityName;

            return cdo;
          })
        );
        capabilityCdoList.some(async (capability, index) => {
          /* eslint-disable */
          await requestExistsCapability(capability).then(async (flag) => {
            if (flag) {
              reactAlert({ title: '안내', message: CREATE_EXIST_ERROR });
              return;
            } else {
              await registerCapabilitys(capabilityCdoList).then(() => setModalOpen(false));
            }
          });
          /* eslint-enable */
          requestFindAllCapability();
        });
      } else {
        const nameValueList = new NameValueList();
        if (capabilityCdoList !== undefined) {
          nameValueList.nameValues.push({
            name: 'name',
            value: capabilityCdoList[0].skillName || '',
          });
          nameValueList.nameValues.push({
            name: 'synonymTag',
            value: capabilityCdoList[0].synonymTag || '',
          });
          nameValueList.nameValues.push({
            name: 'capabilityName',
            value: capabilityCdoList[0].capabilityName,
          });
          nameValueList.nameValues.push({
            name: 'capabilityGroupId',
            value: capabilityCdoList[0].capabilityGroupId,
          });
          const name = localStorage.getItem('nara.displayName')!;
          nameValueList.nameValues.push({
            name: 'modifierName',
            value: name,
          });
        }
        await modifyCapability(capabilityId, nameValueList).then(() => setModalOpen(false));
        requestFindAllCapability();
      }
      reactAlert({ title: '안내', message: CREATE_SUCCESS });
    },
    [capabilityId, capabilityCdoList]
  );

  const checkAll = useCallback(() => {
    if (selectAll) {
      setSelectedList(capabilityList && capabilityList.results.map((item) => item.id));
      setSelectAll(!selectAll);
    } else {
      setSelectedList([]);
      setSelectAll(!selectAll);
    }
  }, [selectAll, capabilityList]);

  const checkOne = (capabilityId: string) => {
    const copiedSelectedList: (string | undefined)[] = [...selectedList];
    const index = copiedSelectedList.indexOf(capabilityId);

    if (index >= 0) {
      const newSelectedList = copiedSelectedList.slice(0, index).concat(copiedSelectedList.slice(index + 1));
      setSelectedList(newSelectedList);
    } else {
      copiedSelectedList.push(capabilityId);
      setSelectedList(copiedSelectedList);
    }
  };

  const deleteCapabilitys = useCallback(() => {
    if (selectedList && selectedList.length === 0) {
      reactAlert({ title: '알림', message: '역량을 선택해 주세요.' });
      return;
    }

    reactConfirm({
      title: '알림',
      message: '선택한 항목을 삭제하시겠습니까?',
      onOk: async () => {
        await removeCapabilitys(selectedList);
        setSelectedList([]);
        requestFindAllCapability();
      },
    });
  }, [selectedList, searchBox]);

  const deleteCapabilityDetail = useCallback((capabilityId: string) => {
    reactConfirm({
      title: '알림',
      message: '선택한 항목을 삭제하시겠습니까?',
      onOk: async () => {
        await removeCapabilitys([capabilityId]);
        setSelectedList([]);
        requestFindAllCapability();
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
      requestFindAllCapability();
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
      requestFindAllCapability();
    },
    [offset, limit]
  );

  const createFrom = useCallback(() => {
    if (capabilityCdoList !== undefined) {
      setCapabilityCdoList([...capabilityCdoList, getEmptyCapabilityCdo()]);
    }
  }, [capabilityCdoList]);

  const deleteFrom = useCallback(
    (formIndex: number) => {
      if (capabilityCdoList !== undefined) {
        setCapabilityCdoList(capabilityCdoList.filter((cdo, index) => index !== formIndex));
      }
    },
    [capabilityCdoList]
  );

  const requestExcel = useCallback(async () => {
    const fileName = 'Capability.xlsx';
    await requestFindAllCapabilityExcel().then(({ results, empty }) => {
      if (!empty) {
        const excel = XLSX.utils.json_to_sheet(convertToExcel(results));
        const temp = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(temp, excel, 'Capability');
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
        // console.log('item : ', item);
        const jsonArray = XLSX.utils.sheet_to_json<CapabilityCdo>(workbook.Sheets[item]);

        if (jsonArray.length === 0) {
          return;
        }
        await requestSave(addCreatorCapabilityCdos(jsonArray));
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
              {capabilityList ? '총' : '전체'} <strong>{capabilityList.totalCount}</strong>
              {capabilityList.results ? '개의 역량 검색 결과' : '개 역량 등록'}
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
              <Button type="button" onClick={routeToModal}>
                전체 역량 보기
              </Button>
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
              <Button type="button" onClick={() => deleteCapabilitys()}>
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
                  selectedList && selectedList.length > 0 && selectedList.length === capabilityList.results.length
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
          {capabilityList && capabilityList.results && capabilityList.results.length === 0 && (
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
          {capabilityList &&
            capabilityList.results.length > 0 &&
            capabilityList.results.map((capability, index) => (
              <Table.Row key={capability.id}>
                <Table.Cell textAlign="center">
                  <Checkbox
                    className="base"
                    label=""
                    name="radioGroup"
                    value={capability.id}
                    checked={selectedList && selectedList.includes(capability.id)}
                    onChange={(e: any) => checkOne(capability.id)}
                  />
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {capabilityList?.totalCount - index - (activePage - 1) * limit}
                </Table.Cell>

                <Table.Cell onClick={() => routeToDetail(capability.id)}>
                  {capability.capability.capabilityGroup.name}
                </Table.Cell>
                <Table.Cell onClick={() => routeToDetail(capability.id)}>{capability.capability.name}</Table.Cell>
                <Table.Cell onClick={() => routeToDetail(capability.id)}>{capability.name}</Table.Cell>
                <Table.Cell onClick={() => routeToDetail(capability.id)}>{capability.synonymTag}</Table.Cell>
                <Table.Cell textAlign="center" onClick={() => routeToDetail(capability.id)}>
                  {timeToDateString(capability.createdTime)}
                </Table.Cell>
                <Table.Cell onClick={() => routeToDetail(capability.id)}>{capability.creatorName}</Table.Cell>
                <Table.Cell onClick={() => routeToDetail(capability.id)}>
                  {capability.modifiedTime ? timeToDateString(capability.modifiedTime) : ''}
                </Table.Cell>
                <Table.Cell onClick={() => routeToDetail(capability.id)}>{capability.modifierName}</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      <div className="center">
        <Pagination
          activePage={activePage}
          totalPages={Math.ceil(capabilityList.totalCount === 0 ? 1 : capabilityList.totalCount / searchBox.limit!)}
          onPageChange={changePage}
        />
      </div>
      <CapabilityListModal capabilityModalOpen={capabilityModalOpen} setCapabilityModalOpen={setCapabilityModalOpen} />
      <Modal
        open={modalOpen}
        // className="category-modal main-channel"
        size="large"
      >
        <Modal.Header className="res">역량 등록</Modal.Header>
        <Modal.Content scrolling className="fit-layout">
          <Form>
            {capabilityCdoList && (
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
                      역량군 <span className="required">*</span>
                    </Table.Cell>
                    <Table.Cell colSpan={3}>
                      <Form.Group>
                        {capabilityId === '' && (
                          <Form.Field
                            control={Select}
                            placeholder="Select"
                            options={capabilityGroups}
                            onChange={(e: any, data: any) =>
                              setCapabilityCdoList(
                                capabilityCdoList.map((cdo, i) => {
                                  if (i === 0) {
                                    cdo.capabilityGroupId = data.value;
                                  }
                                  return cdo;
                                })
                              )
                            }
                          />
                        )}
                        {capabilityId !== '' && (
                          <Form.Field
                            control={Input}
                            width={10}
                            value={capabilityCdoList[0].capabilityGroupId}
                            disabled={capabilityId !== ''}
                            onChange={(e: any) =>
                              setCapabilityCdoList(
                                capabilityCdoList.map((cdo, i) => {
                                  if (i === 0) {
                                    cdo.capabilityGroupId = e.target.value;
                                  }
                                  return cdo;
                                })
                              )
                            }
                          />
                        )}
                      </Form.Group>
                    </Table.Cell>
                    {/* {capabilityId === '' && (
                      <>
                        <Table.Cell rowSpan={5}>
                          <Button onClick={() => createFrom()}>+</Button>
                        </Table.Cell>

                        {capabilityCdoList.length !== 1 && (
                          <Table.Cell rowSpan={5}>
                            <Button onClick={() => deleteFrom(index)}>-</Button>
                          </Table.Cell>
                        )}
                      </>
                    )} */}
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="tb-header">
                      역량명 <span className="required">*</span>
                    </Table.Cell>
                    <Table.Cell colSpan={3}>
                      <Search
                        // disabled={capabilityId !== ''}
                        loading={false}
                        onResultSelect={(e, data) => {
                          // dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title })
                          setCapabilityCdoList(
                            capabilityCdoList.map((cdo, i) => {
                              if (i === 0) {
                                cdo.capabilityName = data.result.title;
                              }
                              return cdo;
                            })
                          );
                          setSearchResult([]);
                        }}
                        // onSearchChange={handleSearchChange}
                        results={searchResult ? convertToNames(searchResult) : ''}
                        onSearchChange={async (e: any) => {
                          setCapabilityCdoList(
                            capabilityCdoList.map((cdo, i) => {
                              if (i === 0) {
                                cdo.capabilityName = e.target.value;
                              }
                              return cdo;
                            })
                          );
                          setSearchResult(await requestFindCapabilityNames(e.target.value));
                          // console.log('searchResult : ', searchResult);
                        }}
                        value={capabilityCdoList[0].capabilityName}
                      />
                    </Table.Cell>
                  </Table.Row>
                  {capabilityId !== '' && (
                    <>
                      <Table.Row>
                        <Table.Cell className="tb-header">Skill</Table.Cell>
                        <Table.Cell>
                          <Form.Group>
                            <Form.Field
                              control={Input}
                              width={16}
                              value={capabilityCdoList[0].skillName}
                              onChange={(e: any) =>
                                setCapabilityCdoList(
                                  capabilityCdoList.map((cdo, i) => {
                                    if (i === 0) {
                                      cdo.skillName = e.target.value;
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
                              value={capabilityCdoList[0].synonymTag}
                              onChange={(e: any) =>
                                setCapabilityCdoList(
                                  capabilityCdoList.map((cdo, i) => {
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
                  {capabilityId == '' &&
                    capabilityCdoList?.map((capability, index) => (
                      <>
                        <Table.Row>
                          <Table.Cell className="tb-header">
                            Skill <Button onClick={() => createFrom()}>+</Button>
                            {capabilityCdoList.length !== 1 && <Button onClick={() => deleteFrom(index)}>-</Button>}
                          </Table.Cell>
                          <Table.Cell>
                            <Form.Group>
                              <Form.Field
                                control={Input}
                                width={8}
                                value={capabilityCdoList[index].skillName}
                                onChange={(e: any) =>
                                  setCapabilityCdoList(
                                    capabilityCdoList.map((cdo, i) => {
                                      if (index === i) {
                                        cdo.skillName = e.target.value;
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
                                value={capabilityCdoList[index].synonymTag}
                                onChange={(e: any) =>
                                  setCapabilityCdoList(
                                    capabilityCdoList.map((cdo, i) => {
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
          {capabilityId !== '' && (
            <Button
              className="w190 d"
              onClick={async () => {
                deleteCapabilityDetail(capabilityId);
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

export default CapabilityListView;
