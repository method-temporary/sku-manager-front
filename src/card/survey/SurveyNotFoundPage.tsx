import React from 'react';
import { Tab, Icon } from 'semantic-ui-react';
import CardCreateStore from 'card/create/CardCreate.store';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { observer } from 'mobx-react';

export const SurveyNotFoundPage = observer(() => {
  const { name } = CardCreateStore.instance;

  return (
    <>
      <p className="tab-text">{getPolyglotToAnyString(name)}</p>
      <Tab.Pane>
        <div className="center">
          <div className="no-cont-wrap no-contents-icon">
            <Icon className="no-contents80" />
            <div className="sr-only">콘텐츠 없음</div>
            <div className="text">설문이 없습니다.</div>
          </div>
        </div>
      </Tab.Pane>
    </>
  );
});
