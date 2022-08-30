import React from 'react';
import { observer } from 'mobx-react';
import { Table } from 'semantic-ui-react';
import dayjs from 'dayjs';

import { Params } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { DEFAULT_DATE_FORMAT } from '_data/shared';
import { CardCategory, getInitCardCategory } from '_data/lecture/cards/model/vo/CardCategory';

import { useFindColleges } from 'college/College.hook';
import { displayChannel } from 'card/shared/utiles';
import { divisionCategories } from 'card/card/ui/logic/CardHelper';

import { useParams } from 'react-router-dom';
import { learningManagementUrl } from '../../../../../../Routes';
import { LearningContentWithOptional } from '../../../LearningContents/model/learningContentWithOptional';

interface Props {
  //
  learningContent: LearningContentWithOptional;
}

const LearningContentsCube = observer(({ learningContent }: Props) => {
  //
  const { data: College } = useFindColleges();
  const { cineroomId } = useParams<Params>();
  const location = window.location;

  const onClickName = () => {
    //
    if (learningContent.contentDetailType !== 'ELearning' && learningContent.contentDetailType !== 'ClassRoomLecture') {
      //
      window.open(
        `${location.protocol}//${location.host}/manager/cineroom/${cineroomId}/${learningManagementUrl}/cubes/cube-detail/${learningContent.contentId}`,
        '_blank'
      );
    }
  };

  const { mainCategory }: { mainCategory: CardCategory; subCategories: CardCategory[] } =
    learningContent.cubeWithMaterial
      ? divisionCategories(learningContent.cubeWithMaterial.cube.categories)
      : { mainCategory: getInitCardCategory(), subCategories: [] };

  const isEnrollment =
    learningContent.contentDetailType === 'ELearning' || learningContent.contentDetailType === 'ClassRoomLecture';

  return (
    <>
      <Table celled>
        <colgroup>
          <col />
          <col width="15%" />
          <col width="15%" />
          <col width="15%" />
          <col width="15%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>제목</Table.HeaderCell>
            <Table.HeaderCell>학습유형</Table.HeaderCell>
            <Table.HeaderCell>Channel</Table.HeaderCell>
            <Table.HeaderCell>등록일자</Table.HeaderCell>
            <Table.HeaderCell>생성자</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell className={!isEnrollment ? 'pointer' : ''} onClick={() => !isEnrollment && onClickName()}>
              {getPolyglotToAnyString(learningContent.name)}
            </Table.Cell>
            <Table.Cell>{learningContent.contentDetailType}</Table.Cell>
            <Table.Cell>{displayChannel(mainCategory, College?.results || [])}</Table.Cell>
            <Table.Cell>
              {learningContent.cubeWithMaterial
                ? dayjs(learningContent.cubeWithMaterial.cube.registeredTime).format(DEFAULT_DATE_FORMAT)
                : ''}
            </Table.Cell>
            <Table.Cell>
              {learningContent.cubeWithMaterial
                ? getPolyglotToAnyString(learningContent.cubeWithMaterial.cubeContents.registrantName)
                : ''}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  );
});

export default LearningContentsCube;
