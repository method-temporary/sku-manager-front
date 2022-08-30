import React from 'react';
import { Input } from 'semantic-ui-react';
import { HtmlEditor } from 'shared/ui';
import { Row } from './MenuInputView';
import { ChangeName, ChangeHtml } from '../../service/useSelectedMenu';

interface HtmlMenuInputViewProps {
  name: string;
  changeName: ChangeName;
  html: string;
  changeHtml: ChangeHtml;
}

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
];

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'trike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
};

const HtmlMenuInputView: React.FC<HtmlMenuInputViewProps> = function HtmlMenuInputView({
  name,
  html,
  changeName,
  changeHtml,
}) {
  return (
    <>
      <Row title="메뉴명">
        <Input fluid placeholder="메뉴명을 입력하세요" value={name} onChange={changeName} />
      </Row>
      <HtmlEditor modules={modules} formats={formats} value={html} onChange={changeHtml} onlyHtml />
    </>
  );
};

export default HtmlMenuInputView;
