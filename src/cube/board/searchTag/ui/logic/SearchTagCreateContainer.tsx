import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Breadcrumb, Button, Container, Form, Header, Icon, Input, Modal, Table } from 'semantic-ui-react';

import { SelectType, PolyglotModel } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { findbyTag, registerSearchTag } from '../../api/searchTagApi';
import { setTag, setKeywords, getSearchTagCdo } from '../../store/SerchTagCdoStore';
import CreateKeywords from './CreateKeywords';
import CreateTag from './CreateTag';

const CREATE_REQUIRE_ERROR = 'Tag 와 유사어를 모두 입력해주세요.';
const CREATE_EXIST_TAG_ERROR = '중복된 Tag 가 존재합니다.';

function SearchTagCreateContainer() {
  const userName = useRef<PolyglotModel>(PolyglotModel.stringToModel(localStorage.getItem('nara.displayName') || ''));
  const location = useLocation();
  const history = useHistory();
  const routeToList = useCallback(() => {
    const parentPath = location.pathname.split('/tag-create')[0];
    const listPath = `${parentPath}/tag-list`;
    history.push(listPath);
  }, [location, history]);

  const [alertOpened, setAlertOpened] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const openAlert = useCallback((nextErrorMessage: string) => {
    setErrorMessage(nextErrorMessage);
    setAlertOpened(true);
  }, []);

  const onCloseAelrt = useCallback(() => {
    setAlertOpened(false);
  }, []);

  const requestSave = useCallback(() => {
    const searchTagCdo = getSearchTagCdo();
    if (searchTagCdo.tag === '' || searchTagCdo.keywords === '') {
      openAlert(CREATE_REQUIRE_ERROR);
      return;
    }
    findbyTag(searchTagCdo.tag).then((nextTag) => {
      if (nextTag !== null && nextTag.id !== undefined) {
        openAlert(CREATE_EXIST_TAG_ERROR);
        return;
      }
      registerSearchTag(searchTagCdo).then(routeToList);
    });
  }, []);

  useEffect(() => {
    return () => {
      setTag('', 'SearchTagCreateContainer');
      setKeywords('', 'SearchTagCreateContainer');
    };
  }, []);

  return (
    <Container fluid>
      <div>
        <Breadcrumb icon="right angle" sections={SelectType.pathForTag} />
        <Header as="h2">Tag 관리</Header>
      </div>
      <div className="content">
        <Form>
          <Table celled>
            <colgroup>
              <col width="20%" />
              <col width="80%" />
            </colgroup>

            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan={2} className="title-header">
                  Tag 정보
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell className="tb-header">생성자</Table.Cell>
                <Table.Cell>
                  <Form.Group>
                    <Form.Field control={Input} value={getPolyglotToAnyString(userName.current)} readOnly />
                  </Form.Group>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="tb-header">최종 업데이트</Table.Cell>
                <Table.Cell>
                  <Form.Group>
                    <Form.Field control={Input} value="" disabled />
                  </Form.Group>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="tb-header">수정/등록일자</Table.Cell>
                <Table.Cell>
                  <Form.Group>
                    <Form.Field control={Input} value="" disabled />
                  </Form.Group>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="tb-header">Tag *</Table.Cell>
                <Table.Cell>
                  <CreateTag />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="tb-header">유사어 *</Table.Cell>
                <Table.Cell>
                  <CreateKeywords />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Form>
        <div className="fl-right btn-group">
          <Button onClick={routeToList}>목록</Button>
          <Button primary onClick={requestSave}>
            저장
          </Button>
        </div>
        <Modal size="tiny" open={alertOpened} onClose={onCloseAelrt}>
          <Modal.Header>알림</Modal.Header>
          <Modal.Content>
            <Header as="h3" icon textAlign="center">
              <Icon name="exclamation triangle" size="tiny" color="red" />
              <Header.Content>Tag 저장</Header.Content>
            </Header>
            <p className="center">{errorMessage}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button primary onClick={onCloseAelrt} type="button">
              OK
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    </Container>
  );
}

export default SearchTagCreateContainer;
