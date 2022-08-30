import * as React from 'react';
import { observer } from 'mobx-react';
import { Form, Input, Table, Radio } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';
import { FileBox, PatronType, ValidationType } from '@nara.drama/depot';

import { CubeType } from 'shared/model';
import { DepotUtil } from 'shared/ui';

import { OfficeWebModel } from '../../model/old/OfficeWebModel';

interface Props {
  onChangeOfficeWebProps: (name: string, value: string | Date | boolean | number, nameSub?: string) => void;
  onChangeOfficeWebHeight: (value: string) => void;
  officeWeb: OfficeWebModel;
  getFileBoxIdForEducation: (fileBoxId: string) => void;
  cubeType?: string;
  readonly?: boolean;
}

interface States {}

@observer
@reactAutobind
class AdditionalInfoForOfficeWebView extends React.Component<Props, States> {
  //
  render() {
    const { onChangeOfficeWebProps, onChangeOfficeWebHeight, officeWeb, getFileBoxIdForEducation, cubeType, readonly } =
      this.props;

    return (
      <Table celled>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={2} className="title-header">
              부가 정보
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell className="tb-header">
              교육자료 {cubeType === CubeType.Documents ? <span className="required">*</span> : null}
            </Table.Cell>
            <Table.Cell>
              <FileBox
                options={{ readonly }}
                id={(officeWeb && officeWeb.fileBoxId) || ''}
                fileBoxId={(officeWeb && officeWeb.fileBoxId) || ''}
                vaultKey={{ keyString: 'sku-depot', patronType: PatronType.Pavilion }}
                patronKey={{ keyString: 'sku-denizen', patronType: PatronType.Denizen }}
                validations={[
                  {
                    type: ValidationType.Extension,
                    validator: DepotUtil.extensionValidatorByDocument,
                  },
                ]}
                onChange={getFileBoxIdForEducation}
              />
              <p className="info-text-gray">- DOC,PDF,EXL 파일을 등록하실 수 있습니다.</p>
              <p className="info-text-gray">- 최대 10MB 용량의 파일을 등록하실 수 있습니다.</p>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">
              교육자료(URL)
              {cubeType === CubeType.WebPage || cubeType === CubeType.Experiential || cubeType === CubeType.Cohort ? (
                <span className="required">*</span>
              ) : null}
            </Table.Cell>
            <Table.Cell>
              {readonly ? (
                <p>{(officeWeb && officeWeb.webPageUrl) || ''}</p>
              ) : (
                <Form.Field
                  control={Input}
                  placeholder="https://"
                  value={(officeWeb && officeWeb.webPageUrl) || ''}
                  onChange={(e: any) => onChangeOfficeWebProps('webPageUrl', e.target.value)}
                />
              )}
            </Table.Cell>
          </Table.Row>
          {cubeType === CubeType.WebPage && (
            <Table.Row>
              <Table.Cell className="tb-header">
                임베디드 사용 유무 <span className="required">*</span>
              </Table.Cell>
              <Table.Cell>
                <Form.Group>
                  <Form.Field
                    disabled={readonly}
                    control={Radio}
                    label="Yes"
                    value="embedded"
                    checked={officeWeb && officeWeb.urlType === 'embedded'}
                    onChange={(e: any, data: any) => {
                      onChangeOfficeWebProps('urlType', data.value);
                      onChangeOfficeWebProps('selfPass', false);
                    }}
                  />
                  <Form.Field
                    disabled={readonly}
                    control={Radio}
                    label="No"
                    value=""
                    checked={officeWeb && officeWeb.urlType === ''}
                    onChange={(e: any, data: any) => onChangeOfficeWebProps('urlType', data.value)}
                  />
                </Form.Group>
              </Table.Cell>
            </Table.Row>
          )}
          {officeWeb && cubeType === 'WebPage' && officeWeb.urlType !== 'embedded' && (
            <Table.Row>
              <Table.Cell className="tb-header">자동 이수 처리 유무</Table.Cell>
              <Table.Cell>
                <Form.Group>
                  <Form.Field
                    disabled={readonly}
                    control={Radio}
                    label="Yes"
                    checked={officeWeb.selfPass}
                    onChange={(e: any, data: any) => onChangeOfficeWebProps('selfPass', true)}
                  />
                  <Form.Field
                    disabled={readonly}
                    control={Radio}
                    label="No"
                    checked={!officeWeb.selfPass}
                    onChange={(e: any, data: any) => onChangeOfficeWebProps('selfPass', false)}
                  />
                </Form.Group>
                <p className="info-text-gray">- No 일 경우 학습자가 학습완료 처리를 할 수 없습니다.</p>
              </Table.Cell>
            </Table.Row>
          )}
          {officeWeb && officeWeb.urlType === 'embedded' && (
            <>
              <Table.Row>
                <Table.Cell className="tb-header">모바일 노출 여부</Table.Cell>
                <Table.Cell>
                  <Form.Group>
                    <Form.Field
                      disabled={readonly}
                      control={Radio}
                      label="Yes"
                      checked={officeWeb.mobileExposure}
                      onChange={(e: any, data: any) => onChangeOfficeWebProps('mobileExposure', true)}
                    />
                    <Form.Field
                      disabled={readonly}
                      control={Radio}
                      label="No"
                      checked={!officeWeb.mobileExposure}
                      onChange={(e: any, data: any) => onChangeOfficeWebProps('mobileExposure', false)}
                    />
                  </Form.Group>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="tb-header">높이</Table.Cell>
                <Table.Cell>
                  <Form.Field
                    disabled={readonly}
                    control={Input}
                    width={3}
                    type="number"
                    value={officeWeb.height}
                    onChange={(e: any, data: any) => onChangeOfficeWebHeight(data.value)}
                  />
                  <p className="info-text-gray">- 높이를 입력하지 않는 경우, 630px로 지정됩니다.</p>
                  <p className="info-text-gray">- 최대 3000px의 높이 까지 등록하실 수 있습니다.</p>
                </Table.Cell>
              </Table.Row>
            </>
          )}
        </Table.Body>
      </Table>
    );
  }
}

export default AdditionalInfoForOfficeWebView;
