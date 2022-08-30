import { decorate, observable } from 'mobx';
import { NewDatePeriod } from 'shared/model';

export class PanoptoQueryModel {
  currentPage: string = '1';
  pageSize: string = '10';
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

decorate(PanoptoQueryModel, {
  currentPage: observable,
  pageSize: observable,
  folderId: observable,
  folderOwnerId: observable,
  sessionState: observable,
  searchQuery: observable,
  sessionName: observable,
  college: observable,
  startDate: observable,
  endDate: observable,
});
