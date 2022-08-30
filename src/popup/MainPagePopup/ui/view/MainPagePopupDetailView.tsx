import * as React from 'react';
import { observer } from 'mobx-react';
import { Breadcrumb, Button, Header, Segment } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { Polyglot } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import MainPagePopupModel from '../../model/MainPagePopupModel';

interface Props {
  popup: MainPagePopupModel;
  routeToMainPagePopupList: () => void;
  routeToModifyMainPagePopup: (popupId: string) => void;
  changeDateToString: (date: Date) => string;
}

@observer
@reactAutobind
class MainPagePopupDetailView extends React.Component<Props> {
  //
  render() {
    const { popup, routeToMainPagePopupList, routeToModifyMainPagePopup } = this.props;
    return (
      <Polyglot languages={popup.langSupports}>
        <div>
          <Breadcrumb icon="right angle" sections={SelectType.mainPagePopup} />
          <Header as="h2">팝업 관리</Header>
        </div>
        <div className="content">
          <div className="popup-detail">
            <Segment.Group>
              <Segment padded>
                <Header as="h2" textAlign="left">
                  {popup.title && getPolyglotToAnyString(popup.title)}
                </Header>
                <div className="user-info">
                  <div className="ui profile">
                    <div className="pic" />
                  </div>
                  <span className="date">
                    게시기간 : {popup.period && moment(popup.period.startDate).format('YYYY.MM.DD HH ')} ~
                    {popup.period && moment(popup.period.endDate).format(' YYYY.MM.DD HH')}{' '}
                  </span>
                </div>
              </Segment>
              <Segment>
                <Polyglot.Quill theme="bubble" value={popup && popup.contents} readOnly={true} />
              </Segment>
            </Segment.Group>
          </div>
          <div className="btn-group">
            <div className="fl-right">
              <Button onClick={routeToMainPagePopupList}>목록</Button>
              <Button primary onClick={() => routeToModifyMainPagePopup(popup.id && popup.id)}>
                수정
              </Button>
            </div>
          </div>
        </div>
      </Polyglot>
    );
  }
}

export default MainPagePopupDetailView;
