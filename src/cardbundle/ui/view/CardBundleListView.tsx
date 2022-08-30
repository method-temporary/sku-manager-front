import * as React from 'react';
import { Button, Checkbox, Form, Icon, Radio, Table } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { PatronKey, SelectType, UserGroupRuleModel } from 'shared/model';
import { getBasedAccessRuleView } from 'shared/helper';
import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';
import { CardBundleService } from '../../index';
import { CardBundleFormModel } from '../../present/logic/CardBundleFormModel';
import { CardBundleMobileOrderType } from 'cardbundle/present/logic/CardBundleModifyModel';

interface Injected {
  cardBundleService: CardBundleService;
}

interface Props {
  //
  routeToCardBundleDetail?: (cardBundleId: string) => void;
  changeTargetCardBundleProps?: (index: number, name: string, value: any) => void;
  onChangeCheckBox?: (value: boolean) => void;
  changeCardBundleSequence?: (
    cardBundles: CardBundleFormModel[],
    cardBundle: CardBundleFormModel,
    oldIdx: number,
    newIdx: number
  ) => void;
  getSubsidiary?: (cineroomId: string) => string | undefined;

  cardBundleForms: CardBundleFormModel[];
  startNo: number;
  typeCheckBox: boolean;
  selectable: boolean;
  userGroupMap?: Map<number, UserGroupRuleModel>;

  title?: string;
  isMobileBundle?: boolean;
}

@inject('cardBundleService')
@observer
@reactAutobind
class CardBundleListView extends ReactComponent<Props, {}, Injected> {
  //
  static defaultProps = {
    getSubsidiary: () => {},
  };

  changeOderType(value: CardBundleMobileOrderType) {
    const { cardBundleService } = this.injected;
    cardBundleService.changeCardBundleMobileOrderType(value);
  }

  render() {
    //
    const {
      typeCheckBox,
      selectable,
      routeToCardBundleDetail,
      onChangeCheckBox,
      getSubsidiary,
      changeTargetCardBundleProps,
      changeCardBundleSequence,
      cardBundleForms,
      startNo,
      userGroupMap,
      title,
      isMobileBundle,
    } = this.props;

    const { cardBundleService } = this.injected;

    const { cardBundleMobileOrderType } = cardBundleService;

    const allChecked =
      cardBundleForms.filter((cardBundle) => cardBundle.checked).length === cardBundleForms.length &&
      cardBundleForms.length !== 0;

    return (
      <Table celled selectable={selectable}>
        <colgroup>
          {typeCheckBox ? (
            <>
              <col width="5%" />
              <col width="5%" />
              <col width="15%" />
              <col width="8%" />
              <col width="8%" />
              <col width="8%" />
              <col width="23%" />
              <col width="15%" />
              <col />
            </>
          ) : (
            <>
              <col width="9%" />
              <col width="9%" />
              <col width="9%" />
              <col width="23%" />
              <col width="28%" />
              <col width="30%" />
              <col width="17%" />
            </>
          )}
        </colgroup>
        {title && (
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan={6} className="title-header">
                {title}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        )}
        {isMobileBundle && (
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">맞춤과정 순서</Table.HeaderCell>
              <Table.HeaderCell colSpan={6}>
                <Form.Group style={{ display: 'flex' }}>
                  <Form.Radio
                    style={{ paddingRight: '1rem' }}
                    label="순서 설정"
                    value="Sequence"
                    checked={cardBundleMobileOrderType === 'Sequence'}
                    onChange={(e: any, data: any) => this.changeOderType(data.value)}
                  />
                  <Form.Radio
                    label="Random"
                    value="Random"
                    checked={cardBundleMobileOrderType === 'Random'}
                    onChange={(e: any, data: any) => this.changeOderType(data.value)}
                  />
                </Form.Group>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        )}

        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">
              {typeCheckBox && onChangeCheckBox ? (
                <Form.Field
                  control={Checkbox}
                  checked={allChecked}
                  onChange={(e: any, data: any) => onChangeCheckBox(data.checked)}
                />
              ) : (
                `순서`
              )}
            </Table.HeaderCell>
            {typeCheckBox && <Table.HeaderCell textAlign="center"> No </Table.HeaderCell>}
            {typeCheckBox ? null : <Table.HeaderCell textAlign="center"> 사용처 </Table.HeaderCell>}
            {typeCheckBox ? null : <Table.HeaderCell textAlign="center"> 유형 </Table.HeaderCell>}
            <Table.HeaderCell textAlign="center"> 카드 묶음명 </Table.HeaderCell>
            {typeCheckBox ? <Table.HeaderCell textAlign="center"> 사용처 </Table.HeaderCell> : null}
            {typeCheckBox ? <Table.HeaderCell textAlign="center"> 유형 </Table.HeaderCell> : null}
            {typeCheckBox ? <Table.HeaderCell textAlign="center"> 사용여부 </Table.HeaderCell> : null}
            <Table.HeaderCell textAlign="center"> 카드 묶음 분류 표시 문구 </Table.HeaderCell>
            <Table.HeaderCell textAlign="center"> {typeCheckBox ? '최종변경' : ' 최종 변경 일시'} </Table.HeaderCell>
            {typeCheckBox ? <Table.HeaderCell textAlign="center">접근제어규칙</Table.HeaderCell> : null}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(cardBundleForms &&
            cardBundleForms.length &&
            cardBundleForms.map((cardBundleForm: CardBundleFormModel, idx) => {
              const isMobileOrderSequence =
                cardBundleMobileOrderType !== 'Sequence' && cardBundleForm.type === 'Mobile';

              return (
                <Table.Row
                  key={idx}
                  onClick={() => (routeToCardBundleDetail ? routeToCardBundleDetail(cardBundleForm.id) : {})}
                >
                  <Table.Cell textAlign="center" onClick={(event: any) => event.stopPropagation()}>
                    {typeCheckBox ? (
                      <Form.Field
                        control={Checkbox}
                        checked={cardBundleForm.checked}
                        onChange={(e: any, data: any) =>
                          changeTargetCardBundleProps ? changeTargetCardBundleProps(idx, 'checked', data.checked) : {}
                        }
                      />
                    ) : (
                      <div>
                        <Button
                          icon
                          size="mini"
                          basic
                          onClick={() =>
                            changeCardBundleSequence
                              ? changeCardBundleSequence(cardBundleForms, cardBundleForm, idx, idx + 1)
                              : {}
                          }
                          disabled={isMobileOrderSequence}
                        >
                          <Icon name="angle down" />
                        </Button>
                        <Button
                          icon
                          size="mini"
                          basic
                          onClick={() =>
                            changeCardBundleSequence
                              ? changeCardBundleSequence(cardBundleForms, cardBundleForm, idx, idx - 1)
                              : {}
                          }
                          disabled={isMobileOrderSequence}
                        >
                          <Icon name="angle up" />
                        </Button>
                      </div>
                    )}
                  </Table.Cell>
                  {typeCheckBox ? <Table.Cell textAlign="center">{startNo - idx}</Table.Cell> : null}
                  {typeCheckBox ? null : (
                    <Table.Cell textAlign="center">
                      {getSubsidiary && getSubsidiary(PatronKey.getCineroomId(cardBundleForm.patronKey))}
                    </Table.Cell>
                  )}

                  {typeCheckBox ? null : (
                    <Table.Cell textAlign="center">
                      {SelectType.cardBundleTypeSelects.find((opt) => opt.value === cardBundleForm.type)?.text || ''}
                    </Table.Cell>
                  )}

                  <Table.Cell>
                    {getPolyglotToAnyString(cardBundleForm.name, getDefaultLanguage(cardBundleForm.langSupports))}
                  </Table.Cell>
                  {typeCheckBox ? (
                    <Table.Cell textAlign="center">
                      {getSubsidiary && getSubsidiary(PatronKey.getCineroomId(cardBundleForm.patronKey))}
                    </Table.Cell>
                  ) : null}
                  {typeCheckBox ? (
                    <Table.Cell textAlign="center">
                      {SelectType.cardBundleTypeSelects.find((opt) => opt.value === cardBundleForm.type)?.text || ''}
                    </Table.Cell>
                  ) : null}
                  {typeCheckBox ? (
                    <Table.Cell textAlign="center">{(cardBundleForm.enabled && '사용') || '사용 중지'}</Table.Cell>
                  ) : null}
                  <Table.Cell>
                    {getPolyglotToAnyString(
                      cardBundleForm.displayText,
                      getDefaultLanguage(cardBundleForm.langSupports)
                    ) || ''}
                  </Table.Cell>
                  <Table.Cell textAlign="center">{`${moment(cardBundleForm.modifiedTime).format(
                    'YYYY.MM.DD HH:mm:ss'
                  )}  ${
                    typeCheckBox
                      ? `/${getPolyglotToAnyString(
                          cardBundleForm.modifierName,
                          getDefaultLanguage(cardBundleForm.langSupports)
                        )}`
                      : ''
                  }`}</Table.Cell>
                  {typeCheckBox && userGroupMap ? (
                    <Table.Cell>
                      {cardBundleForm &&
                        cardBundleForm.groupBasedAccessRule &&
                        getBasedAccessRuleView(cardBundleForm.groupBasedAccessRule, userGroupMap)}
                    </Table.Cell>
                  ) : null}
                </Table.Row>
              );
            })) || (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={8}>
                <div className="no-cont-wrap no-contents-icon">
                  <Icon className="no-contents80" />
                  <div className="sr-only">콘텐츠 없음</div>
                  <div className="text">검색 결과를 찾을 수 없습니다.</div>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    );
  }
}

export default CardBundleListView;
