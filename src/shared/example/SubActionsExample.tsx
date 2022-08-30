import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import { SubActions, Pagination } from '../components';
import { Header, Button, Container, Icon } from 'semantic-ui-react';

interface State {
  accessLists: any;
}

@reactAutobind
@observer
class SubActionsExample extends ReactComponent<{}, State> {
  //
  render() {
    //
    return (
      <Container fluid>
        <Header size="small">테이블 목록 상단</Header>
        <SubActions>
          <SubActions.Left>
            <SubActions.Count number={123} text="number" />
          </SubActions.Left>
          <SubActions.Right>
            <Pagination.LimitSelect />
            <Button>
              <Icon name="file excel outline" />
              엑셀다운로드
            </Button>
            <SubActions.CreateButton onClick={() => {}} />
          </SubActions.Right>
        </SubActions>

        <Header size="small">폼 테이블 하단</Header>
        <SubActions form>
          <SubActions.Left>
            <Button primary type="button">
              Delete
            </Button>
          </SubActions.Left>
          <SubActions.Right>
            <Button basic type="button">
              List
            </Button>
            <Button primary type="button">
              Merge
            </Button>
          </SubActions.Right>
        </SubActions>
      </Container>
    );
  }
}

export default SubActionsExample;
