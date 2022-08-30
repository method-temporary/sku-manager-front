import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { SupportSideBarLayout } from 'shared/ui';

import {
  AttendListContainer,
  ChannelListContainer,
  CreateFaqContainer,
  CreateNoticeContainer,
  ModifyFaqContainer,
  ModifyNoticeContainer,
  NoticeDetailContainer,
  NoticeListContainer,
} from './index';
import SearchTagListContainer from './searchTag/ui/logic/SearchTagListContainer';
import SearchTagCreateContainer from './searchTag/ui/logic/SearchTagCreateContainer';
import ContentsProviderContainer from './contentsProvider/ui/logic/ContentsProviderListContainer';
import CreateContentsProviderContainer from './contentsProvider/ui/logic/CreateContentsProviderContainer';
import SearchTagDetailContainer from './searchTag/ui/logic/SearchTagDetailContainer';
import CapabilityListContainer from '../../board/capability/ui/logic/CapabilityListContainer';
import { ResultsSendMailContainer, ResultsSendMailDetailContainer } from '../../resultSendMail';
import ConceptListContainer from '../../board/tag/ui/logic/ConceptListContainer';
import { LabelManagementView } from 'labelManagement/LabelManagementView';
import { SmsManagementPage } from 'sms/ui/page/SmsManagementPage';
import { setSmsRoutePath } from 'sms/store/SmsRoutePathStore';
import { SmsSendPage } from 'sms/ui/page/SmsSendPage';
import MailSendFormContainer from 'resultSendMail/MailSendForm/MailSendFormContainer';
import { FaqDetailContainer, FaqListContainer } from 'support/faq';
import { CallQuestionListContainer, QnaDetailContainer, QnaListContainer } from 'support/qna';
import { CreateCategoryContainer } from 'support/category';
import { SmsSenderManagementPage } from 'sms/ui/page/SmsSenderManagementPage';
import { SmsMainNumberManagementPage } from 'sms/ui/page/SmsMainNumberManagementPage';
import { SmsMainNumberCreatePage } from 'sms/ui/page/SmsMainNumberCreatePage';
import { RelatedKeywordListContainer } from '../../search/relatedKeyword/ui/logic/RelatedKeywordListContainer';

class Routes extends React.PureComponent<RouteComponentProps> {
  componentDidMount() {
    const { match } = this.props;
    setSmsRoutePath({
      path: match.url,
    });
  }

  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route
          path={`${match.path}`}
          component={({ match }: any) => (
            <SupportSideBarLayout>
              {/* 공지사항 관리*/}
              <Route exact path={`${match.path}/notice-list`} component={NoticeListContainer} />
              <Route exact path={`${match.path}/notice-create`} component={CreateNoticeContainer} />
              <Route exact path={`${match.path}/notice-detail/:postId`} component={NoticeDetailContainer} />
              <Route exact path={`${match.path}/notice-modify/:postId`} component={ModifyNoticeContainer} />

              {/* FAQ 관리*/}
              <Route exact path={`${match.path}/faq-list`} component={FaqListContainer} />
              <Route exact path={`${match.path}/faq-detail/:postId`} component={FaqDetailContainer} />
              <Route exact path={`${match.path}/faq-create`} component={CreateFaqContainer} />
              <Route exact path={`${match.path}/faq-modify/:postId`} component={ModifyFaqContainer} />

              {/* Q&A 관리 */}
              {/*<Route exact path={`${match.path}/qna-list`} component={QnaListContainer} />*/}
              {/*<Route exact path={`${match.path}/qna-detail/:postId`} component={QnaDetailContainer} />*/}

              {/* 전화 문의 관리 */}
              <Route exact path={`${match.path}/call-question`} component={CallQuestionListContainer} />

              {/* DEPRECATED */}
              {/*<Route*/}
              {/*  exact*/}
              {/*  path={`${match.path}/call-question-detail/:postId`}*/}
              {/*  component={DetailCallQuestionContainer}*/}
              {/*/>*/}

              {/* Channel 관리*/}
              <Route exact path={`${match.path}/channel-list`} component={ChannelListContainer} />

              {/* 카테고리 관리 */}
              <Route exact path={`${match.path}/category-list`} component={CreateCategoryContainer} />

              {/* Tag 관리 */}
              <Route exact path={`${match.path}/tag-list`} component={SearchTagListContainer} />
              <Route exact path={`${match.path}/tag-create`} component={SearchTagCreateContainer} />
              <Route exact path={`${match.path}/tag-modify/:tagId`} component={SearchTagDetailContainer} />

              {/* Term 관리 */}
              <Route exact path={`${match.path}/term-list`} component={ConceptListContainer} />

              <Route exact path={`${match.path}/capability-list`} component={CapabilityListContainer} />

              {/* 교육기관 관리 */}
              <Route exact path={`${match.path}/contentsProvider-list`} component={ContentsProviderContainer} />
              <Route exact path={`${match.path}/contentsProvider-create`} component={CreateContentsProviderContainer} />
              <Route
                exact
                path={`${match.path}/contentsProvider-modify/:contentsProviderId`}
                component={CreateContentsProviderContainer}
              />

              {/* 메일 발송 관리 */}
              <Route exact path={`${match.path}/result-mail`} component={ResultsSendMailContainer} />
              <Route exact path={`${match.path}/result-mail/send-mail`} component={MailSendFormContainer} />
              <Route exact path={`${match.path}/result-mail/detail`} component={ResultsSendMailDetailContainer} />

              {/*다국어 관리 */}
              <Route exact path={`${match.path}/label-management`} component={LabelManagementView} />
              {/* SMS 발송 관리 */}
              <Route exact path={`${match.path}/sms-management`} component={SmsManagementPage} />
              <Route exact path={`${match.path}/sms-send`} component={SmsSendPage} />
              <Route exact path={`${match.path}/sms-sender-management`} component={SmsSenderManagementPage} />
              <Route exact path={`${match.path}/sms-mainnumber-management`} component={SmsMainNumberManagementPage} />
              <Route
                exact
                path={`${match.path}/sms-mainnumber-management/create`}
                component={SmsMainNumberCreatePage}
              />
              <Route
                exact
                path={`${match.path}/sms-mainnumber-management/detail/:mainNumberId`}
                component={SmsMainNumberCreatePage}
              />
              {/* 기타 관리 */}
              <Route exact path={`${match.path}/attende`} component={AttendListContainer} />
              {/* 검색 관리 */}
              <Route exact path={`${match.path}/related-keyword`} component={RelatedKeywordListContainer} />
            </SupportSideBarLayout>
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
