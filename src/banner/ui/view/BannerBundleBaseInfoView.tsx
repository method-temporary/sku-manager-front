import * as React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, CheckboxProps, Form, Icon, Input, Radio } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';

import { reactAutobind } from '@nara.platform/accent';

import { FormTable } from 'shared/components';
import RadioGroup from '../../../shared/components/RadioGroup';
import Polyglot from 'shared/components/Polyglot';

import { BannerBundleFormModel } from '../../model/BannerBundleFormModel';

interface Props {
  bannerBundleForm: BannerBundleFormModel;
  onChangeBannerProps: (name: string, value: string | [] | {}) => void;
  onChangeBannerDateProps: (name: string, value: number) => void;
  changeBannerBundleExposureType: (value: 'PC' | 'Mobile', isChecked?: boolean) => void;
  isUpdatable: boolean;
}

@observer
@reactAutobind
class BannerBundleBaseInfoView extends React.Component<Props> {
  render() {
    const {
      onChangeBannerProps,
      onChangeBannerDateProps,
      changeBannerBundleExposureType,
      bannerBundleForm,
      isUpdatable,
    } = this.props;

    //글자수(100자 이내)
    const nameCount = (bannerBundleForm && bannerBundleForm.name && bannerBundleForm.name.length) || 0;

    const getIsChecked = (type: 'PC' | 'Mobile') => {
      if (bannerBundleForm.exposureType === null) {
        return true;
      }

      if (bannerBundleForm.exposureType === type) {
        return true;
      }

      return false;
    };

    const onChangeCheckedPCType = (_: any, data: CheckboxProps) => {
      changeBannerBundleExposureType('PC', data.checked);
    };

    const onChangeCheckedMobileType = (_: any, data: CheckboxProps) => {
      changeBannerBundleExposureType('Mobile', data.checked);
    };

    return (
      <FormTable title="BannerBundle 정보">
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
        <FormTable.Row name="BannerBundle명" required>
          {(isUpdatable && (
            <div className={nameCount >= 30 ? 'ui right-top-count input error' : 'ui right-top-count input'}>
              <span className="count">
                <span className="now">{nameCount}</span>/<span className="max">30</span>
              </span>
              <Form.Field
                control={Input}
                width={16}
                placeholder="등록하실 Banner의 명칭을 입력해주세요."
                value={(bannerBundleForm && bannerBundleForm.name) || ''}
                onChange={(e: any) => onChangeBannerProps('name', e.target.value)}
                maxLength={30}
              />
            </div>
          )) || <p>{bannerBundleForm.name}</p>}
        </FormTable.Row>
        <FormTable.Row name="사용기간">
          <Form.Group>
            <Form.Field>
              <div className="ui input right icon">
                <DatePicker
                  readOnly={!isUpdatable}
                  placeholderText="시작날짜를 선택해주세요."
                  selected={
                    (bannerBundleForm && bannerBundleForm.startDate && dayjs(bannerBundleForm.startDate).toDate()) ||
                    dayjs().toDate()
                  }
                  onChange={(date: Date) => onChangeBannerDateProps('startDate', date.setHours(0, 0, 0, 0))}
                  dateFormat="yyyy.MM.dd"
                />
                <Icon name="calendar alternate outline" />
              </div>
            </Form.Field>
            {!bannerBundleForm.endState ? (
              <>
                <div className="dash">-</div>
                <Form.Field>
                  <div className="ui input right icon">
                    <DatePicker
                      readOnly={!isUpdatable}
                      placeholderText="종료날짜를 선택해주세요."
                      selected={
                        (bannerBundleForm && bannerBundleForm.endDate && dayjs(bannerBundleForm.endDate).toDate()) ||
                        dayjs().toDate()
                      }
                      onChange={(date: Date) => onChangeBannerDateProps('endDate', date.setHours(23, 59, 59, 59))}
                      minDate={dayjs(bannerBundleForm.startDate).toDate() || dayjs().toDate()}
                      dateFormat="yyyy.MM.dd"
                    />
                    <Icon name="calendar alternate outline" />
                  </div>
                </Form.Field>
              </>
            ) : (
              <div className="dash">~</div>
            )}
            <Form.Field
              disabled={!isUpdatable}
              control={Checkbox}
              label="종료일 설정 안함"
              checked={bannerBundleForm.endState}
              onChange={(e: any, data: any) => onChangeBannerProps('endState', data.checked)}
            />
          </Form.Group>
        </FormTable.Row>
        <FormTable.Row name="띠배너 설정">
          <Form.Group inline>
            <RadioGroup
              as={Form.Field}
              control={Radio}
              disabled={!isUpdatable}
              values={['true', 'false']}
              labels={['Yes', 'No']}
              value={bannerBundleForm.top + ''}
              onChange={(e: any, data: any) => onChangeBannerProps('top', data.value)}
            />
          </Form.Group>
        </FormTable.Row>
      </FormTable>
    );
  }
}
export default BannerBundleBaseInfoView;
