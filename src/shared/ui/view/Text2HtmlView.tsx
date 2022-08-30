import React, { ReactNode } from 'react';

enum WrapTag {
  DIV,
  P,
}

export interface Props {
  text: string;
  cr2br?: boolean;
  wrapTag?: WrapTag;
}

export default class Text2HtmlView extends React.Component<Props> {
  renderContents() {
    const { text, cr2br, wrapTag } = this.props;

    const isCr2Br = typeof cr2br === 'undefined' ? true : cr2br;
    const wrapTagType = typeof wrapTag === 'undefined' ? WrapTag.DIV : wrapTag;

    const html =
      isCr2Br && text ? text.replace(/[\n\r]/g, '<br/>') : text || '';

    if (wrapTagType === WrapTag.P) {
      return <p dangerouslySetInnerHTML={{ __html: html }} />;
    } else {
      return <div dangerouslySetInnerHTML={{ __html: html }} />;
    }
  }

  render() {
    return this.renderContents();
  }
}

export function changeLineText(value: string): ReactNode {
  //
  if(!value){
    return '';
  }
  const targetValue = value.split('\n').map((line) => {
    return <span>{line}<br /></span>
  })

  return (
    <>{targetValue}</>
  );
}
