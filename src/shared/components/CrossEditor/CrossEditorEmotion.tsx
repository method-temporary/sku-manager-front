import React from 'react';

class CrossEditorEmotion extends React.Component {
  render() {
    return (
      // <div id="CustomLayer" style="">
      <div id="CustomLayer" style={{ display: 'none', position: 'absolute' }}>
        <table style={{ border: '1px' }}>
          <tr>
            <td>크로스에디터 Custom 메뉴 플러그 인 입니다.</td>
          </tr>
        </table>
      </div>
    );
  }
}

export default CrossEditorEmotion;
