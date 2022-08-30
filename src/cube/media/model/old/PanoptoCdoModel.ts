import { decorate, observable } from 'mobx';
import { NewDatePeriod } from 'shared/model';

export class PanoptoCdoModel {
  currentPage: string = '1';
  // eslint-disable-next-line camelcase
  page_size: string = '10';
  folderId: string = '';
  folderOwnerId: string = '';
  sessionState: string = '110000'; // 방송 상태
  searchQuery: string = '';
  sessionName: string = '';
  college: string = '';

  period: NewDatePeriod = new NewDatePeriod();

  startDate: number = 0;
  endDate: number = 0;
}

decorate(PanoptoCdoModel, {
  currentPage: observable,
  page_size: observable,
  folderId: observable,
  folderOwnerId: observable,
  sessionState: observable,
  searchQuery: observable,
  sessionName: observable,
  college: observable,
  startDate: observable,
  endDate: observable,
});
