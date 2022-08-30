import React from 'react';
import { Select, Segment, Grid, List, Input, Form } from 'semantic-ui-react';
import MenuType from '../../model/MenuType';
import CategoryMenuInputView from './CategoryMenuInputView';
import BoardMenuInputView from './BoardMenuInputView';
import LinkMenuInputView from './LinkMenuInputView';
import HtmlMenuInputView from './HtmlMenuInputView';
import SurveyMenuInputView from './SurveyMenuInputView';
import DiscussionView from './DiscussionView';
import {
  ChangeType,
  ChangeGroupId,
  ChangeAccessTypeToCommunityAllMember,
  ChangeAccessTypeToCommunityGroup,
  ChangeName,
  ChangeUrl,
  ChangeHtml,
  ChangeDiscussionTopic,
  ChangeSurveyInformation,
  ChangeDiscussionFileBoxId,
  ChangeDiscussionContent,
  ChangeDiscussionRelatedUrlList,
  SetDiscussionRelatedUrlList,
  ChangeDiscussionPrivateComment,
  MinusDiscussionRelatedUrlList,
} from '../../service/useSelectedMenu';
import AccessType from '../../model/AccessType';
import { useGroupList } from '../../../group/service/useGroupList';
import { useRouteMatch } from 'react-router-dom';
import RelatedUrl, { getEmptyRelatedUrl } from '../../model/RelatedUrl';

interface Params {
  cineroomId: string;
  communityId: string;
}

const menuType = [
  { key: 'CATEGORY', value: 'CATEGORY', text: '카테고리' },
  { key: 'BASIC', value: 'BASIC', text: '일반 게시판' },
  { key: 'DISCUSSION', value: 'DISCUSSION', text: '토론 게시판' },
  { key: 'ANONYMOUS', value: 'ANONYMOUS', text: '익명 게시판' },
  { key: 'ANODISCUSSION', value: 'ANODISCUSSION', text: '익명 토론 게시판' },
  { key: 'NOTICE', value: 'NOTICE', text: '공지사항' },
  { key: 'STORE', value: 'STORE', text: '자료실' },
  { key: 'SURVEY', value: 'SURVEY', text: '설문조사' },
  { key: 'LINK', value: 'LINK', text: '링크' },
  { key: 'HTML', value: 'HTML', text: 'HTML' },
];
const groupType = [
  { key: 'group1', value: 'group1', text: 'group1' },
  { key: 'group2', value: 'group2', text: 'group2' },
];
interface MenuInputViewProps {
  menuId: string;
  type: MenuType;
  accessType?: AccessType;
  groupId?: string;
  name: string;
  url: string;
  html: string;
  discussionTopic: string;
  surveyInformation: string;
  surveyTitle: string | undefined;
  surveyCreatorName: string | undefined;
  changeType: ChangeType;
  changeAccessTypeToCommunityAllMember: ChangeAccessTypeToCommunityAllMember;
  changeAccessTypeToCommunityGroup: ChangeAccessTypeToCommunityGroup;
  changeGroupId: ChangeGroupId;
  changeName: ChangeName;
  changeUrl: ChangeUrl;
  changeHtml: ChangeHtml;
  changeDiscussionTopic: ChangeDiscussionTopic;
  changeSurveyInformation: ChangeSurveyInformation;
  changeDiscussionFileBoxId: ChangeDiscussionFileBoxId;
  changeDiscussionContent: ChangeDiscussionContent;
  changeDiscussionRelatedUrlList: ChangeDiscussionRelatedUrlList;
  setDiscussionRelatedUrlList: SetDiscussionRelatedUrlList;
  changeDiscussionPrivateComment: ChangeDiscussionPrivateComment;
  minusDiscussionRelatedUrlList: MinusDiscussionRelatedUrlList;
  relatedUrlList?: RelatedUrl[];
  fileBoxId?: string;
  content?: string;
  privateComment?: boolean;
  feedbackId?: string;
}

const Container: React.FC = function Container({ children }) {
  return <div style={{ display: 'flex', flexDirection: 'column' }}>{children}</div>;
};

interface RowProps {
  title: string;
}

export const Row: React.FC<RowProps> = function Row({ title, children }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#D4D4D5',
        borderBottomStyle: 'solid',
      }}
    >
      <div
        style={{
          borderRightWidth: 1,
          borderRightColor: '#D4D4D5',
          borderRightStyle: 'solid',
          width: 100,
          alignItems: 'center',
          display: 'flex',
          paddingTop: '1em',
          paddingLeft: '1em',
          paddingRight: '1em',
          paddingBottom: '1em',
        }}
      >
        {title}
      </div>
      <div
        style={{
          flex: 1,
          paddingTop: '1em',
          paddingLeft: '1em',
          paddingRight: '1em',
          paddingBottom: '1em',
        }}
      >
        {children}
      </div>
    </div>
  );
};

const MenuInputView: React.FC<MenuInputViewProps> = function MenuInputView({
  menuId,
  type,
  accessType,
  groupId,
  name,
  url,
  html,
  discussionTopic,
  surveyInformation,
  surveyTitle,
  surveyCreatorName,
  changeType,
  changeAccessTypeToCommunityAllMember,
  changeAccessTypeToCommunityGroup,
  changeGroupId,
  changeName,
  changeUrl,
  changeHtml,
  changeDiscussionTopic,
  changeSurveyInformation,
  changeDiscussionFileBoxId,
  changeDiscussionContent,
  changeDiscussionRelatedUrlList,
  setDiscussionRelatedUrlList,
  changeDiscussionPrivateComment,
  minusDiscussionRelatedUrlList,
  relatedUrlList,
  fileBoxId,
  content,
  privateComment,
  feedbackId,
}) {
  const { params } = useRouteMatch<Params>();
  // const [groupList] = useGroupList();

  const [groupList, changeGroupQueryProps, searchQuery, groupQuery, clearGroupQuery, sharedService] = useGroupList();

  changeGroupQueryProps('communityId', params.communityId);

  return (
    <Container>
      <Row title="메뉴 유형">
        <Select
          disabled={!!menuId}
          floated="left"
          placeholder="메뉴 유형을 선택하세요"
          options={menuType}
          value={type}
          onChange={changeType}
        />
      </Row>
      <Row title="접근 권한">
        <div
          style={{
            flexDirection: 'row',
            display: 'flex',
            paddingBottom: '1em',
            alignItems: 'center',
          }}
        >
          <div style={{ paddingRight: '1em' }}>
            <Form.Radio
              label="커뮤니티멤버"
              checked={accessType === 'COMMUNITY_ALL_MEMBER'}
              onClick={changeAccessTypeToCommunityAllMember}
            />
          </div>
          <div style={{ paddingRight: '1em' }}>
            <Form.Radio
              disabled
              label="그룹 지정"
              checked={accessType === 'COMMUNITY_GROUP'}
              onClick={changeAccessTypeToCommunityGroup}
            />
          </div>
          {accessType === 'COMMUNITY_ALL_MEMBER' && (
            <div style={{ paddingRight: '1em' }}>
              <Select disabled floated="left" placeholder="그룹 유형을 선택하세요" options={groupType} />
            </div>
          )}
          {accessType === 'COMMUNITY_GROUP' && (
            <div style={{ paddingRight: '1em' }}>
              <Select
                floated="left"
                placeholder="그룹 유형을 선택하세요"
                options={groupList.results.map((c) => ({
                  key: c.groupId,
                  value: c.groupId,
                  text: c.name,
                }))}
                value={groupId}
                onChange={changeGroupId}
              />
            </div>
          )}
        </div>
        <div style={{ paddingLeft: '2em' }}>
          <ul>
            <li>해당 메뉴에 접근할 수 있는 범위를 설정할 수 있습니다.</li>
            <li>커뮤니티 멤버 : 해당 커뮤니티의 회원인 멤버들이 접근할 수 있습니다.</li>
            <li>그룹 지정 : &lt;멤버 관리&gt; 메뉴에서 등록된 그룹만 접근할 수 있습니다.</li>
          </ul>
        </div>
      </Row>
      <>
        {type === 'CATEGORY' && <CategoryMenuInputView name={name} changeName={changeName} />}
        {(type === 'DISCUSSION' || type === 'ANODISCUSSION') && (
          <DiscussionView
            name={name}
            changeName={changeName}
            detail={false}
            courseSetInfoDescriptionQuillRef={html}
            discussionTopic={discussionTopic}
            changeDiscussionTopic={changeDiscussionTopic}
            changeDiscussionFileBoxId={changeDiscussionFileBoxId}
            changeDiscussionContent={changeDiscussionContent}
            changeDiscussionRelatedUrlList={changeDiscussionRelatedUrlList}
            setDiscussionRelatedUrlList={setDiscussionRelatedUrlList}
            changeDiscussionPrivateComment={changeDiscussionPrivateComment}
            privateComment={privateComment === undefined ? true : privateComment}
            fileBoxId={fileBoxId}
            content={content}
            relatedUrlList={relatedUrlList === undefined ? [getEmptyRelatedUrl()] : relatedUrlList}
            menuId={menuId}
            feedbackId={feedbackId === undefined ? '' : feedbackId}
            minusDiscussionRelatedUrlList={minusDiscussionRelatedUrlList}
          />
        )}
        {(type === 'BASIC' || type === 'ANONYMOUS' || type === 'NOTICE' || type === 'STORE') && (
          <BoardMenuInputView name={name} changeName={changeName} />
        )}
        {type === 'LINK' && <LinkMenuInputView name={name} url={url} changeName={changeName} changeUrl={changeUrl} />}
        {type === 'HTML' && (
          <HtmlMenuInputView name={name} html={html} changeName={changeName} changeHtml={changeHtml} />
        )}
        {type === 'SURVEY' && (
          <SurveyMenuInputView
            name={name}
            changeName={changeName}
            surveyInformation={surveyInformation}
            changeSurveyInformation={changeSurveyInformation}
            surveyTitle={surveyTitle}
            surveyCreatorName={surveyCreatorName}
          />
        )}
      </>
    </Container>
  );
};

export default MenuInputView;
