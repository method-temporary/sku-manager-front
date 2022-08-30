import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Breadcrumb, Button, Container, Form, Header, Icon, Input, Modal, Table } from 'semantic-ui-react';

import { SelectType, NameValueList } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import CreateTag from './CreateTag';
import CreateKeywords from './CreateKeywords';

import SearchTag from '../../model/SearchTag';
import { findbyTag, findSearchTag, modifySearchTag } from '../../api/searchTagApi';
import { setTag, setKeywords, getSearchTagCdo } from '../../store/SerchTagCdoStore';

const MODIFY_REQUIRE_ERROR = 'Tag 와 유사어를 모두 입력해주세요.';
const MODIFY_EXIST_TAG_ERROR = '중복된 Tag 가 존재합니다.';
const MODIFY_NOT_CHANGE_ERROR = '변경된 항목이 없습니다.';

interface Params {
  tagId: string;
}

function timeToDateString(time: number) {
  return moment(time).format('YYYY.MM.DD');
}

function SearchTagDetailContainer() {
  const userName = useRef<string>(localStorage.getItem('nara.displayName')!);
  const location = useLocation();
  const history = useHistory();
  const params = useParams<Params>();
  const routeToList = useCallback(() => {
    const parentPath = location.pathname.split('/tag-modify')[0];
    const listPath = `${parentPath}/tag-list`;
    history.push(listPath);
  }, [location, history]);
  const [remoteItem, setRemoteItem] = useState<SearchTag>();
  useEffect(() => {
    const { tagId } = params;
    findSearchTag(tagId).then((searchTag) => {
      setRemoteItem(searchTag);
      setTag(searchTag.tag, 'SearchTagDetailContainer');
      setKeywords(searchTag.keywords, 'SearchTagDetailContainer');
    });
  }, [params]);

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
    if (remoteItem === undefined) {
      return;
    }
    if (remoteItem.tag === searchTagCdo.tag && remoteItem.keywords === searchTagCdo.keywords) {
      openAlert(MODIFY_NOT_CHANGE_ERROR);
      return;
    }
    if (searchTagCdo.tag === '' || searchTagCdo.keywords === '') {
      openAlert(MODIFY_REQUIRE_ERROR);
      return;
    }
    let nextTag: string | null = null;
    const nameValueList = new NameValueList();
    if (remoteItem.tag !== searchTagCdo.tag) {
      nameValueList.nameValues.push({ name: 'tag', value: searchTagCdo.tag });
      nextTag = searchTagCdo.tag;
    }
    if (remoteItem.keywords !== searchTagCdo.keywords) {
      nameValueList.nameValues.push({
        name: 'keywords',
        value: searchTagCdo.keywords,
      });
    }
    const name = localStorage.getItem('nara.displayName')!;
    const email = localStorage.getItem('nara.email')!;
    nameValueList.nameValues.push({
      name: 'name',
      value: name,
    });
    nameValueList.nameValues.push({
      name: 'email',
      value: email,
    });
    if (nextTag !== null) {
      findbyTag(searchTagCdo.tag).then((nextTag) => {
        if (nextTag !== null && nextTag.id !== undefined) {
          openAlert(MODIFY_EXIST_TAG_ERROR);
          return;
        }
        modifySearchTag(remoteItem.id, nameValueList).then(routeToList);
      });
    } else {
      modifySearchTag(remoteItem.id, nameValueList).then(routeToList);
    }
  }, [remoteItem]);

  useEffect(() => {
    return () => {
      setTag('', 'SearchTagDetailContainer');
      setKeywords('', 'SearchTagDetailContainer');
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
                    <Form.Field
                      control={Input}
                      value={remoteItem && getPolyglotToAnyString(remoteItem.registrant.name)}
                      readOnly
                    />
                  </Form.Group>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="tb-header">최종 업데이트</Table.Cell>
                <Table.Cell>
                  <Form.Group>
                    <Form.Field
                      control={Input}
                      value={
                        remoteItem &&
                        timeToDateString(
                          remoteItem.modifiedTime !== undefined ? remoteItem.modifiedTime : remoteItem.registeredTime
                        )
                      }
                      readOnly
                    />
                  </Form.Group>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="tb-header">수정/등록일자</Table.Cell>
                <Table.Cell>
                  <Form.Group>
                    <Form.Field
                      control={Input}
                      value={remoteItem && remoteItem.modifier && getPolyglotToAnyString(remoteItem.modifier.name)}
                      readOnly
                    />
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

export default SearchTagDetailContainer;
