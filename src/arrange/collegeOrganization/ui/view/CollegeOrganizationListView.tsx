import React, { useCallback, useState, useEffect } from 'react';
import {
  Button,
  Form,
  Grid,
  Icon,
  Pagination,
  Table,
  Select,
  List,
  Label,
  Checkbox,
  CheckboxProps,
} from 'semantic-ui-react';
import XLSX, { WorkBook } from 'xlsx';

import { reactAlert } from '@nara.platform/accent';

import { SelectType, NaOffsetElementList, getEmptyNaOffsetElementList } from 'shared/model';
import { SubActions } from 'shared/components';

import { SearchBox } from 'board/capability/model/SearchBox';
import {
  registerCollegeOrganizations,
  findAllColleges,
  findCollegeCount,
  removeCollegeOrganizations,
  changeCollegeOrder,
  findCollegeOrderInfo,
} from 'arrange/collegeOrganization/api/collegeOrganizationApi';
import CollegeOrganization, { convertToExcel } from 'arrange/collegeOrganization/model/CollegeOrganization';
import CollegeOrganizationCdo, {
  getCollegeOrganizationCdos,
} from 'arrange/collegeOrganization/model/CollegeOrganizationCdo';
import {
  requestFindAllCollegeOrganization,
  requestFindAllCollegeOrganizationExcel,
} from 'arrange/collegeOrganization/service/requestCollegeOrganization';
import { getSearchBox, setSearchBox } from 'arrange/collegeOrganization/store/SearchBoxStore';
import CollegeOrganizationExcelCdo, {
  getCollegeOrganizationExcelCdo,
} from 'arrange/collegeOrganization/model/CollegeOrganizationExcelCdo';
import { setCollegeOrganizationList } from 'arrange/collegeOrganization/store/CollegeOrganizationListStore';
import { convertToCollegeOrganization } from 'arrange/collegeOrganization/model/LectureCardOrder';

import { CollegeModel } from 'college/model/CollegeModel';
import { getPolyglotToString } from 'shared/components/Polyglot/logic/PolyglotLogic';

interface CollegeOrganizationListViewProps {
  collegeOrganizationList: NaOffsetElementList<CollegeOrganization>;
  searchBox: SearchBox;
}

const CollegeOrganizationListView: React.FC<CollegeOrganizationListViewProps> = function CollegeOrganizationListView({
  collegeOrganizationList,
  searchBox,
}) {
  const [activePage, setActivePage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);

  const [fileName, setFileName] = useState<string>('');
  const [excelDataRowCount, setExcelDataRowCount] = useState<number>(0);
  const [procTargetTotalListCount, setProcTargetTotalListCount] = useState<number>(0);
  const [result, setResult] = useState<boolean>(false);
  const [college, setCollege] = useState<string>('');
  const [collegeOptions, setCollegeOptions] = useState<CollegeModel[]>([]);
  const [collegeOrganizationCdos, setCollegeOrganizationCdos] = useState<CollegeOrganizationCdo[]>();

  const [collegeOrder, setCollegeOrder] = useState<string>('');
  const [isCollegeOrder, setIsCollegeOrder] = useState<boolean>(false);
  const fileInputRef = React.createRef<HTMLInputElement>();

  const requestCollegeOrderInfo = () => {
    findCollegeOrderInfo(college).then((orderInfo) => setIsCollegeOrder(orderInfo?.withNewCards || false));
  };

  useEffect(() => {
    requestCollegeOrderInfo();
  }, [college]);

  const requestSave = useCallback(
    async (exceldata?: CollegeOrganizationExcelCdo) => {
      if (exceldata) {
        const collegeOrganizations = await registerCollegeOrganizations(exceldata);
        setCollegeOrganizationList({
          ...collegeOrganizationList,
          results: convertToCollegeOrganization(collegeOrganizations.cardCollegeOrderRoms),
        });
        setResult(true);

        if (collegeOrganizations.result) {
          reactAlert({ title: '??????', message: '?????? ????????? ?????????????????????.' });
          const number = await findCollegeCount(college);
          const searchBox = getSearchBox();

          if (number > 0) {
            setCollegeOrder('?????? ??????');

            setSearchBox({
              ...searchBox,
              orderBy: 'CollegeOrder',
            });
          }
        } else {
          reactAlert({ title: '??????', message: '?????? ????????? ?????????????????????.' });
        }
      }
    },
    [college, collegeOrganizationList]
  );

  const onRemoveCollegeOrganization = useCallback(async () => {
    const searchBox = getSearchBox();

    await removeCollegeOrganizations(college)
      .then(() => {
        reactAlert({ title: '??????', message: '?????? ???????????? ?????????????????????.' });
        setCollegeOrder('');

        setSearchBox({
          ...searchBox,
          orderBy: 'TimeDesc',
        });
        requestFindAllCollegeOrganization();
      })
      .catch(() => {
        reactAlert({ title: '??????', message: '?????? ???????????? ?????????????????????.' });
      });
  }, [college]);

  const onChangeCollegeOrder = useCallback(
    async (_: React.FormEvent, data: CheckboxProps) => {
      changeCollegeOrder(college, data.checked || false);
      setIsCollegeOrder(data.checked || false);
      await requestFindAllCollegeOrganization();
    },
    [college]
  );

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
        college,
      });
      onSearch();
    },
    [limit, college]
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
        college,
      });
      onSearch();
    },
    [offset, limit, college]
  );

  const changeSelect = useCallback(async (_: any, data: any) => {
    const number = await findCollegeCount(data.value);
    const searchBox = getSearchBox();

    if (number > 0) {
      setCollegeOrder('?????? ??????');

      setSearchBox({
        ...searchBox,
        orderBy: 'CollegeOrder',
      });
    } else {
      setCollegeOrder('');

      setSearchBox({
        ...searchBox,
        orderBy: 'TimeDesc',
      });
    }

    await setCollege(data.value);
    setFileName('');
    setExcelDataRowCount(0);
    setProcTargetTotalListCount(0);
  }, []);

  const requestExcel = useCallback(async () => {
    const fileName = 'CollegeOrganization.xlsx';
    await requestFindAllCollegeOrganizationExcel().then(({ results, empty }) => {
      if (!empty) {
        const excel = XLSX.utils.json_to_sheet(convertToExcel(results));
        const temp = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(temp, excel, 'CollegeOrganization');
        XLSX.writeFile(temp, fileName, { compression: true });
      }
    });
    return fileName;
  }, []);

  const uploadExcel = useCallback(async () => {
    if (college === '' || college === '??????') {
      reactAlert({ title: '??????', message: 'College??? ??????????????????.' });
      return;
    }
    if (collegeOrganizationCdos && collegeOrganizationCdos.length > 0) {
      await requestSave(getCollegeOrganizationExcelCdo(college, collegeOrganizationCdos));
    } else {
      reactAlert({ title: '??????', message: '?????? ????????? ?????? ???????????? ????????????.' });
    }
  }, [college, collegeOrganizationCdos]);

  const uploadFile = useCallback(
    (file: File) => {
      const fileReader = new FileReader();

      fileReader.onload = (e: any) => {
        setExcelDataRowCount(0);
        setProcTargetTotalListCount(0);
        let binary: string = '';
        const data = new Uint8Array(e.target.result);

        const length = data.byteLength;
        for (let i = 0; i < length; i++) {
          binary += String.fromCharCode(data[i]);
        }
        const workbook: WorkBook = XLSX.read(binary, { type: 'binary' });

        workbook.SheetNames.forEach(async (item: any) => {
          const jsonArray = XLSX.utils.sheet_to_json<any>(workbook.Sheets[item]);
          const convertToExcelUploadData = getCollegeOrganizationCdos(jsonArray);

          if (convertToExcelUploadData.length === 0) {
            return;
          }
          setExcelDataRowCount(convertToExcelUploadData.length);

          const data = convertToExcelUploadData.filter((f: CollegeOrganizationCdo) => {
            if (
              f.channelName &&
              f.channelName !== '' &&
              f.channelName &&
              f.channelName !== '' &&
              f.cardName &&
              f.cardName !== '' &&
              f.collegeOrder &&
              f.collegeOrder !== '' &&
              f.cardId &&
              f.cardId !== ''
            ) {
              return f;
            } else {
              return null;
            }
          });
          setProcTargetTotalListCount(data.length);

          setCollegeOrganizationCdos(convertToExcelUploadData);

          // await requestSave(addCreatorCollegeOrganizationCdos(jsonArray));
          // await requestSave(getCollegeOrganizationExcelCdo(college, jsonArray));
        });
      };
      if (file && file instanceof File) {
        setFileName(file.name);
        fileReader.readAsArrayBuffer(file);
      }
    },
    [college]
  );

  useEffect(() => {
    setCollegeOption();
    return () => {
      setCollegeOrganizationList(getEmptyNaOffsetElementList());
    };
  }, []);

  const onSearch = useCallback(() => {
    setResult(false);
    requestFindAllCollegeOrganization();
  }, []);

  useEffect(() => {
    if (college != '') {
      setSearchBox({
        ...searchBox,
        college,
      });
      onSearch();
    }
  }, [college]);

  const setCollegeOption = useCallback(async () => {
    const collegeSelect: any = [];
    const colleges = await findAllColleges();
    collegeSelect.push({ key: 'All', text: '?????? ????????????', value: '??????' });
    if (colleges) {
      colleges.map((college, index) => {
        collegeSelect.push({
          key: index + 1,
          text: getPolyglotToString(college.name),
          value: college.id,
        });
      });
      // setCollege(colleges[0].collegeId);
    }
    setCollegeOptions(collegeSelect);
  }, []);

  return (
    <>
      <Table celled>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Category</Table.Cell>
            <Table.Cell>
              <Form.Field
                control={Select}
                className="inline-block"
                placeholder="Select"
                options={collegeOptions}
                value={college || '??????'}
                onChange={changeSelect}
              />
              {collegeOrder && (
                <>
                  <Label basic>{collegeOrder}</Label>
                  <Label
                    basic
                    role="button"
                    onClick={onRemoveCollegeOrganization}
                    color="red"
                    style={{ cursor: 'pointer' }}
                  >
                    ?????? ?????????
                  </Label>
                  <Checkbox
                    label="????????? ????????? ???????????? ?????? "
                    onChange={onChangeCollegeOrder}
                    checked={isCollegeOrder}
                    style={{ marginLeft: '3px' }}
                  />
                </>
              )}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      <Table celled>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>
        <Table.Body>
          <Table.Row>
            <Table.Cell>?????? ??????</Table.Cell>
            <Table.Cell>
              <Button
                className="file-select-btn"
                content={fileName || '?????? ?????? ??????'}
                labelPosition="left"
                icon="file"
                onClick={() => {
                  if (college === '' || college === '??????') {
                    reactAlert({ title: '??????', message: 'College??? ??????????????????.' });
                    return;
                  }
                  if (fileInputRef && fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
              />
              <input
                id="file"
                type="file"
                ref={fileInputRef}
                accept=".xlsx, .xls"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => e.target.files && uploadFile(e.target.files[0])}
                hidden
              />
              {/* <p>
                ??? ?????? ?????? ??? [email]??? ????????? ???????????? ????????? ?????????
                ????????????.(CSV ????????? ??????????????? ????????? ?????????.)
                </p> */}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      <Table celled>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>
        <Table.Body>
          <Table.Row>
            <Table.Cell>????????? ??????</Table.Cell>
            <Table.Cell className="list-info">
              <List>
                <List.Item>
                  ??? <strong>{excelDataRowCount}</strong>
                </List.Item>
                <List.Item>
                  ???????????? ?????? ?????? <strong>{procTargetTotalListCount}</strong>???
                </List.Item>
                <List.Item>
                  {procTargetTotalListCount === 0
                    ? '?????? ????????? ????????????.'
                    : '?????? ?????? ?????? ????????? ?????? ????????? ????????????.'}
                </List.Item>
              </List>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      <Grid className="list-info">
        <Grid.Row>
          <Grid.Column width={8}>
            <span>
              {collegeOrganizationList ? '???' : '??????'} <strong>{collegeOrganizationList.totalCount}</strong>
              {collegeOrganizationList.results ? '?????? ?????? ?????? ??????' : '??? ?????? ??????'}
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
              <SubActions.ExcelButton download onClick={async () => requestExcel()} />
              <Button type="button" onClick={uploadExcel}>
                <Icon name="file excel outline" />
                ?????? ?????? ??????
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
          {result && (
            <>
              <col width="12%" />
              <col width="12%" />
            </>
          )}
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Category</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Channel</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">?????????</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">????????????</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">?????? ??????</Table.HeaderCell>
            {result && (
              <>
                <Table.HeaderCell textAlign="center">?????? ??????</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">?????? ??????</Table.HeaderCell>
              </>
            )}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {collegeOrganizationList && collegeOrganizationList.results && collegeOrganizationList.results.length === 0 && (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={10}>
                <div className="no-cont-wrap no-contents-icon">
                  <Icon className="no-contents80" />
                  <div className="sr-only">????????? ??????</div>
                  <div className="text">?????? ????????? ?????? ??? ????????????.</div>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
          {collegeOrganizationList &&
            collegeOrganizationList.results.length > 0 &&
            collegeOrganizationList.results.map((collegeOrganization, index) => (
              <Table.Row key={index}>
                {!result && (
                  <>
                    <Table.Cell textAlign="center">
                      {collegeOrganizationList?.totalCount - index - (activePage - 1) * limit}
                    </Table.Cell>
                  </>
                )}
                {result && (
                  <>
                    <Table.Cell textAlign="center">{index + 1}</Table.Cell>
                  </>
                )}
                <Table.Cell>{collegeOrganization.category.college.name}111</Table.Cell>
                <Table.Cell>{collegeOrganization.category.channel.name}</Table.Cell>
                <Table.Cell>{collegeOrganization.name}</Table.Cell>
                <Table.Cell>{collegeOrganization.type}</Table.Cell>
                <Table.Cell>{offset + index + 1}</Table.Cell>
                {/*{collegeOrganization.collegeOrder === 2147483647 ? '' : collegeOrganization.*/}
                {result && (
                  <>
                    <Table.Cell>{collegeOrganization.orderResult}</Table.Cell>
                    <Table.Cell>{collegeOrganization.errorDetail}</Table.Cell>
                  </>
                )}
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      <div className="center">
        {!result && (
          <>
            <Pagination
              activePage={activePage}
              totalPages={Math.ceil(
                collegeOrganizationList.totalCount === 0 ? 1 : collegeOrganizationList.totalCount / limit
              )}
              onPageChange={changePage}
            />
          </>
        )}
      </div>
    </>
  );
};

export default CollegeOrganizationListView;
