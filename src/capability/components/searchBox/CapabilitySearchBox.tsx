import React from 'react';
import { Form, Grid, Segment } from 'semantic-ui-react';

import Assessments from './Assessments';
import Search  from './Search';

const CapabilitySearchBox = () => {
  //
  return (
    <Segment>
      <Form className="search-box">
        <Grid>
          <Grid.Row>
            <Assessments />
            <Search />
          </Grid.Row>
        </Grid>
      </Form>
    </Segment>
  );
};

export default CapabilitySearchBox;
