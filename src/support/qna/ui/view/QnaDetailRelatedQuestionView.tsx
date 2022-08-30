import * as React from 'react';
import { FormTable } from 'shared/components';
import RelatedQnaRdo from 'support/qna/model/sdo/RelatedQnaRdo';
import { Link } from 'react-router-dom';

interface Props {
  relatedQnaRdos: RelatedQnaRdo[];
  cineroomId: string;
}

class QnaDetailRelatedQuestionView extends React.Component<Props> {
  render() {
    const { relatedQnaRdos, cineroomId } = this.props;

    return (
      <FormTable title="연관 문의 정보">
        {relatedQnaRdos.map((r) =>
          `${r.type}` === 'Before' ? (
            <FormTable.Row name="이전 문의">
              <Link to={`/cineroom/${cineroomId}/service-management/supports/qna-detail/${r.question.id}`}>
                {r.question.title}
              </Link>
            </FormTable.Row>
          ) : (
            <FormTable.Row name="이후 문의">
              <Link to={`/cineroom/${cineroomId}/service-management/supports/qna-detail/${r.question.id}`}>
                {r.question.title}
              </Link>
            </FormTable.Row>
          )
        )}
      </FormTable>
    );
  }
}

export default QnaDetailRelatedQuestionView;
