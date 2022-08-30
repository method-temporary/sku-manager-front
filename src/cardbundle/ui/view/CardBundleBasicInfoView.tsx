import * as React from 'react';
import { Form, Input, RadioProps, Select } from 'semantic-ui-react';
import { observer } from 'mobx-react';

import { patronInfo } from '@nara.platform/dock';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, PolyglotModel } from 'shared/model';
import { FormTable, RadioGroup, Polyglot } from 'shared/components';
import { Language } from 'shared/components/Polyglot';

import { CardBundleType } from '_data/arrange/cardBundles/model/vo';
import { CardBundleFormModel } from '../../present/logic/CardBundleFormModel';

interface Props {
  //
  onChangeCardBundleFormProps: (name: string, value: string | boolean | number) => void;
  onChangeCardBundleFormRadio: (e: React.SyntheticEvent, { value }: RadioProps) => void;

  cardBundleForm: CardBundleFormModel;
  isUpdatable: boolean;
  isAdmin?: boolean;

  uploadFile: (file: File, lang: Language) => void;
  fileName: PolyglotModel;
}

@observer
@reactAutobind
class CardBundleBasicInfoView extends ReactComponent<Props> {
  //
  render() {
    //
    const {
      onChangeCardBundleFormProps,
      onChangeCardBundleFormRadio,
      cardBundleForm,
      isUpdatable,
      uploadFile,
      fileName,
    } = this.props;
    const valueAsString = cardBundleForm ? String(cardBundleForm.enabled) : undefined;

    return (
      <FormTable title="기본정보">
        <FormTable.Row name="지원 언어">
          <Polyglot.Languages onChangeProps={onChangeCardBundleFormProps} readOnly={!isUpdatable} />
        </FormTable.Row>
        <FormTable.Row name="기본 언어">
          <Polyglot.Default onChangeProps={onChangeCardBundleFormProps} readOnly={!isUpdatable} />
        </FormTable.Row>
        <FormTable.Row name="카드 묶음 명" required>
          <Polyglot.Input
            languageStrings={cardBundleForm.name}
            name="name"
            onChangeProps={onChangeCardBundleFormProps}
            placeholder="카드 묶음 분류 명을 입력해주세요. (20자까지 입력 가능)"
            maxLength="20"
            readOnly={!isUpdatable}
          />
        </FormTable.Row>
        <FormTable.Row name="카드 묶음 표시 문구">
          <Polyglot.Input
            languageStrings={cardBundleForm.displayText}
            name="displayText"
            onChangeProps={onChangeCardBundleFormProps}
            placeholder="카드 묶음 표시 문구를 입력해주세요. (50자까지 입력 가능)"
            maxLength="50"
            readOnly={!isUpdatable}
          />
        </FormTable.Row>
        <FormTable.Row name="카드 묶음 설명">
          <Polyglot.TextArea
            languageStrings={cardBundleForm.description}
            name="description"
            onChangeProps={onChangeCardBundleFormProps}
            placeholder="카드 묶음 설명을 입력해주세요. (200자까지 입력 가능)"
            maxLength={200}
            readOnly={!isUpdatable}
          />
        </FormTable.Row>
        {cardBundleForm && cardBundleForm.type === CardBundleType.HotTopic && (
          <>
            <FormTable.Row required name="썸네일">
              <Polyglot.Image
                languageStrings={cardBundleForm.imageUrl}
                fileName={fileName}
                uploadFile={uploadFile}
                readOnly={!isUpdatable}
              >
                <p className="info-text-gray" style={{ color: 'red' }}>
                  * 이미지 최적 사이즈는 가로 가로 240 * 높이 300 사이즈를 권장합니다.
                </p>
              </Polyglot.Image>
            </FormTable.Row>
            <FormTable.Row name="순서">
              {isUpdatable ? (
                <Input
                  type="number"
                  width={16}
                  placeholder="순서를 입력해주세요."
                  value={(cardBundleForm && cardBundleForm.displayOrder) || -1}
                  onChange={(e: any) => onChangeCardBundleFormProps('displayOrder', Number(e.target.value))}
                  maxLength={50}
                />
              ) : (
                cardBundleForm.displayOrder
              )}
            </FormTable.Row>
          </>
        )}
        {(patronInfo.getCineroomId()?.includes('ne1-m2-c2') && (
          <FormTable.Row name="유형">
            {isUpdatable ? (
              <Form.Field
                control={Select}
                width={4}
                placeholder="Select"
                options={SelectType.cardBundleTypeSelects}
                value={cardBundleForm.type || '전체'}
                onChange={(e: any, data: any) => onChangeCardBundleFormProps('type', data.value)}
              />
            ) : (
              SelectType.cardBundleTypeSelects.find((opt) => opt.value === cardBundleForm.type)?.text || ''
            )}
          </FormTable.Row>
        )) ||
          null}
        <FormTable.Row name="사용 여부">
          {isUpdatable ? (
            <Form.Group>
              <RadioGroup
                labels={['사용', '사용 중지']}
                values={['true', 'false']}
                value={valueAsString}
                onChange={onChangeCardBundleFormRadio}
              />
            </Form.Group>
          ) : (
            <span> {cardBundleForm.enabled ? '사용' : '사용중지'}</span>
          )}
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default CardBundleBasicInfoView;
