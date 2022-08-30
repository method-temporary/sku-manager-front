import React from 'react';
import { PortletDetailView } from './PortletDetailView';
import { Container, Button } from 'semantic-ui-react';
import { PageTitle } from 'shared/components';
import { useRequestPortletDetail } from './portletDetail.services';
import { usePortletDetail } from './portletDetail.stores';
import { onClickList, onClickDelete, onClickEdit } from './portletDetail.events';

export function PortletDetailContainer() {
  useRequestPortletDetail();
  const portletDetail = usePortletDetail();

  return (
    <Container fluid>
      <PageTitle breadcrumb={breadcrumb} />
      {portletDetail !== undefined && (
        <>
          <PortletDetailView portletDetail={portletDetail} />
          <div className="btn-group">
            <div className="fl-right">
              <Button basic type="button" onClick={onClickList}>
                목록
              </Button>
              {portletDetail.editable === true && (
                <>
                  <Button primary type="button" onClick={() => onClickDelete(portletDetail.id)}>
                    삭제
                  </Button>
                  <Button primary type="button" onClick={() => onClickEdit(portletDetail.id)}>
                    수정
                  </Button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </Container>
  );
}

const breadcrumb = [
  { key: 'home', content: 'HOME', active: false, link: true },
  { key: 'arrage-management', content: '전시 관리', active: false, link: true },
  { key: 'toktok-portlet', content: 'toktok Content 상세', active: true, link: false },
];
