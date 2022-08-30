import { onChangeRegisterDisplay, onChangeRemoveDisplay } from 'feedback/review/event/reviewEvent';
import { ReviewListViewModel } from 'feedback/review/viewmodel/ReviewViewModel';
import React from 'react';
import { Icon, Table } from 'semantic-ui-react';

interface ReviewListViewProps {
  reviewNo: number;
  reviewList?: ReviewListViewModel;
}

export function ReviewListView({ reviewNo, reviewList }: ReviewListViewProps) {
  return (
    <Table celled className="table-fixed">
      <colgroup>
        <col width="5%" />
        <col width="10%" />
        <col width="10%" />
        <col width="8%" />
        <col width="15%" />
        <col width="50%" />
        <col width="10%" />
      </colgroup>

      <Table.Header>
        <Table.Row textAlign="center">
          <Table.HeaderCell>No</Table.HeaderCell>
          <Table.HeaderCell>소속사</Table.HeaderCell>
          <Table.HeaderCell>소속조직(팀)</Table.HeaderCell>
          <Table.HeaderCell>작성자</Table.HeaderCell>
          <Table.HeaderCell>Email</Table.HeaderCell>
          <Table.HeaderCell textAlign="left">내용</Table.HeaderCell>
          <Table.HeaderCell>전시 관리</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {reviewList && reviewList.results.length > 0 ? (
          reviewList.results.map((review, index) => {
            return (
              <React.Fragment key={index}>
                <Table.Row textAlign="center">
                  <Table.Cell>{reviewNo - index}</Table.Cell>
                  <Table.Cell>{review.companyName}</Table.Cell>
                  <Table.Cell>{review.departmentName}</Table.Cell>
                  <Table.Cell>{review.name}</Table.Cell>
                  <Table.Cell>{review.email}</Table.Cell>
                  <Table.Cell textAlign="left">{review.review}</Table.Cell>
                  <Table.Cell>
                    {review.display && review.reviewAnswerId !== undefined && (
                      <a
                        style={{ cursor: 'pointer' }}
                        onClick={() => review.reviewAnswerId && onChangeRemoveDisplay(review.reviewAnswerId)}
                      >
                        노출
                      </a>
                    )}
                    {!review.display && review.evaluationId !== undefined && (
                      <a
                        style={{ cursor: 'pointer' }}
                        onClick={() => review.evaluationId && onChangeRegisterDisplay(review.evaluationId)}
                      >
                        미노출
                      </a>
                    )}
                  </Table.Cell>
                </Table.Row>
              </React.Fragment>
            );
          })
        ) : (
          <Table.Row>
            <Table.Cell textAlign="center" colSpan={10}>
              <div className="no-cont-wrap no-contents-icon">
                <Icon className="no-contents80" />
                <div className="sr-only">콘텐츠 없음</div>
                <div className="text">검색 결과를 찾을 수 없습니다.</div>
              </div>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
}
