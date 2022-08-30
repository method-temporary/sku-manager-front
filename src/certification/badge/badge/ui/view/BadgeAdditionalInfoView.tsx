import React from 'react';
import { observer } from 'mobx-react';
import { Table } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';
import { MemberViewModel } from '@nara.drama/approval';

import { FormTable, Polyglot } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { BadgeModel } from '_data/badge/badges/model';

import ManagerListModal from 'cube/cube/ui/view/ManagerListModal';
import { UserIdentityModel } from 'cube/user/model/UserIdentityModel';

import { BadgeQueryModel } from '../../model/BadgeQueryModel';

interface Props {
  isUpdatable: boolean;
  badge: BadgeModel | BadgeQueryModel;
  changeBadgeQueryProp: (name: string, value: any) => void;
  onClickOperatorSelect: (member: MemberViewModel) => void;
  // tagCount: number;
  badgeOperatorIdentity: UserIdentityModel;
}

@observer
@reactAutobind
class BadgeAdditionalInfoView extends React.Component<Props> {
  //
  render() {
    //
    const {
      isUpdatable = false,
      badge,
      changeBadgeQueryProp,
      onClickOperatorSelect,
      // tagCount,
      badgeOperatorIdentity,
    } = this.props;

    return (
      <FormTable title="부가 정보">
        <FormTable.Row required name="인증내용">
          {/*{isUpdatable ? (*/}
          {/*  <div*/}
          {/*    className={*/}
          {/*      badge.qualification.length >= 1000 ? 'ui right-top-count input error' : 'ui right-top-count input'*/}
          {/*    }*/}
          {/*  >*/}
          {/*    <span className="count">*/}
          {/*      <span className="now">{badge.qualification.length}</span>/<span className="max">1000</span>*/}
          {/*    </span>*/}
          {/*    <TextArea*/}
          {/*      placeholder="When you have acquired this badge, please enter the information on*/}
          {/* what knowledge/skills you possess and can certify. (1,000자까지 입력가능)"*/}
          {/*      rows={3}*/}
          {/*      value={badge.qualification}*/}
          {/*      onChange={(e: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) =>*/}
          {/*        onChangeTextArea('qualification', `${data.value}`, 1000)*/}
          {/*      }*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*) : (*/}
          {/*  badge.qualification*/}
          {/*)}*/}

          <Polyglot.TextArea
            name="qualification"
            maxLength={1000}
            readOnly={!isUpdatable}
            onChangeProps={changeBadgeQueryProp}
            languageStrings={badge.qualification}
            placeholder="이 Badge를 획득 했을 때, 어떤 지식/스킬을 보유 및 인증할 수 있는지에 대한 내용을 입력해주세요. (1,000자까지 입력가능)"
          />
        </FormTable.Row>
        <FormTable.Row required name="획득 조건">
          {/*{isUpdatable ? (*/}
          {/*  <div*/}
          {/*    className={*/}
          {/*      badge.acquisitionRequirements.length >= 1000*/}
          {/*        ? 'ui right-top-count input error'*/}
          {/*        : 'ui right-top-count input'*/}
          {/*    }*/}
          {/*  >*/}
          {/*    <span className="count">*/}
          {/*      <span className="now">{badge.acquisitionRequirements.length}</span>/<span className="max">1000</span>*/}
          {/*    </span>*/}
          {/*    <TextArea*/}
          {/*      placeholder="Please enter the acquisition conditions for acquiring this badge. (1,000자까지 입력가능)"*/}
          {/*      rows={3}*/}
          {/*      value={badge.acquisitionRequirements}*/}
          {/*      onChange={(e: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) =>*/}
          {/*        onChangeTextArea('acquisitionRequirements', `${data.value}`, 1000)*/}
          {/*      }*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*) : (*/}
          {/*  badge.acquisitionRequirements*/}
          {/*)}*/}

          <Polyglot.TextArea
            name="acquisitionRequirements"
            maxLength={1000}
            readOnly={!isUpdatable}
            onChangeProps={changeBadgeQueryProp}
            languageStrings={badge.acquisitionRequirements}
            placeholder="이 Badge를 획득하기 위한 획득조건을 입력해주세요. (1,000자까지 입력가능)"
          />
        </FormTable.Row>
        <FormTable.Row required name="담당자">
          {isUpdatable && (
            <ManagerListModal handleOk={onClickOperatorSelect} buttonName="담당자 선택" multiSelect={false} />
          )}
          {badgeOperatorIdentity && badgeOperatorIdentity.id && (
            <Table celled>
              <colgroup>
                <col width="30%" />
                <col width="20%" />
                <col width="50%" />
              </colgroup>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell textAlign="center">소속</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">이름</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">이메일</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>{getPolyglotToAnyString(badgeOperatorIdentity.companyName)}</Table.Cell>
                  <Table.Cell>{getPolyglotToAnyString(badgeOperatorIdentity.name)}</Table.Cell>
                  <Table.Cell>{badgeOperatorIdentity.email}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          )}
        </FormTable.Row>
        <FormTable.Row name="학습영역">
          {/*{isUpdatable ? (*/}
          {/*  <HtmlEditor*/}
          {/*    theme="snow"*/}
          {/*    modules={SelectType.modules}*/}
          {/*    formats={SelectType.formats}*/}
          {/*    placeholder="Please enter the detailed description of this badge."*/}
          {/*    onChange={(html) => changeBadgeQueryProp('description', html === '<p><br></p>' ? '' : html)}*/}
          {/*    value={badge.description}*/}
          {/*  />*/}
          {/*) : (*/}
          {/*  <div dangerouslySetInnerHTML={{ __html: badge.description }} />*/}
          {/*)}*/}

          <Polyglot.Editor
            theme="snow"
            name="description"
            languageStrings={badge.description}
            placeholder="이 Badge에 대한 상세 설명을 입력해주세요."
            onChangeProps={changeBadgeQueryProp}
            readOnly={!isUpdatable}
          />
        </FormTable.Row>
        <FormTable.Row name="Tag 정보">
          {/*{isUpdatable ? (*/}
          {/*  <Form.Field>*/}
          {/*    <div className={tagCount >= 10 ? 'ui right-top-count input error' : 'ui right-top-count input'}>*/}
          {/*      <span className="count">*/}
          {/*        <span className="now">{tagCount}</span>/<span className="max">10</span>*/}
          {/*      </span>*/}
          {/*      <input*/}
          {/*        id="tags"*/}
          {/*        type="text"*/}
          {/*        placeholder='Up to 10 words can be entered, separated by commas (",").'*/}
          {/*        value={badge.tags}*/}
          {/*        onChange={(event: any) => onChangeTagInfo(event.target.value)}*/}
          {/*      />*/}
          {/*    </div>*/}
          {/*  </Form.Field>*/}
          {/*) : (*/}
          {/*  badge.tags*/}
          {/*)}*/}

          <Polyglot.Input
            name="tags"
            onChangeProps={changeBadgeQueryProp}
            languageStrings={badge.tags}
            placeholder="단어간에는 쉼표(“,”)로 구분하며, 최대 10개까지 입력하실 수 있습니다."
            readOnly={!isUpdatable}
          />
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default BadgeAdditionalInfoView;
