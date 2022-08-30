import React from 'react';
import { Container, Form, Button } from 'semantic-ui-react';
import { SubActions, PageTitle } from 'shared/components';
import { PortletEditView } from './PortletEditView';
import { useClearPortletEdit, useRequestPortletEditForm } from './portletEdit.services';
import { usePortletEditForm } from './portletEdit.stores';
import { initPortletEditForm } from './portletEdit.models';
import { onClickList } from '../portletDetail/portletDetail.events';
import { onChangeTitle, onChangeStartDate, onChangeEndDate, onClickEdit } from './portletEdit.events';

export function PortletEditContainer() {
  useClearPortletEdit();
  useRequestPortletEditForm();
  const editForm = usePortletEditForm() || initPortletEditForm();

  return (
    <Container fluid>
      <PageTitle breadcrumb={breadcrumb} />
      <div className="content">
        <Form>
          <PortletEditView
            editForm={editForm}
            onChangeTitle={onChangeTitle}
            onChangeStartDate={onChangeStartDate}
            onChangeEndDate={onChangeEndDate}
          />
          <SubActions form>
            <SubActions.Right>
              <Button type="button" onClick={onClickList}>
                목록
              </Button>
              {editForm.editable === true && (
                <Button primary type="button" onClick={() => onClickEdit(editForm.id)}>
                  수정
                </Button>
              )}
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
  { key: 'toktok-portlet', content: 'toktok Content 수정', active: true, link: false },
];
