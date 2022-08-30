import * as React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, CheckboxProps, Form, Input, Select } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { PolyglotModel, SelectType } from 'shared/model';
import { FormTable, Polyglot } from 'shared/components';
import { Language } from 'shared/components/Polyglot';

import { BannerModel } from '../../model/BannerModel';
import { getBannerItem } from 'banner/present/logic/BannerService';
import { find } from 'lodash';

interface Props {
  onChangeBannerProps: (name: string, value: string | [] | {}) => void;
  changeBannerExposureType: (value: 'PC' | 'Mobile', isChecked?: boolean) => void;
  pcUploadFile: (file: File, lang: Language) => void;
  mobileUploadFile: (file: File, lang: Language) => void;
  banner: BannerModel;
  pcFileName: PolyglotModel;
  mobileFileName: PolyglotModel;
  isUpdatable: boolean;
}

@observer
@reactAutobind
class BannerInfoView extends ReactComponent<Props> {
  //
  // imagePath = getImagePath();
  // private fileInputRef = React.createRef<HTMLInputElement>();

  render() {
    const {
      banner,
      pcFileName,
      mobileFileName,
      pcUploadFile,
      mobileUploadFile,
      onChangeBannerProps,
      changeBannerExposureType,
      isUpdatable,
    } = this.props;

    //글자수(30자 이내)
    const nameCount = (banner && banner.name && banner.name.length) || 0;

    const getIsChecked = (type: 'PC' | 'Mobile') => {
      if (banner.exposureType === null) {
        return true;
      }

      if (banner.exposureType === type) {
        return true;
      }

      return false;
    };

    const onChangeCheckedPCType = (_: any, data: CheckboxProps) => {
      changeBannerExposureType('PC', data.checked);
    };

    const onChangeCheckedMobileType = (_: any, data: CheckboxProps) => {
      changeBannerExposureType('Mobile', data.checked);
    };

    return (
      <Polyglot languages={banner.langSupports}>
        <FormTable title="Banner 정보">
          <FormTable.Row name="노출 설정">
            <Checkbox label="PC" checked={getIsChecked('PC')} disabled={!isUpdatable} onClick={onChangeCheckedPCType} />
            <Checkbox
              label="Mobile"
              checked={getIsChecked('Mobile')}
              style={{ marginLeft: '15px' }}
              disabled={!isUpdatable}
              onClick={onChangeCheckedMobileType}
            />
          </FormTable.Row>
          <FormTable.Row name="지원 언어">
            <Polyglot.Languages onChangeProps={onChangeBannerProps} readOnly={!isUpdatable} />
          </FormTable.Row>
          <FormTable.Row name="기본 언어">
            <Polyglot.Default onChangeProps={onChangeBannerProps} readOnly={!isUpdatable} />
          </FormTable.Row>
          <FormTable.Row name="Banner 명" required>
            {isUpdatable ? (
              <div className={nameCount >= 50 ? 'ui right-top-count input error' : 'ui right-top-count input'}>
                <span className="count">
                  <span className="now">{nameCount}</span>/<span className="max">50</span>
                </span>
                <Form.Field
                  control={Input}
                  width={16}
                  placeholder="등록하실 Banner의 명칭을 입력해주세요."
                  value={(banner && banner.name) || ''}
                  onChange={(e: any) => onChangeBannerProps('name', e.target.value)}
                  maxLength={50}
                />
              </div>
            ) : (
              <p>{banner.name}</p>
            )}
          </FormTable.Row>
          <FormTable.Row name="PC Banner Image">
            {(banner && (
              <>
                <Polyglot.Image
                  languageStrings={banner.pcImageUrl}
                  fileName={pcFileName}
                  uploadFile={pcUploadFile}
                  readOnly={!isUpdatable || banner.exposureType === 'Mobile' || banner.exposureType === ''}
                >
                  <p className="info-text-gray">- 파일 형식 : JPG, GIF, PNG</p>
                  <p className="info-text-gray" style={{ color: 'red' }}>
                    - 파일 사이즈 : 1200px * 200px (띠배너 1200px * 100px)
                  </p>
                  <p className="info-text-gray">- 최대 용량 : 300 kByte</p>
                </Polyglot.Image>
              </>
            )) ||
              null}
          </FormTable.Row>
          <FormTable.Row name="Mobile Banner Image">
            {(banner && (
              <>
                <Polyglot.Image
                  languageStrings={banner.mobileImageUrl}
                  fileName={mobileFileName}
                  uploadFile={mobileUploadFile}
                  readOnly={!isUpdatable || banner.exposureType === 'PC' || banner.exposureType === ''}
                >
                  <p className="info-text-gray">- 파일 형식 : JPG, GIF, PNG</p>
                  <p className="info-text-gray" style={{ color: 'red' }}>
                    - 파일 사이즈 : 960px * 240px (실사이즈 320px * 80px)
                  </p>
                  <p className="info-text-gray">- 최대 용량 : 300 kByte</p>
                </Polyglot.Image>
              </>
            )) ||
              null}
          </FormTable.Row>
          <FormTable.Row required name="Link Type ">
            {isUpdatable ? (
              <Form.Field
                control={Select}
                width={4}
                placeholder="Select"
                options={SelectType.bannerLinkType}
                value={(banner && banner.target) || ''}
                onChange={(e: any, data: any) => onChangeBannerProps('target', data.value)}
              />
            ) : (
              <p>{banner.target}</p>
            )}
          </FormTable.Row>
          <FormTable.Row required name="Banner Link">
            {isUpdatable ? (
              <Form.Field
                control={Input}
                placeholder="Https://"
                value={(banner && banner.targetUrl) || ''}
                onChange={(e: any) => onChangeBannerProps('targetUrl', e.target.value)}
              />
            ) : (
              <p>{banner.targetUrl}</p>
            )}
          </FormTable.Row>
        </FormTable>
      </Polyglot>
    );
  }
}
export default BannerInfoView;
