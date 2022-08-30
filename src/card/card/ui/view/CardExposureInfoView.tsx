import React from 'react';
import { observer } from 'mobx-react';
import { Button, Checkbox, Form, Grid, Icon, Table } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { FormTable, RadioGroup, Polyglot } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { CardQueryModel } from '../..';
import { CardContentsQueryModel } from '../../model/CardContentsQueryModel';
import CommunityListModal from 'cube/community/ui/logic/CommunityListModal';
import ConceptModal from '../../../../board/tag/ui/view/ConceptModal';
import UserWorkspaceModel from '../../../../userworkspace/model/UserWorkspaceModel';

interface Props {
  cineroomId: string;
  isUpdatable: boolean;
  cardQuery: CardQueryModel;
  cardContentsQuery: CardContentsQueryModel;
  changeCardQueryProps: (name: string, value: any) => void;
  userWorkspaces: UserWorkspaceModel[];
  userWorkspaceMap: Map<string, string>;
  onClickCheckAll: (checked: boolean, require?: boolean) => void;
  onClickCheckOne: (value: UserWorkspaceModel, checked: boolean, require?: boolean) => void;
  isRequiredCheck: (id: string, parentId: string) => boolean;
  renderCardIcon: () => JSX.Element;
  communityName: string;
  setCommunity: (id: string, name: string) => void;
  clearCommunity: () => void;
  isAll: boolean;
  isRequiredAll: boolean;
  getCineroomsText: (required: boolean) => string;
}

@observer
@reactAutobind
class CardExposureInfoView extends React.Component<Props> {
  //

  render() {
    //
    const {
      cineroomId,
      isUpdatable,
      cardQuery,
      cardContentsQuery,
      changeCardQueryProps,
      userWorkspaces,
      userWorkspaceMap,
      onClickCheckAll,
      onClickCheckOne,
      isRequiredCheck,
      renderCardIcon,
      communityName,
      setCommunity,
      clearCommunity,
      isAll,
      isRequiredAll,
      getCineroomsText,
    } = this.props;

    return (
      <FormTable title="노출 정보">
        <FormTable.Row name="아이콘" required>
          {renderCardIcon()}
        </FormTable.Row>
        <FormTable.Row name="공개 / 비공개" required>
          {isUpdatable ? (
            <Form.Group>
              <RadioGroup
                value={cardQuery.searchable}
                values={['Yes', 'No']}
                labels={['공개', '비공개']}
                onChange={(e: any, data: any) => changeCardQueryProps('searchable', data.value)}
              />
            </Form.Group>
          ) : cardQuery.searchable === 'Yes' ? (
            '공개'
          ) : (
            '비공개'
          )}
        </FormTable.Row>
        <FormTable.Row name="핵인싸 적용 범위 설정">
          {isUpdatable ? (
            <div className="check-group">
              <div className="table-inner">
                {
                  <Grid.Column>
                    <Form.Field
                      control={Checkbox}
                      label={cineroomId === 'ne1-m2-c2' ? 'ALL' : userWorkspaceMap.get(cineroomId) || 'ALL'}
                      checked={isRequiredAll}
                      disabled={!isAll}
                      onChange={(e: any, data: any) => onClickCheckAll(data.checked, true)}
                    />
                  </Grid.Column>
                }
                {(userWorkspaces.length > 1 &&
                  userWorkspaces &&
                  userWorkspaces.length &&
                  userWorkspaces
                    .filter((userWorkspace) => {
                      if (userWorkspaces.length > 1 && userWorkspace.id !== cineroomId) {
                        return userWorkspace;
                      } else if (userWorkspaces.length === 1) {
                        return userWorkspace;
                      }
                      return null;
                    })
                    .map((userWorkspace, index) => (
                      <Grid.Column key={index}>
                        <Form.Field
                          key={index}
                          disabled={
                            (!isAll && !cardQuery.permittedRequireCineroomsIds.includes(userWorkspace.id)) ||
                            isRequiredAll
                          }
                          control={Checkbox}
                          label={getPolyglotToAnyString(userWorkspace.name)}
                          value={userWorkspace.id}
                          checked={isRequiredCheck(userWorkspace.id, userWorkspace.parentId) || isRequiredAll}
                          onChange={(e: any, data: any) => onClickCheckOne(userWorkspace, data.checked, true)}
                        />
                      </Grid.Column>
                    ))) ||
                  null}
              </div>
            </div>
          ) : (
            <>{getCineroomsText(true)}</>
            // cardQuery.permittedCinerooms
            //   .filter((userWorkspaces) => userWorkspaces.required)
            //   .map((userWorkspace, index) =>
            //     index === 0
            //       ? userWorkspaceMap.get(userWorkspace.cineroomId)
            //       : `, ${userWorkspaceMap.get(userWorkspace.cineroomId)}`
            //   )
          )}
        </FormTable.Row>
        <FormTable.Row name="멤버사 적용 범위 설정" required>
          {isUpdatable ? (
            <div className="check-group">
              <div className="table-inner">
                {
                  <Grid.Column>
                    <Form.Field
                      control={Checkbox}
                      label={cineroomId === 'ne1-m2-c2' ? 'ALL' : userWorkspaceMap.get(cineroomId) || 'ALL'}
                      checked={isAll}
                      onChange={(e: any, data: any) => onClickCheckAll(data.checked)}
                    />
                  </Grid.Column>
                }
                {(userWorkspaces.length > 1 &&
                  userWorkspaces &&
                  userWorkspaces.length &&
                  userWorkspaces
                    .filter((userWorkspace) => {
                      if (userWorkspaces.length > 1 && userWorkspace.id !== cineroomId) {
                        return userWorkspace;
                      } else if (userWorkspaces.length === 1) {
                        return userWorkspace;
                      }
                      return null;
                    })
                    .map((userWorkspace, index) => (
                      <Grid.Column key={index}>
                        <Form.Field
                          key={index}
                          disabled={isAll}
                          control={Checkbox}
                          label={getPolyglotToAnyString(userWorkspace.name)}
                          // value={subsidiary.subsidiary.id}
                          value={userWorkspace.id}
                          checked={
                            isAll ||
                            cardQuery.permittedRequireCineroomsIds.includes(userWorkspace.id) ||
                            cardQuery.permittedRequireCineroomsIds.includes(userWorkspace.parentId)
                          }
                          onChange={(e: any, data: any) => onClickCheckOne(userWorkspace, data.checked)}
                        />
                      </Grid.Column>
                    ))) ||
                  null}
              </div>
            </div>
          ) : (
            <>{getCineroomsText(false)}</>
            // cardQuery.permittedCinerooms.map((cineroom, index) =>
            //   index === 0 ? userWorkspaceMap.get(cineroom.cineroomId) : `, ${userWorkspaceMap.get(cineroom.cineroomId)}`
            // )
          )}
        </FormTable.Row>
        <FormTable.Row name="Tag 정보">
          {/*{isUpdatable ? (*/}
          {/*  <Form.Field>*/}
          {/*    <input*/}
          {/*      id="tags"*/}
          {/*      type="text"*/}
          {/*      placeholder="Words are separated by commas (“,”)."*/}
          {/*      value={cardQuery.teg}*/}
          {/*      onChange={(event: any) => changeCardQueryProps('tagsStr', event.target.value)}*/}
          {/*    />*/}
          {/*  </Form.Field>*/}
          {/*) : (*/}
          {/*  cardQuery.tags.map((tag, index) => (index === 0 ? tag : `, ${tag}`))*/}
          {/*)}*/}
          <Polyglot.Input
            languageStrings={cardQuery.tags}
            onChangeProps={changeCardQueryProps}
            name="tags"
            placeholder="단어간에는 쉼표(“,”)로 구분합니다."
            readOnly={!isUpdatable}
          />
        </FormTable.Row>

        <FormTable.Row name="Term 정보">
          <ConceptModal concepts={cardContentsQuery.terms} button={false} />
        </FormTable.Row>

        <FormTable.Row name="Community">
          {isUpdatable && (
            <CommunityListModal
              type="card"
              handleOk={({ communityId, name }) => {
                if (communityId !== undefined && name !== undefined) {
                  setCommunity(communityId, name);
                }
              }}
            />
          )}
          {communityName && (
            <Table celled>
              <colgroup>
                <col width="20%" />
                <col width="80%" />
              </colgroup>

              <Table.Header>
                <Table.Row>
                  {isUpdatable && <Table.HeaderCell className="tb-header" />}
                  <Table.HeaderCell className="tb-header">커뮤니티명</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  {isUpdatable && (
                    <Table.Cell>
                      <Button
                        icon
                        size="mini"
                        basic
                        onClick={() => {
                          clearCommunity();
                        }}
                      >
                        <Icon name="minus" />
                      </Button>
                    </Table.Cell>
                  )}
                  <Table.Cell>{communityName}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          )}
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default CardExposureInfoView;
