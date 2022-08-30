import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import { Container, Button } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { Loader } from 'shared/components';
import { LoaderService } from 'shared/components/Loader';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { CubeService } from '../../../cube';
import { ServiceType } from '../../../student';
import { CardService } from '../../../card/card';
import { BadgeService } from '../../../certification';
import { divisionCategories } from '../../../card/card/ui/logic/CardHelper';
import { CollegeService, ContentsProviderService } from '../../../college';

import { TrainingService } from '../../index';
import TrainingDetailView from '../view/TrainingDetailView';
import { getCardMap, getCubeMap } from './UserHelper';

interface Params {
  cineroomId: string;
  userId: string;
}

interface Props extends RouteComponentProps<Params> {}

interface Injected {
  trainingService: TrainingService;
  badgeService: BadgeService;
  cubeService: CubeService;
  cardService: CardService;
  collegeService: CollegeService;
  contentsProviderService: ContentsProviderService;
  loaderService: LoaderService;
}

@inject(
  'trainingService',
  'badgeService',
  'cubeService',
  'cardService',
  'collegeService',
  'contentsProviderService',
  'loaderService'
)
@observer
@reactAutobind
class UserTrainingDetailContainer extends ReactComponent<Props, {}, Injected> {
  //
  componentDidMount(): void {
    const { training } = this.injected.trainingService;

    if (training.id === '') {
      this.routeToTrainingList();
    }

    this.injected.loaderService.openLoader(true);
    this.findCardTrainings();
    this.findBadge();
    this.injected.loaderService.closeLoader(true);
  }

  routeToTrainingList() {
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/user-management/user/user-detail/${this.props.match.params.userId}/list-training`
    );
  }

  async findCardTrainings() {
    //
    const { userId } = this.props.match.params;
    const { trainingService } = this.injected;
    const { training, findAllTrainingsForCard } = trainingService;

    if (training.type === ServiceType.Card) {
      await findAllTrainingsForCard(userId, training.lectureId);
      await this.setTrainingData();
    }
  }

  async findBadge() {
    const { badgeService, trainingService } = this.injected;

    const { training, changeTrainingProp } = trainingService;

    if (training.lectureId) {
      const badges = await badgeService.findBadgesByCardId(training.lectureId);

      let badgeNames = '';

      if (badges && badges.length > 0) {
        badges.forEach((badge, index) => {
          index === 0
            ? (badgeNames = getPolyglotToAnyString(badge.name))
            : (badgeNames += `, ${getPolyglotToAnyString(badge.name)}`);
        });
      } else {
        badgeNames = '-';
      }

      changeTrainingProp('badgeNames', badgeNames);
    }
  }

  async setTrainingData() {
    //
    const { trainingService, cubeService, cardService, collegeService, contentsProviderService } = this.injected;

    const { collegesMap, channelMap } = collegeService;
    const { findContentsProvider } = contentsProviderService;

    const { trainingsForCard, changeTrainingsForCardProp } = trainingService;
    const cardIds: string[] = [];
    const cubeIds: string[] = [];

    trainingsForCard.map((training) =>
      training.studentType === ServiceType.Card ? cardIds.push(training.lectureId) : cubeIds.push(training.lectureId)
    );

    const cardMap = await getCardMap(cardIds, cardService);
    const cubeMap = await getCubeMap(cubeIds, cubeService);

    trainingsForCard &&
      trainingsForCard.forEach((training, index) => {
        if (training.studentType === ServiceType.Card) {
          const cardWithContents = cardMap.get(training.lectureId);

          if (cardWithContents) {
            const { card, cardContents } = cardWithContents;

            const { mainCategory } = divisionCategories(card.categories);

            changeTrainingsForCardProp(index, 'lectureName', card.name);
            changeTrainingsForCardProp(index, 'type', 'Card');
            changeTrainingsForCardProp(
              index,
              'category',
              `${collegesMap.get(mainCategory.collegeId)} > ${channelMap.get(mainCategory.channelId)}`
            );
            changeTrainingsForCardProp(index, 'learningTime', card.learningTime);
            changeTrainingsForCardProp(index, 'surveyId', cardContents.surveyId);
            changeTrainingsForCardProp(index, 'learningContents', cardContents.learningContents);
          }
        } else {
          //
          const cubeWithContents = cubeMap.get(training.lectureId);

          if (cubeWithContents) {
            const { cube, cubeContents } = cubeWithContents;

            const { mainCategory } = divisionCategories(cube.categories);
            findContentsProvider(cubeContents.organizerId).then((organizer) => {
              changeTrainingsForCardProp(index, 'organizerName', organizer ? organizer.name : '');
            });

            changeTrainingsForCardProp(index, 'lectureName', cube.name);
            changeTrainingsForCardProp(index, 'type', cube.type);
            changeTrainingsForCardProp(
              index,
              'category',
              `${collegesMap.get(mainCategory.collegeId)} > ${channelMap.get(mainCategory.channelId)}`
            );
            changeTrainingsForCardProp(index, 'learningTime', cube.learningTime);
            changeTrainingsForCardProp(index, 'surveyId', cubeContents.surveyId);
          }
        }
      });
  }

  render() {
    const { training, trainingsForCard } = this.injected.trainingService;

    return (
      <Container fluid>
        <Loader>
          <TrainingDetailView training={training} trainingsForCard={trainingsForCard} />
        </Loader>
        <div className="fl-right">
          <Button onClick={this.routeToTrainingList} type="button">
            목록
          </Button>
        </div>
      </Container>
    );
  }
}

export default withRouter(UserTrainingDetailContainer);
