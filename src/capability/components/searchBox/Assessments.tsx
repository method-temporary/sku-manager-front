import React, { useEffect } from 'react';
import { Form, Grid, Select } from 'semantic-ui-react';
import { observer } from 'mobx-react';

import { useFindAssessments } from '../../capability.hook';
import CapabilityStore from '../../capability.store';
import { getPolyglotToAnyString } from '../../../shared/components/Polyglot';

const Assessments = observer(() => {
  //
  const { data } = useFindAssessments();
  const {
    assessmentResultQuery: { assessmentId },
    setQdo,
    changeAssessmentResultQueryProps,
  } = CapabilityStore.instance;

  const getOptions = () => {
    const options: any = [];

    data &&
      data.map((item: any, index: number) => {
        options.push({
          key: index + 1,
          text: getPolyglotToAnyString(item.name),
          value: item.id,
        });
      });

    return options;
  };

  const onChangeAssessmentId = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeAssessmentResultQueryProps('assessmentId', e.target.value);
  };

  useEffect(() => {
    if (data) {
      changeAssessmentResultQueryProps('assessmentId', data[0].id);
      setQdo();
    }
  }, [data]);

  return (
    <Grid.Column width={16}>
      <Form.Group inline>
        <label>진단명</label>
        <Form.Field control={Select} options={getOptions()} value={assessmentId} onChange={onChangeAssessmentId} />
      </Form.Group>
    </Grid.Column>
  );
});

export default Assessments;
