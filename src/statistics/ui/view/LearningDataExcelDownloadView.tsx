import * as React from 'react';
import { observer } from 'mobx-react';
import { Select, Table } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectTypeModel } from 'shared/model';
import { SubActions } from 'shared/components';

interface Props {
  excelDownload: () => Promise<string | void>;
  onChangeMonth: (month: string) => void;

  selectOptions: SelectTypeModel[];
  workspaceName: string;
  year: string;
  years: SelectTypeModel[];
  month: string;
}

interface States {}

@observer
@reactAutobind
class LearningDataExcelDownloadView extends ReactComponent<Props, States> {
  //
  render() {
    //
    const { excelDownload, onChangeMonth } = this.props;
    const { selectOptions, workspaceName, year, years, month } = this.props;

    return (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="title-header">
              {`${year}년도 학습 데이터 엑셀 다운로드 ${workspaceName ? `(${workspaceName})` : ''}`}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <SubActions>
                <SubActions.Right>
                  <Select className="small-border m0 sub-actions" value={year} options={years} disabled={true} />
                  <Select
                    className="small-border m0 sub-actions"
                    value={month}
                    placeholder="선택해주세요"
                    options={selectOptions}
                    onChange={(e: any, data: any) => onChangeMonth(data.value)}
                  />
                  <SubActions.ExcelButton download onClick={excelDownload}>
                    학습 데이터 엑셀 다운로드
                  </SubActions.ExcelButton>
                </SubActions.Right>
              </SubActions>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

export default LearningDataExcelDownloadView;
