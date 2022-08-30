import React, { Component } from 'react';
import { NumberValue } from '../../../survey/form/model/NumberValue';
import { Table } from 'semantic-ui-react';
import { TranscriptModel } from '../../subtitle/model/TranscriptModel';

interface Props {
  index: number;
  text: string;
  onAddTranscript: () => void;
  onRemoveTranscript: (index: number) => void;
}

interface States {
  newTranscriptItem: NumberValue;
}

class TranscriptItem extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    // this.state = {
    //   newTranscriptItem: new NumberValue()
    // };
  }

  handleAddItem = () => {};

  render() {
    const { index, text, onAddTranscript, onRemoveTranscript } = this.props;

    return (
      <span>Content</span>
      // <span>Content</span>
      //   <b>{index}</b>
      //   <span>Content</span>
      //   <b>{text}</b>
      //   <button onClick={onAddTranscript}>+</button>
    );
  }
}

export default TranscriptItem;
