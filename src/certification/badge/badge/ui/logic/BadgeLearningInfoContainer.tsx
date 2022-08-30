import React from 'react';
import { inject, observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Form, Icon, Table } from 'semantic-ui-react';

import { SubActions } from 'shared/components';

import { BadgeModel, BadgeWithStudentCountRomModel } from '_data/badge/badges/model';
import BadgeLearningInfoSelectBadgeListView from '../view/BadgeLearningInfoSelectBadgeListView';
import BadgeListModal from './BadgeListModal';
import { CardService } from '../../../../../card';
import { CollegeService } from '../../../../../college';
import BadgeService from '../../present/logic/BadgeService';

interface Props {
  isUpdatable?: boolean;
  badge: BadgeModel;
  relatedBadges: BadgeWithStudentCountRomModel[];
  userWorkspaceMap: Map<string, string>;
  badgeCategoryMap: Map<string, string>;
  changeBadgeProp: (name: string, value: any) => void;
}

interface Injected {
  cardService: CardService;
  collegeService: CollegeService;
  badgeService: BadgeService;
}

@inject('cardService', 'collegeService', 'badgeService')
@observer
@reactAutobind
class BadgeLearningInfoContainer extends ReactComponent<Props, {}, Injected> {
  //
  onClickRelatedBadgeDelete(index: number) {
    //
    const { badge, changeBadgeProp } = this.props;

    const copiedIds: string[] = [...badge.relatedBadgeIds];
    const copiedModels: BadgeWithStudentCountRomModel[] = [...badge.relatedBadges];

    copiedIds.splice(index, 1);
    copiedModels.splice(index, 1);

    changeBadgeProp(`relatedBadgeIds`, copiedIds);
    changeBadgeProp(`relatedBadges`, copiedModels);
  }

  onClickRelatedBadgeSorting(model: BadgeWithStudentCountRomModel, oldSeq: number, newSeq: number) {
    //
    const { badge, changeBadgeProp } = this.props;

    const addId = model.id;
    const copiedIds: string[] = [...badge.relatedBadgeIds];
    const copiedModels: BadgeWithStudentCountRomModel[] = [...badge.relatedBadges];

    copiedIds.splice(oldSeq, 1);
    copiedIds.splice(newSeq, 0, addId);

    copiedModels.splice(oldSeq, 1);
    copiedModels.splice(newSeq, 0, model);

    changeBadgeProp(`relatedBadgeIds`, [...copiedIds]);
    changeBadgeProp(`relatedBadges`, copiedModels);
  }

  onClickResetRelatedBadges() {
    const { changeBadgeProp } = this.props;
    const { relatedBadgesReset, relatedBadgeResetIds } = this.injected.badgeService;

    changeBadgeProp(`relatedBadges`, relatedBadgesReset);
    changeBadgeProp(`relatedBadgeIds`, [...relatedBadgeResetIds]);
  }

  render() {
    //
    const { isUpdatable, relatedBadges, badgeCategoryMap, userWorkspaceMap, badge } = this.props;

    return (
      //
      <Table title="연관 뱃지 정보">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="title-header">연관 뱃지 정보</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              {isUpdatable && (
                <SubActions form>
                  <SubActions.Right>
                    <Form.Group>
                      <Form.Button primary onClick={this.onClickResetRelatedBadges}>
                        초기화
                      </Form.Button>
                      <BadgeListModal badge={badge} />
                    </Form.Group>
                  </SubActions.Right>
                </SubActions>
              )}
              {(relatedBadges && relatedBadges.length > 0 && (
                <BadgeLearningInfoSelectBadgeListView
                  relatedBadges={relatedBadges}
                  onClickRelatedBadgeDelete={this.onClickRelatedBadgeDelete}
                  onClickRelatedBadgeSorting={this.onClickRelatedBadgeSorting}
                  isUpdatable={isUpdatable || false}
                  cineroomsMap={userWorkspaceMap}
                  badgeCategoryMap={badgeCategoryMap}
                />
              )) || (
                <div className="no-cont-wrap no-contents-icon">
                  <Icon className="no-contents80" />
                  <div className="sr-only">콘텐츠 없음</div>
                  <div className="text">등록된 뱃지가 없습니다.</div>
                </div>
              )}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

export default BadgeLearningInfoContainer;
