import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import DataFavoritesModel from '../../model/DataFavoritesModel';
import moment from 'moment';

interface Props {
  favorites: DataFavoritesModel[];
  startNo: number;
}

class DataFavoritesListView extends React.Component<Props> {
  //
  render() {
    //
    const { favorites, startNo } = this.props;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="15%" />
          <col width="20%" />
          <col width="7%" />
          <col width="10%" />
        </colgroup>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>email</Table.HeaderCell>
            <Table.HeaderCell>name</Table.HeaderCell>
            <Table.HeaderCell>college_name</Table.HeaderCell>
            <Table.HeaderCell>channel_name</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {favorites && favorites.length ? (
            favorites.map((favoriteViewModel, index) => {
              return (
                <Table.Row>
                  <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                  <Table.Cell>{favoriteViewModel.email}</Table.Cell>
                  <Table.Cell>{favoriteViewModel.name}</Table.Cell>
                  <Table.Cell textAlign="center">{favoriteViewModel.collegeName}</Table.Cell>
                  <Table.Cell>{favoriteViewModel.channelName}</Table.Cell>
                </Table.Row>
              );
            })
          ) : (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={6}>
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
}

export default DataFavoritesListView;
