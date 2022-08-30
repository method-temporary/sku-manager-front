import React from 'react';
import { observer } from 'mobx-react';
import { Button, Table } from 'semantic-ui-react';

import { FileBox, PatronType, ValidationType } from '@nara.drama/depot';

import { alert, AlertModel, FormTable, Modal, Polyglot } from 'shared/components';
import { isDefaultPolyglotBlank } from 'shared/components/Polyglot';
import { DepotUtil } from 'shared/ui';

import { ReportFileBox } from '_data/lecture/cards/model/vo';

import CardCreateStore from '../../../create/CardCreate.store';
import ReportModalStore from './ReportModal.store';
import { onChangeReportModalPolyglot } from './ReportModal.util';

interface Props {
  //
  unVisible?: boolean; // 모달과 모달 띄우는 버튼이 보이지 않도록 할 때
  readonly?: boolean; // 모달은 보여주지만 Disabled 할 때 사용
  report: boolean;
  trigger?: React.ReactElement;
  triggerAs?: any;
  reportFileBox?: ReportFileBox;
  onCancel?: () => void;
  onOk?: (reportFileBox: ReportFileBox) => void;
}

const ReportModal = observer(
  ({ unVisible, readonly, trigger, triggerAs, report, reportFileBox, onCancel, onOk }: Props) => {
    //
    const { langSupports } = CardCreateStore.instance;
    const { reportName, reportQuestion, fileBoxId, setFileBoxId, setReportStore, reset } = ReportModalStore.instance;

    const onMount = () => {
      //
      reset();
      reportFileBox && setReportStore(reportFileBox);
    };

    const onClickCancel = (_: React.MouseEvent<HTMLButtonElement>, close: () => void) => {
      //
      onCancel && onCancel();
      reset();
      close();
    };

    const onClickOK = (_: React.MouseEvent<HTMLButtonElement>, close: () => void) => {
      //
      if (isDefaultPolyglotBlank(langSupports, reportName)) {
        // Report 명은 비어 있는데, 다른 것들 중 하나라도 채워져 있으면
        // or 전부 비워져 있으면 Validation
        if (
          fileBoxId ||
          !isDefaultPolyglotBlank(langSupports, reportQuestion) ||
          (!fileBoxId && isDefaultPolyglotBlank(langSupports, reportQuestion))
        ) {
          alert(AlertModel.getRequiredInputAlert('Report 명'));
          return;
        } else {
          //
          onClickCancel(_, close);
          return;
        }
      }

      onOk &&
        onOk({
          reportName,
          reportQuestion,
          fileBoxId,
          report: true,
        } as ReportFileBox);

      onClickCancel(_, close);
    };

    return unVisible ? null : (
      <Modal
        className="base w1000 inner-scroll"
        size="large"
        trigger={
          trigger ? (
            trigger
          ) : (
            <Button type="button" disabled={readonly}>
              {report ? 'Report 수정' : 'Report 추가'}
            </Button>
          )
        }
        triggerAs={triggerAs}
        onMount={onMount}
      >
        <Modal.Header>Report 추가하기</Modal.Header>
        <Modal.Content className="content_text">
          <Table celled>
            <colgroup>
              <col width="20%" />
              <col width="80%" />
            </colgroup>

            <Table.Body className="ui form">
              <FormTable.Row name="Report 명" required>
                <Polyglot.Input
                  readOnly={readonly}
                  name="reportName"
                  onChangeProps={onChangeReportModalPolyglot}
                  languageStrings={reportName}
                  maxLength="200"
                  placeholder="Report 명을 입력해주세요. (200자까지 입력가능)"
                />
              </FormTable.Row>
              <FormTable.Row name="작성 가이드">
                <Polyglot.TextArea
                  readOnly={readonly}
                  name="reportQuestion"
                  onChangeProps={onChangeReportModalPolyglot}
                  languageStrings={reportQuestion}
                  maxLength={3000}
                  placeholder="작성 가이드 및 문제를 입력해주세요. (3,000자까지 입력가능)"
                />
              </FormTable.Row>
              <FormTable.Row name="양식 업로드">
                <FileBox
                  options={{ readonly }}
                  fileBoxId={fileBoxId}
                  id={fileBoxId}
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
                  onChange={setFileBoxId}
                />

                {!readonly && (
                  <>
                    <p className="info-text-gray">- DOC,PDF,EXL 파일을 등록하실 수 있습니다.</p>
                    <p className="info-text-gray">- 최대 10MB 용량의 파일을 등록하실 수 있습니다.</p>
                  </>
                )}
              </FormTable.Row>
            </Table.Body>
          </Table>
        </Modal.Content>
        <Modal.Actions>
          <Modal.CloseButton className="w190 d" onClickWithClose={onClickCancel}>
            CANCEL
          </Modal.CloseButton>
          {!readonly && (
            <Modal.CloseButton className="w190 p" onClickWithClose={onClickOK}>
              OK
            </Modal.CloseButton>
          )}
        </Modal.Actions>
      </Modal>
    );
  }
);

export default ReportModal;
