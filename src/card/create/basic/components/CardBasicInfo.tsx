import React from 'react';
import { observer } from 'mobx-react';
import { MemberViewModel } from '@nara.drama/approval';
import { Button, Form, Grid, Input, Select, Table } from 'semantic-ui-react';
import dayjs from 'dayjs';

import { GroupBasedAccessRuleModel, SelectType, YesNo } from 'shared/model';
import { alert, AlertModel, confirm, ConfirmModel, Polyglot, RadioGroup } from 'shared/components';
import { getPolyglotToAnyString, getPolyglotToString } from 'shared/components/Polyglot';
import { AccessRuleService } from 'shared/present';

import { DifficultyLevel } from '_data/lecture/cards/model/vo/DifficultyLevel';

import { useUserGroupMap } from 'usergroup/group/present/logic/usergroup.util';
import ManagerListModal from 'cube/cube/ui/view/ManagerListModal';
import { useFindColleges } from 'college/College.hook';
import CollegeSelectedModal from 'college/shared/components/collegeSelectedModal/CollegeSelectedModal';
import { ChannelWithAnotherInfo } from 'college/shared/components/collegeSelectedModal/model/ChannelWithAnotherInfo';

import { CardOperator } from '../model/vo';

import CardDetailStore from '../../../detail/CardDetail.store';
import { displayChannelToTable } from '../../../shared/utiles';
import CardSelectModal from '../../../shared/components/cardSelectModal/CardSelectModal';
import { CardWithAccessAndOptional } from '../../../shared/components/cardSelectModal/model/CardWithAccessAndOptional';

import {
  convertCardCategory,
  makeSubCategoryDisplay,
  onChangeCardCreatePolyglot,
  setCardCreateByCopyCard,
} from '../../CardCreate.util';
import CardCreateStore from '../../CardCreate.store';

import { CardCategoryWithInfo } from '../model/CardCategoryWithInfo';
import { CardModel, CardService } from 'card/card';

import { cardStateDisplay } from '../../../card/ui/logic/CardHelper';

interface Props {
  //
  readonly?: boolean;
}

const stamp = [
  { key: '0', text: 'Yes', value: true },
  { key: '1', text: 'No', value: false },
];

const CardBasicInfo = observer(({ readonly }: Props) => {
  //
  const {
    copyCard,
    searchable,
    name,
    simpleDescription,
    description,
    mainCategory,
    subCategories,
    hasStamp,
    stampCount,
    hasPrerequisite,
    prerequisiteCards,
    cardOperator,
    difficultyLevel,
    mandatory,
    setCopyCard,
    setSearchable,
    setMainCategory,
    setSubCategories,
    setHasStamp,
    setStampCount,
    setHasPrerequisite,
    setPrerequisiteCards,
    setCardOperator,
    setDifficultyLevel,
    setMandatory,
  } = CardCreateStore.instance;
  const { registeredTime, registrantName, approvalInfo, cardState } = CardDetailStore.instance;
  const { groupBasedAccessRule } = AccessRuleService.instance;

  const groupAccessRoles = GroupBasedAccessRuleModel.asGroupBasedAccessRule(groupBasedAccessRule);

  const { data: Colleges } = useFindColleges();
  const userGroupMap = useUserGroupMap();

  const mainChannel = convertCardCategory(mainCategory);

  const subChannels = subCategories.map((cardCategory) => convertCardCategory(cardCategory));

  const onSelectOperator = (member: MemberViewModel) => {
    //
    setCardOperator({
      id: member.id,
      email: member.email,
      name: member.name,
      companyCode: member.companyCode,
      companyName: member.companyName,
    } as CardOperator);
  };

  const onOkChannel = (channels: ChannelWithAnotherInfo[], isSubChannel: boolean) => {
    //
    if (isSubChannel) {
      // ?????? ????????? ??????
      setSubCategories(channels.map((channel) => getCardCategoryByChannel(channel)));
    } else {
      // ?????? ????????? ??????
      const mainChannel = channels[0];
      setMainCategory(getCardCategoryByChannel(mainChannel));
      // ?????? ?????? ????????? ????????? ?????? ????????? ???????????? ?????? ???????????? ?????????
      if (mainChannel.parentId === '') {
        // 1 Depth ??? ???
        const hasMainInSub = subCategories.some((category) => category.channelId === mainChannel.id);

        // ????????? Channel ??? Sub ?????? ?????? ?????? ???
        if (hasMainInSub) {
          setSubCategories(
            subCategories.filter((category) => category.channelId !== mainChannel.id).map((category) => category)
          );
        }
      } else {
        // 2 Depth ??? ???
        let nextSubCategories: CardCategoryWithInfo[] = subCategories.slice();
        const hasMainInSub = subCategories.some((category) => category.twoDepthChannelId === mainChannel.id);

        if (hasMainInSub) {
          // ????????? Channel Sub ?????? ??????
          nextSubCategories = nextSubCategories
            .filter((category) => category.twoDepthChannelId !== mainChannel.id)
            .map((category) => category);

          // ????????? Channel ??? 1 Depth ??? ?????? 2 Depth Channel ??? ????????? 1 Depth ??? ????????????.
          const hasAnotherSub = nextSubCategories.some(
            (category) =>
              category.channelId === mainChannel.parentId &&
              category.twoDepthChannelId !== mainChannel.id &&
              category.twoDepthChannelId !== ''
          );

          if (!hasAnotherSub) {
            // ????????? Channel ??? 1 Depth ??????
            nextSubCategories = nextSubCategories
              .filter((category) => category.channelId !== mainChannel.parentId)
              .map((category) => category);
          }
        }

        setSubCategories(nextSubCategories);
      }
    }
  };

  const getCardCategoryByChannel = (channel: ChannelWithAnotherInfo) => {
    //
    return {
      twoDepthChannelId: channel.parentId ? channel.id : channel.twoDepthChannelId,
      mainCategory: channel.mainCategory,
      channelId: channel.parentId ? channel.parentId : channel.id,
      parentId: channel.parentId,
      displayOrder: channel.displayOrder,
      name: channel.name,
      collegeId: channel.collegeId,
    } as CardCategoryWithInfo;
  };

  const onChangeHasPrerequisite = (value: YesNo) => {
    //
    if (value === 'No' && prerequisiteCards.length > 0) {
      confirm(
        ConfirmModel.getCustomConfirm(
          '???????????? ?????? ??????',
          '????????? ??????????????? ???????????????. ?????????????????????????',
          false,
          '??????',
          '??????',
          () => {
            setPrerequisiteCards([]);
            setHasPrerequisite(value);
          }
        )
      );
    } else {
      setHasPrerequisite(value);
    }
  };

  const onOkCopy = (selectedCards: CardWithAccessAndOptional[]) => {
    //
    const selectedCard = selectedCards[0];

    setCopyCard(selectedCard);
    setCardCreateByCopyCard(selectedCard, userGroupMap);
  };

  return (
    <Table celled>
      <colgroup>
        <col width="20%" />
        <col width="30%" />
        <col width="20%" />
        <col width="30%" />
      </colgroup>

      {/* <Table.Header>
        <Table.Row>
          <Table.HeaderCell colSpan={4} className="title-header">
            <Grid className="list-info">
              <Grid.Row className="padding-0px">
                <Grid.Column width={8} style={{ color: 'white' }}>
                  ????????????
                </Grid.Column>
                <Grid.Column width={8}>
                  {!readonly && (
                    <CardSelectModal
                      selectedCards={copyCard ? [copyCard] : undefined}
                      onOk={onOkCopy}
                      groupAccessRoles={groupAccessRoles}
                      trigger={
                        <Button type="button" className="floated-right padding-8px">
                          Card ?????? ????????????
                        </Button>
                      }
                      ignoreAccess
                    />
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header> */}
      <Table.Body>
        {!readonly && (
          <>
            <Table.Row>
              <Table.Cell className="tb-header">?????? ?????? ??????</Table.Cell>
              <Table.Cell>
                <Polyglot.Languages onChangeProps={onChangeCardCreatePolyglot} readOnly={readonly} />
              </Table.Cell>
            </Table.Row>
          </>
        )}
        {/* <Table.Row>
          <Table.Cell className="tb-header">?????? ?????? ??????</Table.Cell>
          <Table.Cell>
            <Polyglot.Languages onChangeProps={onChangeCardCreatePolyglot} readOnly={readonly} />
          </Table.Cell>
          <Table.Cell className="tb-header">?????? ??????</Table.Cell>
          <Table.Cell>
            <Polyglot.Default onChangeProps={onChangeCardCreatePolyglot} readOnly={readonly} />
          </Table.Cell>
        </Table.Row> */}
        {/* <Table.Row>
          <Table.Cell className="tb-header">
            Card ?????? ?????? ?????? <span className="required"> *</span>
          </Table.Cell>
          <Table.Cell colSpan={3}>
            {!readonly ? (
              <Form.Group>
                <RadioGroup
                  value={searchable}
                  values={['Yes', 'No']}
                  labels={['??????', '?????????']}
                  onChange={(e: any, data: any) => setSearchable(data.value)}
                />
              </Form.Group>
            ) : (
              <>{searchable === 'Yes' ? '??????' : '?????????'}</>
            )}
          </Table.Cell>
        </Table.Row> */}

        {readonly && (
          <>
            <Table.Row>
              <Table.Cell className="tb-header">?????????</Table.Cell>
              <Table.Cell colSpan={3}>{getPolyglotToString(registrantName)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">????????????</Table.Cell>
              <Table.Cell colSpan={3}>{`${dayjs(registeredTime).format('YYYY.MM.DD HH:mm:ss')}`}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">????????????</Table.Cell>
              <Table.Cell colSpan={3}>{cardStateDisplay(cardState)}</Table.Cell>
            </Table.Row>
          </>
        )}
        <Table.Row>
          <Table.Cell className="tb-header">
            {/* qkrxogh */}
            Card ?????? <span className="required"> *</span>
          </Table.Cell>
          <Table.Cell colSpan={3}>
            {!readonly ? (
              <Form.Group>
                <RadioGroup
                  value={searchable}
                  values={['Yes', 'No']}
                  labels={['?????????', '?????????']}
                  onChange={(e: any, data: any) => setSearchable(data.value)}
                />
              </Form.Group>
            ) : (
              <>{searchable === 'Yes' ? '?????????' : '?????????'}</>
            )}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="tb-header">
            ?????? <span className="required"> *</span>
          </Table.Cell>
          <Table.Cell colSpan={3}>
            <Polyglot.Input
              readOnly={readonly}
              languageStrings={name}
              name="name"
              onChangeProps={onChangeCardCreatePolyglot}
              placeholder="????????? ??????????????????. (?????? 200????????? ????????????)"
              maxLength="200"
            />
          </Table.Cell>
        </Table.Row>
        {/* <Table.Row>
            <Table.Cell className="tb-header">
              Card ?????? ?????? <span className="required"> *</span>
            </Table.Cell>
            <Table.Cell colSpan={3}>
              <Polyglot.TextArea
                readOnly={readonly}
                name="simpleDescription"
                onChangeProps={onChangeCardCreatePolyglot}
                languageStrings={simpleDescription}
                maxLength={200}
                placeholder="Card ?????? ????????? ??????????????????. (?????? 200????????? ????????????)"
              />
            </Table.Cell>
          </Table.Row> */}
        {/* <Table.Row>
            <Table.Cell className="tb-header">
              Card ?????? <span className="required"> *</span>
            </Table.Cell>
            <Table.Cell colSpan={3}>
              <Polyglot.Editor
                readOnly={readonly}
                name="description"
                languageStrings={description}
                onChangeProps={onChangeCardCreatePolyglot}
                maxLength={3000}
                placeholder="Card ????????? ??????????????????. (3,000????????? ????????????)"
              />
            </Table.Cell>
          </Table.Row> */}
        {/* <Table.Row>
            <Table.Cell className="tb-header">
              ?????? ?????? <span className="required"> *</span>
            </Table.Cell>
            <Table.Cell colSpan={3}>
              <CollegeSelectedModal
                readonly={readonly}
                mainChannel={mainChannel}
                subChannels={subChannels}
                onOk={onOkChannel}
              />
              {mainCategory.channelId && displayChannelToTable(mainCategory, Colleges?.results || [])}
            </Table.Cell>
          </Table.Row> */}
        {/* <Table.Row>
            <Table.Cell className="tb-header">?????? ??????</Table.Cell>
            <Table.Cell colSpan={3}>
              <CollegeSelectedModal
                readonly={readonly}
                isSubChannel
                mainChannel={mainChannel}
                subChannels={subChannels}
                onOk={onOkChannel}
              />

              {makeSubCategoryDisplay(Colleges?.results || [])}
            </Table.Cell>
          </Table.Row> */}
        {/* <Table.Row>
            <Table.Cell className="tb-header">
              Stamp ???????????? <span className="required"> *</span>
            </Table.Cell>
            <Table.Cell colSpan={3}>
              {!readonly ? (
                <Form.Group>
                  <Form.Field
                    control={Select}
                    placeholder="Select"
                    options={stamp}
                    value={hasStamp}
                    onChange={(_: any, data: any) => {
                      setHasStamp(data.value);
                      data.value ? setStampCount(stampCount || 1) : setStampCount(0);
                    }}
                  />
                  {hasStamp ? (
                    <Form.Field
                      control={Input}
                      placeholder="Stamp ??????"
                      value={stampCount}
                      onChange={(_: any, data: any) => {
                        setStampCount(data.value || 1);
                      }}
                      type="number"
                      min={1}
                    />
                  ) : null}
                </Form.Group>
              ) : (
                <>{stampCount > 0 ? `Yes (${stampCount})` : 'No'}</>
              )}
            </Table.Cell>
          </Table.Row> */}
        {/* {readonly && (
          <>
            <Table.Row>
              <Table.Cell className="tb-header">?????? ??????</Table.Cell>
                <Table.Cell colSpan={3}>
                  {`${dayjs(registeredTime).format('YYYY.MM.DD HH:mm:ss')} | ${getPolyglotToAnyString(registrantName)}`}
                </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">?????? ??????</Table.Cell>
              <Table.Cell colSpan={3}>{approvalInfo}</Table.Cell>
            </Table.Row>
          </>
        )} */}

        {/* <Table.Row>
            <Table.Cell className="tb-header">
              ?????? Card ?????? <span className="required"> *</span>
            </Table.Cell>
            <Table.Cell colSpan={3}>
              {!readonly ? (
                <Form.Group>
                  <RadioGroup
                    values={['Yes', 'No']}
                    value={hasPrerequisite}
                    onChange={(e: any, data: any) => onChangeHasPrerequisite(data.value)}
                  />
                </Form.Group>
              ) : (
                hasPrerequisite
              )}
            </Table.Cell>
          </Table.Row> */}
        {/* <Table.Row>
            <Table.Cell className="tb-header">
              ????????? <span className="required"> *</span>
            </Table.Cell>
            <Table.Cell colSpan={3}>
              <ManagerListModal
                readonly={readonly}
                handleOk={onSelectOperator}
                buttonName="????????? ??????"
                multiSelect={false}
              />

              {cardOperator && cardOperator.id && (
                <Table celled>
                  <colgroup>
                    <col width="30%" />
                    <col width="20%" />
                    <col width="50%" />
                  </colgroup>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell textAlign="center">??????</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">??????</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">?????????</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>{getPolyglotToAnyString(cardOperator.companyName)}</Table.Cell>
                      <Table.Cell>{getPolyglotToAnyString(cardOperator.name)}</Table.Cell>
                      <Table.Cell>{cardOperator.email}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              )}
            </Table.Cell>
          </Table.Row> */}
        {/* <Table.Row>
            <Table.Cell className="tb-header">
              ????????? <span className="required"> *</span>
            </Table.Cell>
            <Table.Cell colSpan={3}>
              {!readonly ? (
                <Form.Field
                  control={Select}
                  width={4}
                  placeholder="Select"
                  options={SelectType.difficulty}
                  value={difficultyLevel || ''}
                  onChange={(e: any, data: any) => setDifficultyLevel(data.value as DifficultyLevel)}
                />
              ) : (
                difficultyLevel
              )}
            </Table.Cell>
          </Table.Row> */}
        {/* <Table.Row>
            <Table.Cell className="tb-header">
              ?????? ?????? ?????? ?????? <span className="required"> *</span>
            </Table.Cell>
            <Table.Cell colSpan={3}>
              {!readonly ? (
                <Form.Group>
                  <RadioGroup
                    value={mandatory ? 'Yes' : 'No'}
                    values={['Yes', 'No']}
                    onChange={(e: any, data: any) => setMandatory(data.value === 'Yes' ? true : false)}
                  />
                </Form.Group>
              ) : mandatory ? (
                'Yes'
              ) : (
                'No'
              )}
            </Table.Cell>
          </Table.Row> */}
      </Table.Body>
    </Table>
  );
});

export default CardBasicInfo;
