import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form } from 'semantic-ui-react';

import { FileBox, PatronType, ValidationType } from '@nara.drama/depot';

import { FormTable, Polyglot } from 'shared/components';
import { DepotUtil } from 'shared/ui';

import CommunityListModal from 'cube/community/ui/logic/CommunityListModal';

import CardCreateStore from '../../CardCreate.store';
import { onChangeCardCreatePolyglot } from '../../CardCreate.util';
import RelatedCard from './RelatedCard';
import CommunityList from './CommunityList';

interface Props {
  //
  readonly?: boolean;
}

const CardAdditionalInfo = observer(({ readonly }: Props) => {
  //
  const {
    fileBoxId,
    pisAgreementRequired,
    pisAgreementTitle,
    pisAgreementDepotId,
    setFileBoxId,
    setPisAgreementRequired,
    setCommunityId,
    setCommunityName,
  } = CardCreateStore.instance;

  return (
    <FormTable title="부가 정보">
      <FormTable.Row name="교육자료">
        <>
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
                validator: DepotUtil.sizeWithDuplicationValidator,
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
              <p className="info-text-gray">- 최대 20MB 용량의 파일을 등록하실 수 있습니다.</p>
            </>
          )}
        </>
      </FormTable.Row>
      <RelatedCard readonly={readonly} />
      <FormTable.Row name="서약 진행">
        <Form.Field
          control={Checkbox}
          label="서약 진행 여부(Y/N)"
          checked={pisAgreementRequired}
          onChange={(_: any, data: any) => setPisAgreementRequired(data.checked)}
          disabled={readonly}
        />
        {pisAgreementRequired && (
          <Polyglot.PisAgreement
            name="pisAgreementDepotId"
            titleName="pisAgreementTitle"
            onChangeProps={onChangeCardCreatePolyglot}
            languageStrings={pisAgreementDepotId}
            titleLanguageStrings={pisAgreementTitle}
            validations={[
              {
                type: ValidationType.Duplication,
                validator: DepotUtil.duplicationValidator,
              },
              {
                type: ValidationType.Extension,
                validator: DepotUtil.extensionValidatorPDF,
              },
              {
                type: ValidationType.Duplication,
                validator: DepotUtil.multiFileValidator,
              },
            ]}
            desc={<p className="info-text-gray">- PDF 파일 1개 만 등록하실 수 있습니다.</p>}
            readOnly={readonly}
          />
        )}
      </FormTable.Row>
      <FormTable.Row name="Community">
        {!readonly && (
          <CommunityListModal
            type="card"
            handleOk={({ communityId, name }) => {
              if (communityId !== undefined && name !== undefined) {
                setCommunityId(communityId);
                setCommunityName(name);
              }
            }}
          />
        )}
        <CommunityList readonly={readonly} />
      </FormTable.Row>
    </FormTable>
  );
});

export default CardAdditionalInfo;
