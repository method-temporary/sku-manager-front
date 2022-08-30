import React from 'react';
import { observer } from 'mobx-react';
import { Form, Grid, Select } from 'semantic-ui-react';
import { SelectTypeModel } from '../../../../shared/model';
import { LearningContentType } from '../../../card/model/vo/LearningContentType';
import { getPolyglotToAnyString } from '../../../../shared/components/Polyglot';
import CardStudentStore from '../CardStudent.store';
import { useFindCardById } from '../../../list/CardList.hook';

interface Params {
  cardId: string;
}

export const PhaseSearchField = observer(() => {
  //
  const { cardStudentQuery, cardStudentParams, setChildLecture } = CardStudentStore.instance;

  const { data: card } = useFindCardById(cardStudentParams.cardId);

  const getOptions = () => {
    //
    const list: SelectTypeModel[] = [new SelectTypeModel()];

    if (card) {
      const { learningContents } = card.cardContents;
      learningContents?.forEach((content) => {
        if (content.learningContentType === LearningContentType.Chapter) {
          content.children?.forEach((cContent) => {
            list.push(
              new SelectTypeModel(
                cContent.contentId,
                `${getPolyglotToAnyString(content.name)} > ${getPolyglotToAnyString(cContent.name)}`,
                cContent.contentId
              )
            );
          });
        } else if (content.learningContentType === LearningContentType.Cube) {
          list.push(new SelectTypeModel(content.contentId, getPolyglotToAnyString(content.name), content.contentId));
        }
      });
    }

    return list;
  };

  return (
    <Grid.Column width={16} style={{ backgroundColor: 'red' }}>
      <Form.Group inline>
        <label>완료 Phase</label>
        <Form.Field
          control={Select}
          value={cardStudentQuery.childLecture}
          placeholder="전체"
          options={getOptions()}
          // disabled={disabled}
          onChange={(event: any, data: any) => setChildLecture(data.value)}
          // search={search}
        />
      </Form.Group>
    </Grid.Column>
  );
});
