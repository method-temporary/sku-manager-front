import React from 'react';
import { Container, Button, Form } from 'semantic-ui-react';
import { PageTitle, SubActions } from 'shared/components';
import { PortletCreateView } from './PortletCreateView';
import { onClickList } from '../portletDetail/portletDetail.events';
import { usePortletCreateForm } from './portletCreate.stores';
import { initPortletCreateForm } from './portletCreate.models';
import { onChangeTitle, onChangeStartDate, onChangeEndDate, onClickSave } from './portletCreate.events';
import { useClearPortletCreate } from './portletCreate.services';

export function PortletCreateContainer() {
  useClearPortletCreate();
  const createForm = usePortletCreateForm() || initPortletCreateForm();

  return (
    <Container fluid>
      <PageTitle breadcrumb={breadcrumb} />
      <div className="content">
        <Form>
          <PortletCreateView
            createForm={createForm}
            onChangeTitle={onChangeTitle}
            onChangeStartDate={onChangeStartDate}
            onChangeEndDate={onChangeEndDate}
          />
          <SubActions form>
            <SubActions.Right>
              <Button type="button" onClick={onClickList}>
                목록
              </Button>
              <Button primary type="button" onClick={onClickSave}>
                저장
              </Button>
            </SubActions.Right>
          </SubActions>
        </Form>
      </div>
    </Container>
  );
}

const breadcrumb = [
  { key: 'home', content: 'HOME', active: false, link: true },

  { key: 'arrage-management', content: '전시 관리', active: false, link: true },
  { key: 'toktok-portlet', content: 'toktok Content 등록', active: true, link: false },
];
