import React from 'react';
import { Grid } from 'semantic-ui-react';
import XLSX from 'xlsx';

import { excelDownloadFile, useExcelDownload } from '../capability.hook';
import CapabilityStore from '../capability.store';
import { SubActions } from '../../shared/components';
import { getPolyglotToAnyString } from '../../shared/components/Polyglot';
import moment from 'moment';
import { observer } from 'mobx-react';

const ExcelDownload = observer(() => {
  //
  const { qdo } = CapabilityStore.instance;
  // const { mutateAsync: download } = useExcelDownload();

  const excelDownload = async () => {
    await excelDownloadFile(qdo.assessmentId);

    // const data = await download({
    //   ...qdo,
    //   offset: 0,
    //   limit: 9999999,
    // });
    // const totalCount = data.totalCount;

    // const wbList: any[] = [];
    // data &&
    //   data.results.map((item: any, index: number) => {
    //     const { level, completedTime, userIdentity, examResultDetails } = item;
    //     const wb: any = {
    //       'No.': totalCount - index,
    //       '소속 회사': getPolyglotToAnyString(userIdentity.companyName),
    //       '소속 조직': getPolyglotToAnyString(userIdentity.departmentName),
    //       이름: getPolyglotToAnyString(userIdentity.name),
    //       'E-Mail': userIdentity.email,
    //       Level: level,
    //     };

    //     examResultDetails.map((item: any) => {
    //       wb[`${getPolyglotToAnyString(item.name)}`] = item.obtainedScore;
    //     });

    //     wb['획득일자'] = moment(completedTime).format('YYYY.MM.DD HH:mm:ss');

    //     wbList.push(wb);
    //   });

    // const fileName = `사전 진단 관리.xlsx`;
    // const excel = XLSX.utils.json_to_sheet(wbList);
    // const wb = XLSX.utils.book_new();

    // XLSX.utils.book_append_sheet(wb, excel, '사전진단관리');
    // XLSX.writeFile(wb, fileName, { compression: true });
    // return fileName;
  };

  return (
    <Grid className="list-info">
      <Grid.Row>
        <Grid.Column width={8}></Grid.Column>
        <Grid.Column width={8}>
          <div className="fl-right">
            <SubActions.ExcelButton download onClick={excelDownload}>
              엑셀 다운로드
            </SubActions.ExcelButton>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
});

export default ExcelDownload;
