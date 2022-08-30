import React, { useMemo } from 'react';
import { PostContentsModel } from '../../../post/model/PostContentsModel';
import { Segment, Tab } from 'semantic-ui-react';
import { getDefaultLanguage, getPolyglotToAnyString, LangSupport } from '../../../../../shared/components/Polyglot';

interface NoticeDetailContentsTabProps {
  //
  langSupports: LangSupport[];
  contents: PostContentsModel;
}

export const NoticeDetailContentsTab = ({ contents, langSupports }: NoticeDetailContentsTabProps) => {
  //
  const tabOptions = useMemo(() => {
    //
    const menuItems: { menuItem: string; render: () => JSX.Element }[] = [];

    contents.contents.forEach((content) => {
      if (content.exposureType === 'PC') {
        menuItems.push({
          menuItem: 'PC',
          render: () => (
            <Tab.Pane className="none-styled">
              <div
                dangerouslySetInnerHTML={{
                  __html: getPolyglotToAnyString(content.contents, getDefaultLanguage(langSupports)) || '',
                }}
              />
            </Tab.Pane>
          ),
        });
      } else {
        menuItems.push({
          menuItem: 'Mobile',
          render: () => (
            <Tab.Pane className="none-styled">
              <div
                dangerouslySetInnerHTML={{
                  __html: getPolyglotToAnyString(content.contents, getDefaultLanguage(langSupports)) || '',
                }}
              />
            </Tab.Pane>
          ),
        });
      }
    });

    return menuItems;
  }, [contents]);

  return (
    <>
      <Tab panes={tabOptions} className="styled-tab tab-wrap" />
    </>
  );
};
